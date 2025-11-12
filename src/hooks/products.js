import { useState, useEffect } from "react";

import axiosInstance from "../api/axiosintance";
import DecodeToken from "../api/decode";
import usePersistentResponse from "../utils/response_message";

export  function GetAllProducts () {
    const [ products, setProducts ] = useState()

    const FetchProducts = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/inventory/product/all/${company}`)
            setProducts(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchProducts()
    }, [])

    return {
        products, FetchProducts
    }
}