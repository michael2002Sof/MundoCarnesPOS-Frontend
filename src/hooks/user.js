import { useState, useEffect } from "react";

import axiosInstance from "../api/axiosintance";
import DecodeToken from "../api/decode";
import usePersistentResponse from "../utils/response_message";

export  function GetAllRoles () {
    const [ roles, setRoles ] = useState()

    const FetchRoles = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/user/rol/all/${company}`)
            setRoles(res.data)
        } catch (error) {
            usePersistentResponse({ success: false, message: "Error: El sistema fallo al traer los roles"})
        }
    }
    useEffect (() => {
        FetchRoles()
    }, [])

    return {
        roles, FetchRoles
    }
}

export  function GetAllUsers () {
    const [ users, setUsers ] = useState()

    const FetchUsers = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/user/all/${company}`)
            setUsers(res.data)
        } catch (error) {
            usePersistentResponse({ success: false, message: "Error: El sistema fallo al traer los usuarios"})
        }
    }
    useEffect (() => {
        FetchUsers()
    }, [])

    return {
        users, FetchUsers
    }
}