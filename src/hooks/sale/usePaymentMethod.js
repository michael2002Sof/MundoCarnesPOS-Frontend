import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";


export default function usePaymentMethod () {
    const [paymentMethodSiigo, setPaymentMethodSiigo] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [isLoading, setLoading] = useState(false)

    const GET_PaymentMethodSiigo = async () => {
        try {
            const token = DecodeToken();
            if (!token) return;
            const company = token.company;

            const res = await axiosInstance.get(`/posinnovate/siigo/sale/payment/method/${company}`);
            setPaymentMethodSiigo(res.data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const GET_PaymentMethod = async () => {
        try {
            setLoading(true)

            const token = DecodeToken();
            if (!token) return;
            const company = token.company;

            const res = await axiosInstance.get(`/posinnovate/siigo/sale/payment/method/pos/${company}`)
            setPaymentMethods(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const POST_PaymentMethod = async (paymentMethod) => {
        try {
            setLoading(true)

            const token = DecodeToken();
            if (!token) return;
            const company = token.company;

            const data = {...paymentMethod, company}
            const res = await axiosInstance.post('/posinnovate/siigo/sale/payment/method/pos', data)

            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
            GET_PaymentMethod()
        }
    }

    useEffect(() => {
        GET_PaymentMethod()
    }, [])

    return { isLoading, paymentMethodSiigo, paymentMethods, GET_PaymentMethodSiigo, POST_PaymentMethod}
}