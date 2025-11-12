import { useState } from "react"
import { Building2, MapPin, Save, Edit2, Trash2, X, Loader2 } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import DecodeToken from "../../api/decode"
import axiosInstance from "../../api/axiosintance"
import usePersistentResponse from "../../utils/response_message"
import handleInputChange from "../../utils/handleInputChange"
import { GetAllBranchs } from "../../hooks/sales"


export default function ManageBranch () {
    const token = DecodeToken()
    const {branchs, FetchBranchs} = GetAllBranchs()
    const [isLoading, setLoading] = useState(false)
    const [isAction, setAction] = useState("Manage Branch")

    /* ===============================================================
        Estructura base de la sucursal
    =============================================================== */
    const initialBaseBranch = {
        id: null,
        company: token.company,
        name: "",
        address: "",
        city: "Cúcuta",
        department: "Norte de Santander",
        country: "Colombia"
    }
    const [isBrach, setBrach] = useState(initialBaseBranch) // Control del formulario de sucursal

    /* ===============================================================
        CREAR / ACTUALIZAR SUCURSAL
    =============================================================== */
    const handleSubmitBrach = async (e) => {
        e.preventDefault()
        setLoading(true)
        let res
        try {
            if(isBrach.id) {
                // Actualizar usuario existente
                res = await axiosInstance.put("/posinnovate/app/sale/branch/update", isBrach)
            } else {
                res = await axiosInstance.post("/posinnovate/app/sale/branch/register", isBrach)
            }

            FetchBranchs()
            setBrach(initialBaseBranch)
            usePersistentResponse(res)
            
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }
     
    /* ===============================================================
        🗑️ ELIMINAR BRANCH
    =============================================================== */
    const handleDeleteBranch = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar esta sucursal?")) return
        setLoading(true)
        try {
            const res = await axiosInstance.delete(`/posinnovate/app/sales/branch/delete/${id}`)
            usePersistentResponse(res)
            FetchBranchs()
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }

    /* ===============================================================
        CARGAR BRANCH PARA EDICIÓN
    =============================================================== */
    const handleEditBranch = (brach) => {
        setBrach({
            id: brach.id,
            company: brach.company,
            name: brach.name,
            address: brach.address,
            city: brach.city,
            department: brach.department,
            country: brach.country
        })
        setAction("Branch Input")
    }


    /* ===============================================================
        INTERFAZ
    =============================================================== */
    return (
        <>
            <ModulesHeader
                module={"Administrar Sucursales"}
                description={""}
            />
            <section className=" container mx-auto max-w-5xl">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button
                        onClick={() => setAction("Manage Branch")}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Manage Branch" && "border-b-4 font-semibold"}`}
                    >
                        Sucursales del Sistema
                    </button>
                    <button
                        onClick={() => setAction("Branch Input")}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Branch Input" && "border-b-4 font-semibold"}`}
                    >
                        {isBrach.id ? "Editar Sucursal" : "Registrar Sucursal"}
                    </button>
                </div>

                {/* ===============================================================
                    📄 TABLA DE SUCURSALES
                =============================================================== */}
                {isAction === "Manage Branch" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#841A1A] text-amber-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">Sucursal</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Dirección</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Ciudad</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Departamento</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Pais</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branchs?.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center p-6">No hay Sucursales Registradas</td>
                                    </tr>
                                ) : (
                                    branchs?.map((brach) => (
                                        <tr key={brach.id} className="border-b border-gray-200">
                                            <td className="p-4">{brach.name}</td>
                                            <td className="p-4">{brach.address}</td>
                                            <td className="p-4">{brach.city}</td>
                                            <td className="p-4">{brach.department}</td>
                                            <td className="p-4">{brach.country}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditBranch(brach)}
                                                        className="bg-[#841A1A] text-amber-100 p-1 rounded-lg cursor-pointer"
                                                    >
                                                        <Edit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBranch(brach.id)}
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
                    🧾 FORMULARIO CREAR / EDITAR USUARIO
                =============================================================== */}
                {isAction === "Branch Input" && (
                    <section className="bg-[#841A1A] text-amber-100 rounded-xl p-6">
                        <div>
                            <h1 className="font-semibold text-lg">Datos de la Sucursal</h1>
                            <p className="text-xs">
                                {isBrach.id ? "Actualiza la información de la sucursal" : "Completa la información para registrar un nueva sucursal"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmitBrach}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
                                {[
                                    { icon: Building2, name: "name", label: "Nombre de la sucursal", type: "text" },
                                    { icon: MapPin, name: "address", label: "Dirección", type: "text" },
                                    { icon: MapPin, name: "city", label: "Ciudad", type: "text" },
                                    { icon: MapPin, name: "department", label: "Departamento", type: "text"},
                                    { icon: MapPin, name: "country", label: "Pais", type: "text"},
                                ].map((field) => (
                                    <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                                    <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                        {field.type === "select" ? (
                                            <>
                                                <field.icon className="ml-3" />
                                                <select value={isBrach[field.name]} onChange={(e) => handleInputChange(setBrach, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
                                                    <option>Selecciona un rol</option>
                                                    {[].map((rol) => (
                                                        <option key={rol.id} value={rol.id}>
                                                            {rol.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : (
                                            <>
                                                <field.icon className="ml-3" />
                                                <input value={isBrach[field.name]} type={field.type} onChange={(e) => handleInputChange(setBrach, field.name, e.target.value)} required={isBrach.id ? false : true} className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                            </>
                                        )}
                                    </div>
                                    </section>
                                ))}
                            </div>
                            {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isBrach.id && (
                                    <button
                                        onClick={() => setBrach(initialBaseBranch)}
                                        type="button"
                                        className="bg-amber-200 text-[#841A1A] flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-semibold"
                                    >
                                        <X /> Cancelar
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="bg-amber-200 text-[#841A1A] flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-semibold"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <p>Procesando...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Save /> {isBrach.id ? "Actualizar Sucursal" : "Registrar Sucursal"}
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