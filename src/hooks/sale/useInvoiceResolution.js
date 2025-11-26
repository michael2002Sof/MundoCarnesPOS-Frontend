import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DecodeToken from "../../api/decode";
import axiosInstance from "../../api/axiosintance";

export default function useInvoiceResolution () {
    const [isLoading, setLoading] = useState(false)
    const [invoicesResolution, setInvoiceResolution] = useState([])
    const [invoicesResolutionSiigo, setInvoiceResolutionSiigo] = useState([])
    const GET_InvoiceResolution = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/sale/invoice/resolution/pos/${company}`)
            setInvoiceResolution(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }


    const GET_InvoiceResolutionSiigo = async () => {
        try {
            const token = DecodeToken();
            if (!token) return;

            const company = token.company;
            const res = await axiosInstance.get(`/posinnovate/siigo/sale/invoice/type/${company}`)
            const types = res.data
            setInvoiceResolutionSiigo(types)
            console.log("Resoluciones de Siigo:", types)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const POST_InvoiceResolution = async (resolution) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return
            
            const company = token.company
            const data = {...resolution, company}
            const response = await axiosInstance.post('/posinnovate/siigo/sale/invoice/resolution/pos', data)

            toast.success(response.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
            GET_InvoiceResolution()
        }
    }

    useEffect(() => {
        GET_InvoiceResolution()
    }, [])

    return {isLoading, invoicesResolution, invoicesResolutionSiigo, GET_InvoiceResolutionSiigo, POST_InvoiceResolution}
}