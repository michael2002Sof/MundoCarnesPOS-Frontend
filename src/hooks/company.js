import { useEffect, useState } from "react";

import DecodeToken from "../api/decode";
import axiosInstance from "../api/axiosintance";
import usePersistentResponse from "../utils/response_message";

export default function CompanyData () {
    const [company, setCompany] = useState()

    const FetchCompany = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const id = token.company
            const res = await axiosInstance.get(`/posinnovate/api/admin/company/${id}`)
            setCompany(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchCompany()
    }, [])

    return { company, FetchCompany}
}