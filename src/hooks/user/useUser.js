import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosintance";
import DecodeToken from "../../api/decode";

export default function useUser() {
    const [UsersSiigo, setAllUsers] = useState([]);
    const [usersPOS, setUsersPOS] = useState([])
    const [isLoading, setLoading] = useState(false);

    const GET_UsersSiigo = async () => {
        try {
            setLoading(true);

            const token = DecodeToken();
            if (!token) return;

            const company = token.company;

            const res = await axiosInstance.get(
                `/posinnovate/siigo/user/${company}`
            );

            setAllUsers(res.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const GET_UsersPOS = async () => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/siigo/user/pos/${company}`)

            setUsersPOS(res.data)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const POST_User = async (user) => {
        try {
            setLoading(true)

            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const data = {...user, company}
            const res = await axiosInstance.post('/posinnovate/siigo/user/pos', data)

            GET_UsersPOS()
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const PUT_User = async (data) => {
        try {
            setLoading(true)

            const res = await axiosInstance.put('/posinnovate/siigo/user', data)
        
            GET_UsersPOS()
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GET_UsersSiigo();
        GET_UsersPOS()
    }, []);

    return { isLoading, UsersSiigo, usersPOS, POST_User, PUT_User };
}
