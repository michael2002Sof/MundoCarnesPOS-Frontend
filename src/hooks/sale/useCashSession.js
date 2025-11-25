import { useState, useEffect } from "react"
import toast from "react-hot-toast"

import axiosInstance from "../../api/axiosintance"
import DecodeToken from "../../api/decode"

export function useCashSession () {
    const [ session, setSession ] = useState()
    const [isLoading, setLoading] = useState(false)

    const GET_SessionById = async (id) => {
        try {
            const res = await axiosInstance.get(`/posinnovate/siigo/sale/report/by/${id}`)
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
            const res = await axiosInstance.post( "/posinnovate/siigo/sale/cash/open", data);

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

            const res = await axiosInstance.put( `/posinnovate/siigo/sale/cash/close`, data )
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



export function useSessionId() {
    const [sessionId, setSessionId] = useState(null);

    const GET_SessionId = async (point) => {
        if (!point) return;

        try {
            const token = DecodeToken();
            if (!token) return;

            const { company } = token;
            const res = await axiosInstance.get(`/posinnovate/siigo/sale/cash/${company}/${point}`);

            setSessionId(res.data);
        } catch (err) {
            toast.error("No se pudo obtener la sesión de caja");
        }
    };

    return {sessionId, GET_SessionId};
}
