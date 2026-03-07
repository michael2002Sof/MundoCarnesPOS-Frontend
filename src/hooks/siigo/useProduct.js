import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useProductSiigo () {
    const [products, setProducts] = useState([])
    const [isLoadingSearch, setLoadingSearch] = useState(false)

    const GET_ProductSiigoByCode = async (code) => {
        try {

            const token = DecodeToken()
            if (!token) return
        
            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/product/by/${company}/${code}`);
            const productSiigo = res.data
            return productSiigo
        } catch (error) {
            toast.error(error.message);
        }
    };

    const GET_ProductSiigoByName = async (name) => {
        try {
            setLoadingSearch(true);

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/product/search/${company}/${name}`);
            
            setProducts(res.data || [])
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingSearch(false)
        }
    }



  return { isLoadingSearch, products, GET_ProductSiigoByCode, GET_ProductSiigoByName}
}