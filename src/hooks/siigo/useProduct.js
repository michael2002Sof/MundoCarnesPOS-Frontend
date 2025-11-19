import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useProductSiigo () {
    const [isLoading, setLoading] = useState()

    const GET_ProductSiigoByCode = async (code) => {
        try {
            setLoading(true);

            const token = DecodeToken()
            if (!token) return
        
            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/product/by/${company}/${code}`);
            const productSiigo = res.data
            return productSiigo
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };



  return { isLoading, GET_ProductSiigoByCode}
}