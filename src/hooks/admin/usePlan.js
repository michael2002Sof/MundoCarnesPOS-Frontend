import { useState } from "react";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";
import toast from "react-hot-toast";

export default function usePlan() {
    const [plan, setPlan] = useState([]);

    const GET_Plan = async  () => {
        try {

            const token = DecodeToken()
            if (!token) return;

            const admin = token.id;
            const response =  await axiosInstance.get(`/posinnovate/siigo/admin/plan/${admin}`);
            setPlan(response.data);
        } catch (error) {
            toast.error(error.message)
        }
    }
  return { plan, GET_Plan };
}