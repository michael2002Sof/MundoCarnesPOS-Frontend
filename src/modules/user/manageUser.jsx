import { useState } from "react"
import { Edit2, Save, Trash2, X, User, ShieldUser, Mail, Lock, Loader2 } from "lucide-react"

import usePersistentResponse from "../../utils/response_message"
import { ModulesHeader } from "../../components/shared/headers"
import handleInputChange from "../../utils/handleInputChange"
import axiosInstance from "../../api/axiosintance"
import DecodeToken from "../../api/decode"
import { GetAllRoles, GetAllUsers } from "../../hooks/user"

export default function ManageUser() {
    const token = DecodeToken()
    const { roles } = GetAllRoles()
    const { users, FetchUsers } = GetAllUsers()
    const [isLoading, setLoading] = useState(false)
    const [isAction, setAction] = useState("Manage User")

    /* ===============================================================
        Estructura base del usuario
    =============================================================== */
    const initialBaseUser = {
        id: null,
        company: token.company,
        rol: "",
        name: "",
        email: "",
        password: "",
    }

    const [isUser, setUser] = useState(initialBaseUser) // Control del formulario de usuario

    /* ===============================================================
        CREAR / ACTUALIZAR USUARIO
    =============================================================== */
    const handleSubmitUser = async (e) => {
        e.preventDefault()
        setLoading(true)

        // 🛑 Validaciones antes del envío
        if (!isUser.rol) {
            usePersistentResponse({ success: false, message: "Debes asignar un rol al usuario" })
            setLoading(false)
            return
        }
        if (!isUser.email || !isUser.name) {
            usePersistentResponse({ success: false, message: "Completa todos los campos del formulario" })
            setLoading(false)
            return
        }

        try {
            let res
            if (isUser.id) {
                // Actualizar usuario existente
                res = await axiosInstance.put("/posinnovate/app/user/update", isUser)
            } else {
                // Crear nuevo usuario
                res = await axiosInstance.post("/posinnovate/app/user/register", isUser)
            }

            usePersistentResponse(res)
            FetchUsers()

            // 🔄 Reinicio del formulario tras crear o actualizar con éxito
            setUser(initialBaseUser)
            setAction("Manage User")
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }

    /* ===============================================================
        ELIMINAR USUARIO
    =============================================================== */
    const handleDeleteUser = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return
        setLoading(true)
        try {
            const res = await axiosInstance.delete(`/posinnovate/app/user/delete/${id}`)
            usePersistentResponse(res)
            FetchUsers()
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }

    /* ===============================================================
        CARGAR USUARIO PARA EDICIÓN
    =============================================================== */
    const handleEditUser = (user) => {
        setUser({
            id: user.id,
            company: user.company,
            rol: user.rol,
            name: user.name,
            email: user.email,
            password: "",
        })
        setAction("User Input")
    }

    /* ===============================================================
        INTERFAZ
    =============================================================== */
    return (
        <>
            {/* -- Encabezado del módulo -- */}
            <ModulesHeader module={"Administrar Usuarios"} />

            <section className="w-full container mx-auto max-w-5xl">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button onClick={() => setAction("Manage User")} className={`px-4 py-2 cursor-pointer ${isAction === "Manage User" && "border-b-4 font-semibold"}`}>
                        Usuarios del Sistema
                    </button>
                    <button onClick={() => setAction("User Input")} className={`px-4 py-2 cursor-pointer ${isAction === "User Input" && "border-b-4 font-semibold"}`}>
                        {isUser.id ? "Editar Usuario" : "Registrar Usuario"}
                    </button>
                </div>

                {/* ===============================================================
                    📄 TABLA DE USUARIOS
                =============================================================== */}
                {isAction === "Manage User" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#841A1A] text-amber-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">Nombre</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Correo</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Rol</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center p-6">No hay usuarios registrados</td>
                                    </tr>
                                ) : (
                                    users?.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-200">
                                            <td className="p-4">{user.name}</td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">{user.rol_name}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="bg-[#841A1A] text-amber-100 p-1 rounded-lg cursor-pointer"
                                                    >
                                                        <Edit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="bg-[#841A1A] text-amber-100 p-1 rounded-lg cursor-pointer"
                                                    >
                                                        <Trash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ===============================================================
                    FORMULARIO CREAR / EDITAR USUARIO
                =============================================================== */}
                {isAction === "User Input" && (
                    <section className="bg-[#841A1A] text-amber-100 rounded-xl p-6">
                        <div>
                            <h1 className="font-semibold text-lg">Datos del Usuario</h1>
                            <p className="text-xs">
                                {isUser.id ? "Actualiza la información del usuario" : "Completa la información para registrar un nuevo usuario"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmitUser}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
                                {[
                                    { icon: User, name: "name", label: "Nombre del usuario", type: "text" },
                                    { icon: Mail, name: "email", label: "Correo Electonico", type: "text" },
                                    { icon: Lock, name: "password", label: "Contraseña", type: "password" },
                                    { icon: ShieldUser, name: "rol", label: "Rol", type: "select"},
                                ].map((field) => (
                                    <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                                    <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                        {field.type === "select" ? (
                                            <>
                                                <field.icon className="ml-3" />
                                                <select value={isUser[field.name]} onChange={(e) => handleInputChange(setUser, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
                                                    <option>Selecciona un rol</option>
                                                    {roles?.map((rol) => (
                                                        <option key={rol.id} value={rol.id}>
                                                            {rol.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : (
                                            <>
                                                <field.icon className="ml-3" />
                                                <input value={isUser[field.name]} type={field.type} onChange={(e) => handleInputChange(setUser, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                            </>
                                        )}
                                    </div>
                                    </section>
                                ))}
                            </div>
                            {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isUser.id && (
                                    <button
                                        onClick={() => setUser(initialBaseUser)}
                                        type="button"
                                        className="bg-amber-200 text-[#841A1A] flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-semibold"
                                    >
                                        <X /> Cancelar
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-amber-200 text-[#841A1A] flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-semibold"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <p>Procesando...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Save /> {isUser.id ? "Actualizar Usuario" : "Registrar Usuario"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                )}
            </section>
        </>
    )
}
