import { useState } from "react";
import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useReport() {
  const [isLoading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [invoices, setInvoices] = useState([]);

  const GET_InvoicesByDate = async (date, user, page = 1) => {
    try {
      setLoading(true);

      const token = DecodeToken()
      if (!token) return

      const company = token.company;

      const res = await axiosInstance.get(`/posinnovate/siigo/sale/report/invoice/pos/by/${date}/${company}/${user}/${page}`);
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



  return { isLoading, totalPages, invoices, totalCount, GET_InvoicesByDate, GET_InvoicesToExport };
}