import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useCashSiigo() {
    const [allCash, setAllCash] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const GET_AllCashSiigo = async () => {
        try {
            setLoading(true);

            const token = DecodeToken();
            if (!token) return;

            const company = token.company;

            const res = await axiosInstance.get(
                `/posinnovate/api/account/siigo/cash/all/${company}`
            );

            setAllCash(res.data || []);
        } catch (err) {
            toast.error("Error al sincronizar cajas desde Siigo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GET_AllCashSiigo();
    }, []);

    return { isLoading, allCash, GET_AllCashSiigo };
}
