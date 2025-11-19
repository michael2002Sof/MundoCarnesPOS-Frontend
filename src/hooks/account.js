import { useEffect, useState } from "react";

import DecodeToken from "../api/decode";
import axiosInstance from "../api/axiosintance";
import usePersistentResponse from "../utils/response_message";
import toast from "react-hot-toast";

export default function useAccount () {
    const [account, setAccount] = useState([])
    const [isLoading, setLoading] = useState(false)

    const GET_Account = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/account/${company}`)
            setAccount(res.data)
        } catch (error) {
            setAccount([])
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }

    const POST_Account = async (account) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const data = {...account, company}
            const res = axiosInstance.post('/posinnovate/siigo/account', data)

            toast.success(res.message)
            GET_Account()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const PUT_Account = async (data) => {
        try {
            setLoading(true)

            const res = axiosInstance.put('/posinnovate/siigo/account', data)
            toast.success(res.message)
            GET_Account()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(true)
        }
    }
    useEffect (() => {
        GET_Account()
    }, [])

    return { isLoading, account, POST_Account, PUT_Account}
}