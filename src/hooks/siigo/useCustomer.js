import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useCustomerSiigo() {
    const [allCustomers, setAllCustomers] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const GET_AllCustomerSiigo = async () => {
        try {
            setLoading(true);

            const token = DecodeToken();
            if (!token) return;

            const company = token.company;

            const res = await axiosInstance.get(
                `/posinnovate/siigo/customer/all/${company}`
            );

            setAllCustomers(res.data || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const GET_CustomerSiigoByIdentification = async (identification) => {
        try {
            setLoading(true);

            const token = DecodeToken()
            if (!token) return
        
            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/customer/by/${company}/${identification}`);
            const customer = res.data
            return customer
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { isLoading, allCustomers, GET_CustomerSiigoByIdentification };
}
