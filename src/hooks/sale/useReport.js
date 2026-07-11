import { useState } from "react";
import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useReport() {
  const [isLoading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [invoices, setInvoices] = useState([]);
  const [sessionStatic, setSessionStatic] = useState([])

  const GET_InvoicesByDate = async (filters = {}) => {
    try {
      setLoading(true);

      const token = DecodeToken()
      if (!token) return

      const company = token.company;

      const params = new URLSearchParams({...filters, company})

      const res = await axiosInstance.get(
        `/posinnovate/siigo/sale/report/invoice/pos?${params.toString()}`
      );
      const {invoices, totalCount, totalPages } = res.data

      setInvoices(invoices);
      setTotalPages(totalPages)
      setTotalCount(totalCount)
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const GET_InvoicesToExport = async (date, user) => {
    try {
      const token = DecodeToken()
      if (!token) return

      const company = token.company;

      const res = await axiosInstance.get(`/posinnovate/siigo/sale/report/invoice/pos/by/${date}/${company}/${user}`);
      return res.data
    
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const GET_SessionStatic = async (from, to) => {
    try {
      setLoading(true)

      const token = DecodeToken()
      if (!token) return

      const company = token.company
      const res = await axiosInstance.get(`/posinnovate/siigo/sale/report/session/${company}/${from}/${to}`)
      setSessionStatic(res.data)
      
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }



  return { isLoading, totalPages, invoices, totalCount, sessionStatic, GET_SessionStatic, GET_InvoicesByDate, GET_InvoicesToExport };
}