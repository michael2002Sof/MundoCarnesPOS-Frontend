import { useState, useEffect, useRef } from "react";
import DecodeToken from "../../api/decode";
import axiosInstance from "../../api/axiosintance";
import toast from "react-hot-toast";

export default function useMovement() {
    const [movements, setMovements] = useState([])
    const [pages, setPages] = useState(1)
    const [isLoading, setLoading] = useState(false)

    // ← Previene llamadas múltiples en Strict Mode
    const didRun = useRef(false);

    const FetchMovement = async (filters = {}) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if(!token) return

            const company = token.company
            const params = new URLSearchParams(filters)
            const res = await axiosInstance.get(`/posinnovate/siigo/inventory/movement/${company}?${params.toString()}`)
            
            setMovements(res?.data)
            setPages(res?.pages)
        } catch (error) {
            toast.error(error?.message);
        } finally {
            setLoading(false)
        }
    }
   

    return { isLoading, movements, pages, FetchMovement}
}