import { useState } from "react";
import { Lock, Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosintance";
import handleInputChange from "../utils/handleInputChange";

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res
    try {
      res = await axiosInstance.post("/posinnovate/app/auth/login", user)
      console.log("respuesta del backend:",  res)
      setMessage(res.message)
      sessionStorage.setItem("token", res.token)
      setTimeout(() => {  navigate("/home") }, 2000);
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false);
      setTimeout(() => {setMessage("")}, 2000);
    }
  };

  return (
    <div className="bg-amber-100 min-h-screen flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#841A1A] text-amber-100 p-10 w-full max-w-md rounded-2xl shadow-2xl space-y-6 transition-all duration-300"
      >
        <div className="flex flex-col justify-center items-center">
          <img src="/logo.svg" width={130} className="mb-2"/>
          <h1 className="text-3xl relative flex justify-center font-extrabold text-centertracking-wide">
            Mundo Carnes POS
            {message && (
              <p className="text-center absolute px-2 font-light top-7 text-amber-200 text-sm py-2 rounded-lg">
                {message}
              </p>
            )}
          </h1>
        </div>
        {/* -- Campos del formulario -- */}
        <div className="space-y-4">
            {[
                { icon: Mail, name: "email", label: "Correo Electronico", placeholder: "Correo de usuario", type: "text"},
                { icon: Lock, name: "password", label: "Contraseña", placeholder: "Contraseña del usuario", type: "password"},

            ].map((field) => (
                <section key={field.name}>
                    <label className="block text-sm font-semibold mb-1">{field.name}</label>
                    {field.type === "password" ? (
                        <div className="flex items-center bg-[#6E1515] text-amber-100/60 rounded-lg">
                            <field.icon className="ml-3" />
                            <input value={user[field.name]} placeholder={field.placeholder} type={showPassword ? "text" : "password"} onChange={(e) => handleInputChange(setUser, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                            <button onClick={() => setShowPassword(showPassword ? false : true)} className="mr-3 cursor-pointer">{showPassword ? <EyeOff/> : <Eye/>}</button>
                        </div>
                    ) : (
                        <div className="flex items-center bg-[#6E1515] text-amber-100/60 rounded-lg">
                            <field.icon className="ml-3" />
                            <input value={user[field.name]} placeholder={field.placeholder} type={field.type} onChange={(e) => handleInputChange(setUser, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                        </div>
                    )}
                </section>
            ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-lg shadow-md flex justify-center items-center gap-2 transition-all duration-300 bg-amber-200 hover:bg-amber-200/80 cursor-pointer text-[#841A1A]`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Iniciando...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </button>

        <p className="text-center text-xs text-amber-200 opacity-80">
          © {new Date().getFullYear()} Mundo Carnes POS — Acceso restringido
        </p>
      </form>
    </div>
  );
}
