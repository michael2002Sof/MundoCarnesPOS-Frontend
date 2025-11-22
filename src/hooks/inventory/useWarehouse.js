import { useState, useEffect, useRef } from "react";
import DecodeToken from "../../api/decode";
import axiosInstance from "../../api/axiosintance";
import toast from "react-hot-toast";

export default function useWarehouse() {
    const [warehouses, setWarehouses] = useState([])
    const [warehouseSiigo, setWarehouseSiigo] = useState([])
    const [isLoading, setLoading] = useState(false)

    // ← Previene llamadas múltiples en Strict Mode
    const didRun = useRef(false);

    const GET_WarehouseSiigo = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/inventory/warehouse/${company}`)

            setWarehouseSiigo(res?.data)
        } catch (error) {
            toast.error(res?.message);
        }
    }

    const GET_Warehouse = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if(!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/inventory/warehouse/pos/${company}`)
            
            setWarehouses(res?.data)
        } catch (error) {
            toast.error(error?.message);
        } finally {
            setLoading(false)
        }
    }
    const POST_Warehouse = async (warehouse) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const data = { ...warehouse, company}
            const res = await axiosInstance.post('/posinnovate/siigo/inventory/warehouse/pos', data)

            toast.success(res?.message)
        } catch (error) {
            toast.error(res?.message);
        } finally {
            setLoading(false)
            GET_Warehouse()
        }
    }

 
    if (!didRun.current) {
        didRun.current = true;  // ← Se ejecuta una sola vez
        GET_Warehouse();
    }
   

    return { isLoading, warehouseSiigo, warehouses, POST_Warehouse,  GET_WarehouseSiigo}
}