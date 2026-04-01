import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useProductSiigo () {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [isLoadingSearch, setLoadingSearch] = useState(false)

    const create = async () => {
        try {
            setLoading(true)
            const token = DecodeToken()
            if (!token) return
        
            const company = token.company
            const res = await axiosInstance.post('/posinnovate/siigo/product', {company})
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchProduts = async (filters = {}) => {
        try {
            setLoading(true)
            const token = DecodeToken()
            if (!token) return
        
            const company = token.company
            const params = new URLSearchParams(filters)
            const res = await axiosInstance.get(`/posinnovate/siigo/product/${company}?${params.toString()}`)
            return res
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const GET_ProductSiigoByCode = async (code) => {
        try {

            const token = DecodeToken()
            if (!token) return
        
            const company = token.company
            const params = new URLSearchParams({code})
            const res = await axiosInstance.get(`/posinnovate/siigo/product/${company}?${params.toString()}`);
            const productSiigo = res.data[0]
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
            const params = new URLSearchParams({name, page: 1, limit: 5})
            const res = await axiosInstance.get(`/posinnovate/siigo/product/${company}?${params.toString()}`);
            
            setProducts(res.data || [])
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingSearch(false)
        }
    }

    const update = async (data) => {
        try {
            setLoading(true)

            const res = await axiosInstance.put(`/posinnovate/siigo/product`, data)
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }



  return { isLoadingSearch, products, loading, create, update, fetchProduts, GET_ProductSiigoByCode, GET_ProductSiigoByName}
}