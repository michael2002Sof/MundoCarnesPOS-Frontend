import { useState } from "react";
import DecodeToken from "../../api/decode";
import axiosInstance from "../../api/axiosintance";
import toast from "react-hot-toast";

export default function useCreditNote () {
    const [creditNotes, setCreditNotes] = useState()
    const [isLoading, setLoading] = useState(false)

    const GET_ByDate = async (date) => {
        try {
            setLoading(true)
            
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/creditnote/by/${company}/${date}`)
            setCreditNotes(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return {isLoading, creditNotes, GET_ByDate}
}