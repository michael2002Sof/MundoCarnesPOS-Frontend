import { useState, useEffect } from "react";

import axiosInstance from "../api/axiosintance";
import DecodeToken from "../api/decode";
import usePersistentResponse from "../utils/response_message";

export  function GetAllFormConfig () {
    const [ formConfigs, setFormConfigs ] = useState()

    const FetchFormConfigs = async () => {
        try {
            const token = DecodeToken()
            if (!token) return

            const company = token.company
            const res = await axiosInstance.get(`/posinnovate/app/config/form/all/${company}`)
            setFormConfigs(res.data)
        } catch (error) {
            usePersistentResponse(error)
        }
    }
    useEffect (() => {
        FetchFormConfigs()
    }, [])

    return {
        formConfigs, FetchFormConfigs
    }
}