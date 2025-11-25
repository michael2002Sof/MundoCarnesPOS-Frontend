import { useState } from "react";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";
import toast from "react-hot-toast";

export default function useAdmin() {
    const [admin, setAdmin] = useState([]);

    const GET_Admin = async  () => {
        try {

            const token = DecodeToken()
            if (!token) return;

            const admin = token.id;
            const response =  await axiosInstance.get(`/posinnovate/siigo/admin/data/${admin}`);
            setAdmin(response.data);
        } catch (error) {
            toast.error(error.message)
        }
    }
  // Aquí puedes agregar la lógica para manejar el estado y las funciones relacionadas con el administrador
  return { admin, GET_Admin };
}