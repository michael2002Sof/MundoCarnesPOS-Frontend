import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";


export default function useInvoiceSiigo() {
  const [isLoading, setLoading] = useState(false);
  const LS_KEY_BACKUP_INVOICES = "backup_invoices";
  const isProcessingRef = useRef(false);
  const timerRef = useRef(null);


  // --- backups helpers (mínimo) ---
  const readBackups = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY_BACKUP_INVOICES) || "[]"); }
    catch { return []; }
  };
  const writeBackups = (list) => localStorage.setItem(LS_KEY_BACKUP_INVOICES, JSON.stringify(list));
  const upsertBackup = (backup) => {
    const list = readBackups();
    const idx = list.findIndex((b) => b.backupId === backup.backupId);
    if (idx >= 0) list[idx] = backup; else list.unshift(backup);
    writeBackups(list);
  };
  const removeBackup = (backupId) => writeBackups(readBackups().filter((b) => b.backupId !== backupId));

  // --- reprocesar backups pendientes ---
  const processBackups = useCallback(async () => {
    if (isProcessingRef.current) return;

    const backups = readBackups();
    if (backups.length === 0) return;

    isProcessingRef.current = true;

    try {
      const backup = backups[backups.length - 1]; // el más antiguo
      const { backupId, payloadPOS } = backup;

      console.log("⏳ Reintentando backup:", backupId);

      await axiosInstance.post(
        `/posinnovate/siigo/sale/invoice/pos`,
        payloadPOS
      );

      console.log("✅ Backup procesado:", backupId);
      removeBackup(backupId);
    } catch (error) {
      console.log("❌ Falló reproceso, se mantiene en cola");
      // NO se elimina
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const tick = async () => {
      await processBackups();
      timerRef.current = setTimeout(tick, 60000); // 1 minuto
    };

    timerRef.current = setTimeout(tick, 60000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [processBackups]);




  const POST_InvoiceSiigo = async (invoice) => {
    setLoading(true);

    const token = DecodeToken();
    if (!token) {
      setLoading(false);
      return;
    }

    // Datos base (los que se envían a Siigo)
    const baseData = { ...invoice, company: token.company, seller: token.id };
    console.log("Factura generada", baseData );

    try {
      // 1) Crear factura en Siigo
      const resSiigo = await axiosInstance.post(`/posinnovate/siigo/sale/invoice`, baseData);
      toast.success(resSiigo?.message);

      const siigoInvoice = resSiigo?.data ?? {};

      const code = siigoInvoice?.name  ?? "Pendiente...";
      const client = siigoInvoice?.customer?.id ?? "36faa3ab-12cf-45b8-b144-d3c91e6731d2";
      const cufe = siigoInvoice?.stamp?.cufe ?? "Pendiente...";

      // const code = "FV-10-1663";
      // const client = "36faa3ab-12cf-45b8-b144-d3c91e6731d2";
      // const cufe = "17673e54ebc213df6522ae9ff659684b6f3768b80764753de655b1f41b0080dc75956bc9f90f071e3cfbd286599f2cbd  ";

      const payloadPOS = { ...baseData, code, client, cufe };
      console.log("Enviando a POS:", payloadPOS);

      // 2) Backup local *DESPUÉS* de Siigo y *ANTES* de POS
      const backupId = `${payloadPOS.code}`;
      upsertBackup({
        backupId,
        status: "SIIGO_OK_POS_PENDING",
        payloadPOS,
      });

      // 3) Facturar en POS (payload mínimo)
      const resPOS = await axiosInstance.post(`/posinnovate/siigo/sale/invoice/pos`, payloadPOS);
      toast.success(resPOS?.message);

      // 4) Eliminar backup si todo salió bien
      removeBackup(backupId);

      return resPOS?.data;
    } catch (error) {
      toast.error(error?.message);
      if (localStorage.getItem(LS_KEY_BACKUP_INVOICES)?.length > 0) {
        console.log("Factura hecha unicamente en Siigo. Se ha guardado un backup para reintentar más tarde en POS.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, POST_InvoiceSiigo };
}
