import { useState, useEffect } from "react";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";
import toast from "react-hot-toast";

export default function useCostCenter () {
    const [costCenterSiigo, setCostCenterSiigo] = useState([])
    const [costCenters, setCostCenters] = useState([])
    const [isLoading, setLoading] = useState(false)

    const GET_CostCenterSiigo = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return
            const company = token.company

            const res = await axiosInstance.get(`/posinnovate/siigo/sale/costcenter/${company}`)
            setCostCenterSiigo(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const GET_CostCenter = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return
            const company = token.company
            
            const res = await axiosInstance.get(`/posinnovate/siigo/sale/costcenter/pos/${company}`)
            setCostCenters(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const POST_CostCenter = async (costCenter) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            const company = token.company

            const data = {...costCenter, company}
            const res = await axiosInstance.post(`/posinnovate/siigo/sale/costcenter/pos`, data)

            toast.success(res.message)
            setCostCenters(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
            GET_CostCenter()
        }
    }

    useEffect(() => {
        GET_CostCenter()
    }, [])

    return { isLoading, costCenterSiigo, costCenters, POST_CostCenter,  GET_CostCenterSiigo}
}