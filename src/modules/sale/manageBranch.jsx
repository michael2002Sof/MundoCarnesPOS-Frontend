import { useState } from "react"
import { Building2, MapPin, Save, Edit2, X, Loader2, Loader } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import handleInputChange from "../../utils/useHandleInputChange"
import useBranch from "../../hooks/sale/useBranch"


export default function ManageBranch () {
    const {isLoading, branchs, POST_Branch, PUT_Branch} = useBranch()
    const [isAction, setAction] = useState("Manage Branch")

    /* ===============================================================
        Estructura base de la sucursal
    =============================================================== */
    const initialBaseBranch = {
        id: null,
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

        if(isBrach.id) {
            await PUT_Branch(isBrach)
        } else {
            await POST_Branch(isBrach)
        }

        setBrach(initialBaseBranch)
        setAction("Manage Branch")
            
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
                    TABLA DE SUCURSALES
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
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="p-4 w-full flex items-center justify-center gap-2">
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Cargando Sucursales...
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    branchs?.map((b) => (
                                        <tr key={b.id} className="border-b border-gray-200">
                                            <td className="p-4">{b.name}</td>
                                            <td className="p-4">{b.address}</td>
                                            <td className="p-4">{b.city}</td>
                                            <td className="p-4">{b.department}</td>
                                            <td className="p-4">{b.country}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setBrach(b)
                                                            setAction("Branch Input")
                                                        }}
                                                        className="flex gap-1   items-center justify-center text-blue-500 font-semibold  border-b cursor-pointer"
                                                    >
                                                        <Edit2 size={16}/> Editar
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