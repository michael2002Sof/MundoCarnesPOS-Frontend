import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useBranch () {
    const [branchs, setBranchs] = useState([])
    const [isLoading, setLoading] = useState(false)

    const GET_Branch = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/branch/${company}`)
            setBranchs(res.data)
    
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const POST_Branch = async (branch) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const data = {...branch, company}
            const res = await axiosInstance.post('/posinnovate/siigo/branch', data)
            toast.success(res.message)
            
        } catch (error) {
            toast.error(res.message)
        } finally {
            setLoading(false)
            GET_Branch()
        }
    }

    const PUT_Branch = async (data) => {
        try {
            setLoading(true)

            console.log(data)
            const res = await axiosInstance.put('/posinnovate/siigo/branch', data)
            toast.success(res.message)

        } catch (error) {
            toast.error(res.message)
        } finally {
            setLoading (false)
            GET_Branch()
        }
    }

    useEffect(() => {
        GET_Branch()
    }, [])

    return {isLoading, branchs, POST_Branch, PUT_Branch}
}