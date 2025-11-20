import { useState, useEffect } from "react"
import toast from "react-hot-toast"

import axiosInstance from "../../api/axiosintance"
import DecodeToken from "../../api/decode"

export default function useCashSession () {
    const [ session, setSession ] = useState()
    const [isLoading, setLoading] = useState(false)

    const GET_SessionById = async (id) => {
        try {
            const res = await axiosInstance.get(`/posinnovate/siigo/report/by/${id}`)
            setSession(res.data)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const POST_CashSession = async (sessionCash) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const opened_by = token.id
            const company = token.company
            const data = {...sessionCash, opened_by, company}
            console.log("Session abierta: ", data)
            const res = await axiosInstance.post( "/posinnovate/siigo/cash/open", data);

            localStorage.setItem("SessionCashID", res.data.session);
            toast.success(res.message)

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const POST_CreditNote = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.post('/posinnovate/siigo/creditnote', {company})
            toast.success(res.message)
            
            return true
        } catch (error) {
            toast.error(error.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const PUT_CashSession = async (data) => {
        try {
            setLoading(true)

            const res = await axiosInstance.put( `/posinnovate/siigo/cash/close`, data )
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return {
        isLoading, session, POST_CashSession, GET_SessionById, POST_CreditNote, PUT_CashSession
    }
}