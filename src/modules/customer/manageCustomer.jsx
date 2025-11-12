import { useState } from "react"
import { Save, Edit2, Trash2, X, User, Mail, Loader2, Hash, MapPin } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import DecodeToken from "../../api/decode"
import axiosInstance from "../../api/axiosintance"
import usePersistentResponse from "../../utils/response_message"
import handleInputChange from "../../utils/handleInputChange"
import { GetAllCustomers } from "../../hooks/customer"


export default function ManageCustomer () {
    const token = DecodeToken()
    const {customers, FetchCustomers} = GetAllCustomers()
    const [isLoading, setLoading] = useState(false)
    const [isAction, setAction] = useState("Manage Customer")

    /* ===============================================================
        Estructura base del CLIENTE
    =============================================================== */
    const initialBaseCustomer = {
        id: null,
        company: token.company,
        name: "",
        cc: "",
        email: "",
        address: "",
    }
    const [isCustomer, setCustomer] = useState(initialBaseCustomer) // Control del formulario de sucursal

    /* ===============================================================
        CREAR / ACTUALIZAR CLIENTE
    =============================================================== */
    const handleSubmitBrach = async (e) => {
        e.preventDefault()
        setLoading(true)
        let res
        try {
            console.log(isCustomer);
            if(isCustomer.id) {
                // Actualizar cliente existente
                res = await axiosInstance.put("/posinnovate/app/customer/update", isCustomer)
            } else {
                res = await axiosInstance.post("/posinnovate/app/customer/register", isCustomer)
            }

            FetchCustomers()
            setCustomer(initialBaseCustomer)
            usePersistentResponse(res)
            
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }
     
    /* ===============================================================
        ELIMINAR CLIENTE
    =============================================================== */
    const handleDeleteCustomer = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar esta sucursal?")) return
        setLoading(true)
        try {
            const res = await axiosInstance.delete(`/posinnovate/app/customer/delete/${id}`)
            usePersistentResponse(res)
            FetchCustomers()
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }

    /* ===============================================================
        CARGAR CLIENTE PARA EDICIÓN
    =============================================================== */
    const handleEditCustomer = (customer) => {
        setCustomer({
            id: customer.id,
            company: customer.company,
            name: customer.name,
            cc: customer.cc,
            email: customer.email,
            address: customer.address,
        })
        setAction("Customer Input")
    }


    /* ===============================================================
        INTERFAZ
    =============================================================== */
    return (
        <>
            <ModulesHeader
                module={"Administrar Clientes"}
                description={"Controla desde un solo punto tus clientes"}
            />
            <section className="w-full container mx-auto max-w-5xl">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button
                        onClick={() => setAction("Manage Customer")}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Manage Customer" && "border-b-4 font-semibold"}`}
                    >
                        Clientes del Sistema
                    </button>
                    <button
                        onClick={() => setAction("Customer Input")}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Customer Input" && "border-b-4 font-semibold"}`}
                    >
                        {isCustomer.id ? "Editar Cliente" : "Registrar Cliente"}
                    </button>
                </div>

                {/* ===============================================================
                    📄 TABLA DE SUCURSALES
                =============================================================== */}
                {isAction === "Manage Customer" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#841A1A] text-amber-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">Cliente</th>
                                    <th className="px-4 py-3 text-left text-nowrap">N° Documento</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Correo</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Dirección</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers?.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center p-6">No hay Clientes registrados</td>
                                    </tr>
                                ) : (
                                    customers?.map((customer) => (
                                        <tr key={customer.id} className="border-b border-gray-200">
                                            <td className="p-4">{customer.name}</td>
                                            <td className="p-4">{customer.cc}</td>
                                            <td className="p-4">{customer.email}</td>
                                            <td className="p-4">{customer.address}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditCustomer(customer)}
                                                        className="bg-[#841A1A] text-amber-100 p-1 rounded-lg cursor-pointer"
                                                    >
                                                        <Edit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCustomer(customer.id)}
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
                {isAction === "Customer Input" && (
                    <section className="bg-[#841A1A] text-amber-100 rounded-xl p-6">
                        <div>
                            <h1 className="font-semibold text-lg">Datos del Cliente</h1>
                            <p className="text-xs">
                                {isCustomer.id ? "Actualiza la información del Cliente" : "Completa la información para registrar un nuevo cliente"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmitBrach}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
                                {[
                                    { icon: User, name: "name", label: "Nombre del Cliente", type: "text" },
                                    { icon: Hash, name: "cc", label: "N° de Documento", type: "number" },
                                    { icon: Mail, name: "email", label: "Correo Electronico", type: "text" },
                                    { icon: MapPin, name: "address", label: "Dirección", type: "text"},
                                ].map((field) => (
                                    <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                                    <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                        <field.icon className="ml-3" />
                                        <input value={isCustomer[field.name]} type={field.type} onChange={(e) => handleInputChange(setCustomer, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                    </div>
                                    </section>
                                ))}
                            </div>
                            {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isCustomer.id && (
                                    <button
                                        onClick={() => setCustomer(initialBaseCustomer)}
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
                                            <Save /> {isCustomer.id ? "Actualizar Cliente" : "Registrar Cliente"}
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