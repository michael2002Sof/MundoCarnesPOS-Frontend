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

          //const res = await axiosInstance.post( `/posinnovate/siigo/invoice`, data);
          //toast.success(res.message)

          //const invoicePOS = {...data, code: res?.data?.name, client: res?.data?.customer?.id}

          const invoicePOS = {
  "company": 1,
  "code": "FV-2-14009",
  "sale_point": 2,
  "cash_session": "1",
  "seller": 957,

  "client": "36faa3ab-12cf-45b8-b144-d3c91e6731d2",

  "subtotal": 28000,
  "tax0": 0,
  "tax5": 0,
  "tax19": 0,
  "total": 28000,

  "receipt_cash": 30000,
  "receipt_transfer": 0,
  "total_payment": 28000,
  "repay": 2000,

  "observations": "Venta realizada en punto de venta",
  "date": "2025-11-19",

  "document": {
    "id": 26301
  },

  "customer": {
    "person_type": "Person",
    "id_type": "13",
    "identification": "222222222222",
    "name": "Cliente de Prueba",
    "address": {
      "address": "Calle 123"
    }
  },

  "payments": [
    {
      "payment_method": 1,
      "value": 28000
    }
  ],

  "globaldiscounts": [
    {
      "percentage": 0,
      "value": 0
    }
  ],

  "invoiceItem": [
    {
      "product_name": "Arroz 500g",
      "product_barcode": "7701234567890",
      "quantity": 1,
      "unit_price": 28000,
      "tax0": 0,
      "tax5": 0,
      "tax19": 0,
      "total": 28000
    }
  ],

  "items": [
    {
      "code": "7701234567890",
      "description": "Arroz 500g",
      "quantity": 1,
      "price": 28000
    }
  ],

  "mail": { "send": true },
  "stamp": { "send": true },
  "additional_fields": {}
}


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
