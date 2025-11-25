import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DecodeToken from "../../api/decode";
import axiosInstance from "../../api/axiosintance";

export default function useInvoiceResolution () {
    const [invoicesResolution, setInvoiceResolution] = useState([])
    const GET_InvoiceResolution = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/sale/invoice/resolution/pos/${company}`)
            setInvoiceResolution(res.data)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        GET_InvoiceResolution()
    }, [])

    return {invoicesResolution}
}