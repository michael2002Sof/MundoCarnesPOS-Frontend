import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useUser () {
    const [isLoading, setLoading] = useState(false)
    const [ allUsers, setAllUsers ] = useState([])

    const GET_Users = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/api/user/all/${company}`)

            setAllUsers(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const POST_User = async (user) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const data = {...user, company}
            const res = await axiosInstance.post('/posinnovate/api/siigo/user/register', data)

            GET_Users()
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const PUT_User = async (data) => {
        try {
            setLoading(true)

            const res = await axiosInstance.put('/posinnovate/api/user/update', data)
        
            GET_Users()
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const DELETE_User = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return
        try {
            setLoading(true)

            const res = await axiosInstance.delete(`/posinnovate/app/user/delete/${id}`)
            toast.success(res.message)
            GET_Users()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect (() => {
        GET_Users()
    }, [])

    return {
        isLoading, allUsers, GET_Users, POST_User, PUT_User, DELETE_User
    }
}