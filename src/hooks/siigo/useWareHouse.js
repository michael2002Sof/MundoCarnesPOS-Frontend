import { useEffect, useState } from "react"

import axiosInstance from "../../api/axiosintance"
import DecodeToken from "../../api/decode"
import toast from "react-hot-toast"

export default function useWareHouse () {
    const [wareHouses, setWareHouses] = useState([])

    const GET_WareHouse = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/warehouse/${company}`)
            setWareHouses(res.data)

        } catch (error) {
            toast.error(res.message)
        }
    }

    useEffect(() => {
        GET_WareHouse()
    }, [])

    return {wareHouses}
}