import { useEffect, useState } from "react";

import DecodeToken from "../api/decode";
import axiosInstance from "../api/axiosintance";
import usePersistentResponse from "../utils/response_message";

export function AllAccounts () {
    const [accounts, setAccounts] = useState([])

    const FetchAccounts = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/account/all/${company}`)
            setAccounts(res.data)
        } catch (error) {
            setAccounts([])
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchAccounts()
    }, [])

    return { accounts, FetchAccounts}
}