import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";


export default function useCompany() {
    const [company, setCompany] = useState([]);

    const GET_Company = async  () => {
        try {

            const token = DecodeToken()
            if (!token) return;

            const company = token.company;
            const response =  await axiosInstance.get(`/posinnovate/siigo/admin/company/${company}`);
            setCompany(response.data);
        } catch (error) {
            toast.error(error.message)
        }
    }
  // Aquí puedes agregar la lógica para manejar el estado y las funciones relacionadas con el administrador
  return { company, GET_Company };
}