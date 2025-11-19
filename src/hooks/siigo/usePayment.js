import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function usePaymentSiigo() {
    const [paymentMethodSiigo, setPaymentMethods] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const GET_PaymentMethodSiigo = async () => {
        try {
            setLoading(true);

            const token = DecodeToken();
            if (!token) return;

            const company = token.company;

            const res = await axiosInstance.get(
                `/posinnovate/siigo/payment/method/${company}`
            );
            const methods = res.data
            const permitidos = [ "Efectivo Local Pequeno", "Efectivo Local Oficina", "Pago por cuenta bancaria Bancolombia"]
            const filteredMethods = methods.filter( m => permitidos.includes(m.name))
            setPaymentMethods(filteredMethods || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GET_PaymentMethodSiigo();
    }, []);

    return { isLoading, paymentMethodSiigo };
}
