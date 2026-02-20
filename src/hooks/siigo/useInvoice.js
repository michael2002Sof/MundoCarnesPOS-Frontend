import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";


export default function useInvoiceSiigo() {
  const [isLoading, setLoading] = useState(false);

  const POST_InvoiceSiigo = async (invoice, retries = 2) => {
    setLoading(true);

    const token = DecodeToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const company = token.company

    // Datos base (los que se envían a Siigo)
    const baseData = { ...invoice, company, seller: token.id };
    //console.log("Factura generada", baseData );

    try {
      // 1) Crear factura en Siigo
      const resSiigo = await axiosInstance.post(`/posinnovate/siigo/sale/invoice`, baseData);
      toast.success(resSiigo.message);

      const siigoInvoice = resSiigo.data ?? {};
      //console.log("Factura devuelta por siigo", siigoInvoice)

      const code = siigoInvoice?.name  ?? "Pendiente...";
      const client = siigoInvoice?.customer.id ?? "36faa3ab-12cf-45b8-b144-d3c91e6731d2";
      let cufe = siigoInvoice?.stamp?.cufe ?? "Pendiente...";

      if (cufe === "Pendiente...") {
        await new Promise(r => setTimeout(r, 5000))
        const invoiceWithCufe = await axiosInstance.get(`/posinnovate/siigo/sale/invoice/by/${code}/${company}`)
        cufe = invoiceWithCufe.data?.stamp?.cufe ?? "Documento en proceso de validación DIAN..."
      }

      const payloadPOS = { ...baseData, code, client, cufe };
      //console.log("Enviando a POS:", payloadPOS);


      // 3) Facturar en POS (payload mínimo)
      const resPOS = await axiosInstance.post(`/posinnovate/siigo/sale/invoice/pos`, payloadPOS);
      toast.success(resPOS?.message);

      return resPOS?.data;
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, POST_InvoiceSiigo };
}
