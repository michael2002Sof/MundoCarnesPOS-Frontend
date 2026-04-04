import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

const generateCode = () => {
  const prefix = "FV";          // tipo documento
  const branch = "10";          // sucursal (puede venir de estado)
  const random = Math.floor(1000 + Math.random() * 9000); // 4 dígitos

  return `${prefix}-${branch}-${random}`;
};


export default function useInvoiceSiigo() {
  const [isLoading, setLoading] = useState(false);

  const POST_InvoiceSiigo = async (invoice) => {
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
      console.log("Factura devuelta por siigo", siigoInvoice)

      const code = siigoInvoice?.name  ?? "Pendiente...";
      const client = siigoInvoice?.customer?.id ?? "36faa3ab-12cf-45b8-b144-d3c91e6731d2";
      let cufe = siigoInvoice?.stamp?.cufe ?? "Pendiente...";

      // 2) Intentar buscar CUFE (pero sin romper el flujo)
      if (cufe === "Pendiente...") {
        try {

          await new Promise(r => setTimeout(r, 5000));

          const invoiceWithCufe = await axiosInstance.get(
            `/posinnovate/siigo/sale/invoice/by/${code}/${company}`
          );

          cufe = invoiceWithCufe?.data?.stamp?.cufe ?? "Documento en proceso de validación DIAN...";
        } catch (error) {
          console.warn("No se pudo obtener el CUFE todavía");
          cufe = "Documento en proceso de validación DIAN...";
        }

      }

      // const code = "FV-10-5008"
      // const client = "36faa3ab-12cf-45b8-b144-d3c91e6731d2"
      // let cufe = "d192539b25e54a0cc36f5d5d6e227bd566cc84008482f91f4824e8fc68031607cd5ff9dfa04c0b8fee99b5707cc5a4bd "

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

  const POST_InvoicePOS = async (invoice) => {
    try {
      const code = "FV-10-5008"
      const client = "36faa3ab-12cf-45b8-b144-d3c91e6731d2"
      let cufe = "....."
    } catch (error) {
      
    }
  }

  return { isLoading, POST_InvoiceSiigo, POST_InvoicePOS };
}
