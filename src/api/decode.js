import {jwtDecode} from "jwt-decode"

export default function DecodeToken() {
  const token = sessionStorage.getItem("token") 
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    return decoded  //  { id, id_company, rol, type, iat, exp }
  } catch (error) {
    console.error("Error decodificando token:", error)
    return null
  }
}