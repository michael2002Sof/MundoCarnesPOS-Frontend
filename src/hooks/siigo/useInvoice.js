import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useInvoiceSiigo() {
  const [isLoading, setLoading] = useState(false);
  const [typeInvoiceSiigo, setTypeInvoice] = useState()

  const POST_InvoiceSiigo = async (invoice) => {
      try {
          setLoading(true);

          const token = DecodeToken();
          if (!token) return;

          const company = token?.company;
          const seller = token?.id
          const data = {...invoice, company, seller}
          console.log("Factura generada", data)

          const res = await axiosInstance.post( `/posinnovate/siigo/sale/invoice`, data);
          toast.success(res.message)

          //const invoicePOS = { ...invoice, company, seller, code: "FV-2-14046", client: "36faa3ab-12cf-45b8-b144-d3c91e6731d2", cufe: stamp.cufe}

          const invoicePOS = {...data, code: res?.data?.name, client: res?.data?.customer?.id, cufe: res?.data?.stamp.cufe}

          console.log("Factura para enviar a mi pos: ", invoicePOS)
          const resPOS = await axiosInstance.post( `/posinnovate/siigo/sale/invoice/pos`, invoicePOS)
          toast.success(resPOS.message)
          return resPOS.data
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
  };


  const GET_TypeInvoices = async () => {
      try {
          const token = DecodeToken();
          if (!token) return;

          const company = token.company;
          const res = await axiosInstance.get(`/posinnovate/siigo/sale/invoice/type/${company}`)
          setTypeInvoice(res.data)
      } catch (error) {
          toast.error(error.message)
      }
  }

  return { isLoading, typeInvoiceSiigo, POST_InvoiceSiigo };
}
