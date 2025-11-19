import { useState } from "react"
import { Edit2, Save, Trash2, X, Loader2, Loader } from "lucide-react"
import toast from "react-hot-toast"

import {ModulesHeader} from "../../components/shared/headers"
import useHandleInputChange from "../../utils/useHandleInputChange"
import ModuleItems from "../../config/modulesItems"
import Modules from "../../config/modules"
import useRole from "../../hooks/user/useRole"

export default function Role() {
    const {isLoading, allRoles, POST_Role, PUT_Role} = useRole()
    const [ isAction, setAction ] = useState("Manage Rol")

    /* -- Campos Base de Cear Rol -- */
    const initialData = {
        id: null,
        name: "",
        company: null,
        modules: [],
        permissions: [],
    };

    const [isRole, setRole] = useState(initialData) // control de datos para el rol

    /* ===============================================================
        SELECCIÓN DE MÓDULOS Y PERMISOS
    =============================================================== */

    /* -- Manejar selección de módulos dinámicamente -- */
    const handleModuleSelect = (moduleName) => {
        if (isRole.modules.includes(moduleName)) {
            // Si ya está seleccionado, se deselecciona
            setRole((prev) => ({ ...prev, modules: prev.modules.filter((m) => m !== moduleName) }))
        } else {
            // Si no está, se agrega y se muestra lista de permisos
            setRole((prev) => ({ ...prev, modules: [...prev.modules, moduleName] }))
        }
    }

    /* -- Manejar selección de permisos por módulo -- */
    const handlePermissionToggle = (permissionName) => {
        if (isRole.permissions.includes(permissionName)) {
            // Si ya estaba, lo quitamos
            setRole((prev) => ({ ...prev, permissions: prev.permissions.filter((p) => p !== permissionName)}))
        } else {
            // Si no estaba, lo agregamos
            setRole((prev) => ({...prev, permissions: [...prev.permissions, permissionName] }))
        }
    }

    /* ===============================================================
        CREAR / ACTUALIZAR ROL
    =============================================================== */

   /* -- Enviar datos del rol al backend -- */
    const SubmitRole = (e) => {
        e.preventDefault()
        if (isRole.modules.length === 0){
            toast.error("ERROR: Debes asignar al menos un módulo al rol")
            return
        } else if (isRole.permissions.length === 0) {
            toast.error("ERROR: Debes asignar al menos un permiso al rol")
            return
        } else if  (isRole.id) {
            PUT_Role(isRole)
        } else {
            POST_Role(isRole)
        }
        setRole(initialData)
        isAction("Manage Rol")
    }


    return (
        <>
            {/* -- Encabezado del módulo -- */}
            <ModulesHeader
                module={"Administrar Roles del Sistema"}
            />
            <section className={` w-full container mx-auto max-w-5xl`}>
                {/* -- Pestañas principales: vista de roles o creación -- */}
                <div className="border- mb-4 text-[#841A1A] border-b">
                    <button onClick={() => setAction("Manage Rol")} className={` ${isAction === "Manage Rol" && "border-b-4"} px-4 py-2  cursor-pointer`}>Roles del Sistema</button>
                    <button onClick={() => setAction("Rol Input")} className={` ${isAction === "Rol Input" && "border-b-4"} px-4 py-2 cursor-pointer`}>{isRole.id ? "Editar Rol" : "Crear Rol"}</button>
                </div>
                {isAction === "Manage Rol" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`bg-[#841A1A] text-amber-100`}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">Rol</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Modulos</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Permisos</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="p-4 w-full flex items-center justify-center gap-2">
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Cargando Roles...
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {allRoles?.map((rol) => (
                                            <tr key={rol.id}>
                                                <td className="p-4">{rol.name}</td>
                                                <td className="p-4">{rol.modules.join(", ")}</td>
                                                <td className="p-4">{rol.permissions.join(", ")}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                        onClick={() => {setRole(rol), setAction("Rol Input")}} 
                                                        className="flex gap-1 items-center justify-center text-blue-500 font-semibold  border-b cursor-pointer"
                                                    >
                                                        <Edit2/> Editar
                                                    </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* ===============================================================
                    FORMULARIO DE CREACIÓN / EDICIÓN
                =============================================================== */}
                {isAction === "Rol Input" && (
                    <section className="bg-[#841A1A] text-amber-100 rounded-xl p-6">
                        <div>
                        <h1 className="font-semibold text-lg">Datos del Rol</h1>
                        <p className="text-xs"> {isRole.id ? "Actualiza la información de tu rol" : "Completa la información para registrar un nuevo rol"} </p>
                        </div>

                        <form onSubmit={SubmitRole}>
                        {/* -- Campo: Nombre del Rol -- */}
                        <section className="mt-4">
                            <label className="font-semibold text-md">Nombre del Rol</label>
                            <input
                            value={isRole.name}
                            onChange={(e) => useHandleInputChange(setRole, "name", e.target.value)}
                            required
                            placeholder="Ej: Administrador, Cajero, Vendedor..."
                            className="w-full border-b rounded-lg px-2 outline-none py-1 bg-transparent text-amber-50"
                            />
                        </section>

                        {/* -- Sección de selección de módulos -- */}
                        <section className="mt-6">
                            <h2 className="font-semibold text-md mb-2">
                            Selecciona los Módulos
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                            {Modules.map((mod) => (
                                <div
                                key={mod.name}
                                className={`flex items-center gap-2 border p-3 rounded-lg cursor-pointer transition ${
                                    isRole.modules.includes(mod.name)
                                    ? "bg-amber-200 text-[#841A1A]"
                                    : "bg-[#6B1313] text-amber-100 hover:bg-[#9C2E2E]"
                                }`}
                                onClick={() => handleModuleSelect(mod.name)}
                                >
                                {mod.icon}
                                <div>
                                    <p className="font-semibold">{mod.name}</p>
                                    <p className="text-xs">{mod.description}</p>
                                </div>
                                </div>
                            ))}
                            </div>
                        </section>

                        {/* -- Lista dinámica de permisos según módulo seleccionado -- */}
                        {isRole.modules && (
                            <>
                                {isRole.modules.map((module) => (
                                    <section key={module} className="mt-6">
                                        <h2 className="font-semibold text-md mb-2">
                                            Permisos del módulo: <span className="italic">{module}</span>
                                        </h2>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {ModuleItems[module]?.map((perm) => (
                                            <div
                                                key={perm.name}
                                                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                                                isRole.permissions.includes(perm.name)
                                                    ? "bg-amber-200 text-[#841A1A]"
                                                    : "bg-[#6B1313] text-amber-100 hover:bg-[#9C2E2E]"
                                                }`}
                                                onClick={() => handlePermissionToggle(perm.name)}
                                            >
                                                <div>
                                                <p className="font-semibold">{perm.name}</p>
                                                <p className="text-xs">{perm.description}</p>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </section> 
                                ))}
                            </>
                        )}

                        {/* -- Botón para crear rol -- */}
                        <div className="flex justify-end mt-8 gap-2">
                            {isRole.id && (
                            <button
                            onClick={() => setRole(initialData)}
                            className="bg-amber-200 text-[#841A1A] flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-semibold"
                            >
                            <X/> Cancelar
                            </button>
                            )}
                            <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-amber-200 text-[#841A1A] flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-semibold`}
                            >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <p>Procesando...</p>
                                </div>
                            ) : (
                                <>
                                <Save /> {isRole.id ? "Actualizar Rol" : "Crear Rol"}
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