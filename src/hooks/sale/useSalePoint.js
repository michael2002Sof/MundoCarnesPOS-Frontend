import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useSalePoint () {
    const [salePoints, setSalePoints] = useState([])
    const [isLoading, setLoading] = useState(false)

    const GET_SalePoint = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/sale/point/${company}`)
            setSalePoints(res.data)

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const POST_SalePoint = async (salePoint) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const data = {...salePoint, company}
            console.log("datos del punto de venta a crear:", data)
            const res = await axiosInstance.post('/posinnovate/siigo/sale/point', data)
            toast.success(res.message)

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
            GET_SalePoint()
        }

    }

    const PUT_SalePoint = async (data) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const payload = {...data, company}

            const res = await axiosInstance.put('/posinnovate/siigo/sale/point', payload)
            toast.success(res.message)
            GET_SalePoint()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        GET_SalePoint()
    }, [])

    return { isLoading, salePoints, POST_SalePoint, GET_SalePoint, PUT_SalePoint}
}