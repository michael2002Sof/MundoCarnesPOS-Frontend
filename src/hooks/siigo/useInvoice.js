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

          const company = token.company;
          const seller = token.id
          const cash_session = localStorage.getItem("SessionCashID")
          const data = {...invoice, company, seller, cash_session}
          console.log("Factura generada", data)

          const res = await axiosInstance.post( `/posinnovate/siigo/invoice`, data);
          toast.success(res.message)

          const invoicePOS = {...data, code: res?.data?.name, client: res?.data?.customer?.id}

          console.log("Factura para enviar a mi pos: ", invoicePOS)
          const resPOS = await axiosInstance.post( `/posinnovate/siigo/invoice/pos`, invoicePOS)
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
          const res = await axiosInstance.get(`/posinnovate/siigo/invoice/type/${company}`)
          const types = res.data
          const filteredTypes = types.filter((t) => t.code === "2")
          setTypeInvoice(filteredTypes[0])
      } catch (error) {
          toast.error(error.message)
      }
  }

  useEffect(() => {
    GET_TypeInvoices()
  }, [])

  return { isLoading, typeInvoiceSiigo, POST_InvoiceSiigo };
}
