import { useState } from "react";
import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useReport() {
  const [isLoading, setLoading] = useState(false);
  const [invoices, setIncoices] = useState([]);

  const GET_InvoicesByDate = async (date) => {
    try {
      setLoading(true);

      const token = DecodeToken()
      if (!token) return

      const company = token.company;
      const user = token.id
      const response = await axiosInstance.get(`/posinnovate/siigo/sale/report/invoice/pos/by/${date}/${company}/${user}`);
      setIncoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, invoices, GET_InvoicesByDate };
}