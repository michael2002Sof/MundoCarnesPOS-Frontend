import { useState, useEffect } from "react";

import axiosInstance from "../api/axiosintance";
import DecodeToken from "../api/decode";
import usePersistentResponse from "../utils/response_message";

export  function GetAllCustomers () {
    const [ customers, setCustomers ] = useState()

    const FetchCustomers = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/customer/all/${company}`)
            setCustomers(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchCustomers()
    }, [])

    return {
        customers, FetchCustomers
    }
}