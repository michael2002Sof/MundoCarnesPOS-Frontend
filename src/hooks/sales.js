import { useState, useEffect } from "react";

import axiosInstance from "../api/axiosintance";
import DecodeToken from "../api/decode";
import usePersistentResponse from "../utils/response_message";

export  function GetAllBranchs () {
    const [ branchs, setBranchs ] = useState()

    const FetchBranchs = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/sale/branch/all/${company}`)
            setBranchs(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchBranchs()
    }, [])

    return {
        branchs, FetchBranchs
    }
}


export  function GetAllSalesPoint () {
    const [ salesPoints, setSalesPoints ] = useState()

    const FetchSalesPoints = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/sale/salepoint/all/${company}`)
            setSalesPoints(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchSalesPoints()
    }, [])

    return {
        salesPoints, FetchSalesPoints
    }
}


export  function GetSessionById (id) {
    const [ session, setSession ] = useState()

    const FetchSession = async () => {
        try {
            const res = await axiosInstance.get(`/posinnovate/app/sale/report/session/${id}`)
            setSession(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchSession()
    }, [])

    return {
        session, FetchSession
    }
}

export function GetInvoiceByCode (code) {
    const [ invoice, setInvoice ] = useState()

    const FetchInvoice = async () => {
        try {
            const res = await axiosInstance.get(`/posinnovate/app/sale/report/invoice/${code}`)
            setInvoice(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchInvoice()
    }, [])

    return {
        invoice, FetchInvoice
    }
}

export function GetAllCreditNote (code) {
    const [ creditNotes, setCreditNotes ] = useState()


    const FetchCreditNotes = async () => {
        try {
            const token = DecodeToken()
            if (!token) return
            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/sale/return/all/${company}`)
            setCreditNotes(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchCreditNotes()
    }, [])

    return {
        creditNotes, FetchCreditNotes
    }
}


