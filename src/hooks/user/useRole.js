import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useRole () {
    const [isLoading, setLoading] = useState(false)
    const [allRoles, setAllRoles] = useState([])

    const GET_AllRoles = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/user/rol/${company}`)

            setAllRoles(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const POST_Role = async (role) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const data = {...role, company: company}
            const res = await axiosInstance.post('/posinnovate/siigo/user/rol', data)

            GET_AllRoles()
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const PUT_Role = async (data) => {
        try {
            setLoading(true)

            const res = await axiosInstance.put('/posinnovate/siigo/user/rol', data)
            GET_AllRoles()
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GET_AllRoles()
    }, [])
     
    return { isLoading, allRoles, GET_AllRoles, POST_Role, PUT_Role}
}