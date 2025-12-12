import { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

const LS_KEY_FAILED_INVOICES = "failed_pos_invoices";

export default function useInvoiceSiigo() {
  const [isLoading, setLoading] = useState(false);
  const isSyncingRef = useRef(false);

  // -------------------------------------------------------
  // HELPER: RETRY LOGIC (Genérico)
  // -------------------------------------------------------
  const retryRequest = async (callback, retries = 1, delay = 1500) => {
    try {
      return await callback();
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise((res) => setTimeout(res, delay));
      return retryRequest(callback, retries - 1, delay);
    }
  };

  // -------------------------------------------------------
  // HELPER: LOCAL STORAGE MANAGER (Lectura segura)
  // -------------------------------------------------------
  const getQueue = () => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY_FAILED_INVOICES) || "[]");
    } catch (e) {
      return [];
    }
  };

  const addToQueue = (invoice) => {
    const current = getQueue();
    // Evitar duplicados basados en el código de factura si es posible
    if (!current.find((i) => i.code === invoice.code)) {
      localStorage.setItem(LS_KEY_FAILED_INVOICES, JSON.stringify([...current, invoice]));
    }
  };

  // -------------------------------------------------------
  // PROCESO DE FONDO (BACKGROUND SYNC)
  // -------------------------------------------------------
  const processPendingInvoices = useCallback(async () => {
    // Si ya está sincronizando, no hacer nada (semáforo)
    if (isSyncingRef.current) return;
    
    const queue = getQueue();
    if (queue.length === 0) return;

    isSyncingRef.current = true;
    console.log(`🔄 Sincronizando ${queue.length} facturas pendientes...`);

    const successfulCodes = [];

    // Iteramos secuencialmente para no saturar el servidor
    for (const invoice of queue) {
      try {
        await axiosInstance.post(`/posinnovate/siigo/sale/invoice/pos`, invoice);
        
        // Solo mostramos toast si es relevante, para no spamear al usuario
        toast.success(`Factura ${invoice.code} sincronizada correctamente`, { id: `sync-${invoice.code}` });
        successfulCodes.push(invoice.code);
      } catch (err) {
        console.warn(`⚠️ Falló reintento background para ${invoice.code}:`, err.message);
        // No hacemos nada, se queda en la lista para la próxima vuelta
      }
    }

    // Actualización SEGURA del LocalStorage
    if (successfulCodes.length > 0) {
      // Re-leemos la cola por si se agregó algo nuevo mientras procesábamos (Concurrency safety)
      const currentQueue = getQueue(); 
      const newQueue = currentQueue.filter(inv => !successfulCodes.includes(inv.code));
      localStorage.setItem(LS_KEY_FAILED_INVOICES, JSON.stringify(newQueue));
    }

    isSyncingRef.current = false;
  }, []);


  // -------------------------------------------------------
  // USE EFFECT: INTERVALO
  // -------------------------------------------------------
  useEffect(() => {
    // Ejecutar al montar para limpiar pendientes viejos
    processPendingInvoices();

    const interval = setInterval(() => {
      processPendingInvoices();
    }, 3 * 60 * 1000); // 3 minutos

    return () => clearInterval(interval);
  }, [processPendingInvoices]);


  // -------------------------------------------------------
  // FUNCIÓN PRINCIPAL: CREAR FACTURA
  // -------------------------------------------------------
  const POST_InvoiceSiigo = async (invoice) => {
    setLoading(true);
    try {
      const token = DecodeToken();
      if (!token) return;

      const data = {
        ...invoice, 
        company: token?.company, 
        seller: token?.id
      }
      //console.log("Factura generada", data)


      // -------------------------------------------------------
      // 1. CREAR FACTURA EN SIIGO
      // Si falla aquí, se detiene todo y lanza error.
      // -------------------------------------------------------
      let resSiigo
      try {
        resSiigo = await axiosInstance.post( `/posinnovate/siigo/sale/invoice`, data);
        toast.success(resSiigo.message)
      } catch (error) {
        toast.error(error.message);
        throw error
      }

      // Preparar datos para POS con la info oficial de Siigo
      const invoicePOS = {
        ...data, 
        code: resSiigo?.data?.name || "SIN-CODIGO", 
        client: resSiigo?.data?.customer?.id || "36faa3ab-12cf-45b8-b144-d3c91e6731d2", 
        cufe: resSiigo?.data?.stamp?.cufe || "SIN-CUFE"
      }
      //console.log("Enviando a POS:", invoicePOS);

      // -------------------------------------------------------
      // 2. FACTURA POS (CON RETRY & FALLBACK)
      // -------------------------------------------------------
      const registerPOS = async () => axiosInstance.post( `/posinnovate/siigo/sale/invoice/pos`, invoicePOS)
      try {
        const resPOS = await retryRequest(registerPOS, 1)
        toast.success(resPOS.message)
        return resPOS.data
      } catch (error) {
        // -------------------------------------------------------
        // 3. FALLBACK: GUARDAR EN LOCAL (OFFLINE MODE)
        // -------------------------------------------------------
        addToQueue(invoicePOS);
        toast("Factura guardada localmente. Se sincronizará automáticamente en 3 minutos", {
          icon: '⚠️',
          duration: 5000
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, POST_InvoiceSiigo };
}
