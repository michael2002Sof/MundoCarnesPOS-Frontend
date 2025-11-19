import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import DecodeToken from "../../api/decode";
import axiosInstance from "../../api/axiosintance";

export default function useCostCenterSiigo () {
    const [costCenterSiigo, setCostCenterSiigo] = useState([])
    const [isLoading, setLoading] = useState(false)

    const GET_CostCenterSiigo = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            const company = token.company

            const res = await axiosInstance.get(`/posinnovate/siigo/costcenter/${company}`)
            setCostCenterSiigo(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GET_CostCenterSiigo()
    }, [])

    return {costCenterSiigo}

}