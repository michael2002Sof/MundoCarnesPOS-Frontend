import { useState } from "react"
import { Edit2, Save, Trash2, X, ShieldUser, Mail, Lock, Loader2, Loader, UserIcon } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import useHandleInputChange from "../../utils/useHandleInputChange"

import useRole from "../../hooks/user/useRole"
import useUserSiigo from "../../hooks/siigo/useUser"

export default function User() {
    const {allRoles} = useRole()
    const [editUser, setEditUser] = useState(false)
    const {isLoading, UsersSiigo, usersPOS, POST_User, PUT_User} = useUserSiigo()
    const [isAction, setAction] = useState("Manage User")

    /* ===============================================================
        Estructura base del usuario
    =============================================================== */
    const InitialData = {
        id: null,
        rol: "",
        name: "",
        email: "",
        password: "",
    }

    const [isUser, setUser] = useState(InitialData) // Control del formulario de usuario

    /* ===============================================================
        CREAR / ACTUALIZAR USUARIO
    =============================================================== */
    const SubmitUser = (e) => {
        e.preventDefault()
        if (editUser) {
            PUT_User(isUser)
        } else {    
            console.log(isUser)
            POST_User(isUser)
        }
        setUser(InitialData)
        setAction("Manage User")
    }

    /*=======================================================================
        USAR DATOS DE SIIGO
    =========================================================================*/
    const selectedUserSiigo = (user) => {
        setUser ({
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            password: "",
            rol: ""
        })
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
                        {editUser ? "Editar Usuario" : "Registrar Usuario"}
                    </button>
                </div>

                {/* ===============================================================
                    TABLA DE USUARIOS
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
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="p-4 w-full flex items-center justify-center gap-2">
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Cargando Usuarios...
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    usersPOS?.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-200">
                                            <td className="p-4">{user.name}</td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">{user.rol_name}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                        setUser(user);
                                                        setEditUser(true);
                                                        setAction("User Input");
                                                        }}
                                                        className="bg-[#841A1A] text-amber-100 p-1 rounded-lg cursor-pointer"
                                                    >
                                                        <Edit2 />
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

                        <section className="w-full mt-6">
                            <label className="block font-semibold mb-1">Elige el Usuario de Siigo:</label>
                            <select onChange={(e) => {
                                const user = UsersSiigo.find(u => u.id === Number(e.target.value)) 
                                if (user) selectedUserSiigo(user) 
                            }} className="w-1/2 flex items-center bg-[#6E1515] text-amber-100 px-4 py-2 rounded-lg">
                                <option value="">Seleccionar...</option>
                                {UsersSiigo.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.first_name} {u.last_name}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <form onSubmit={SubmitUser}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
                                {[
                                    { icon: UserIcon, name: "name", label: "Nombre del usuario", type: "text", disabled: true},
                                    { icon: Mail, name: "email", label: "Correo Electonico", type: "text", disabled: true },
                                    { icon: Lock, name: "password", label: "Contraseña", type: "password" },
                                    { icon: ShieldUser, name: "rol", label: "Rol", type: "select"},
                                ].map((field) => (
                                    <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                                    <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                        {field.type === "select" ? (
                                            <>
                                                <field.icon className="ml-3" />
                                                <select value={isUser[field.name]} onChange={(e) => useHandleInputChange(setUser, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
                                                    <option>Selecciona un rol</option>
                                                    {allRoles?.map((rol) => (
                                                        <option key={rol.id} value={rol.id}>
                                                            {rol.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : (
                                            <>
                                                <field.icon className="ml-3" />
                                                <input value={isUser[field.name]} disabled={field.disabled} type={field.type} onChange={(e) => useHandleInputChange(setUser, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                            </>
                                        )}
                                    </div>
                                    </section>
                                ))}
                            </div>
                            {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {editUser && (
                                    <button
                                        onClick={() => setUser(InitialData)}
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
                                            <Save /> {editUser ? "Actualizar Usuario" : "Registrar Usuario"}
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
