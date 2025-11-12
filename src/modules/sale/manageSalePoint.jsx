import { useEffect, useState } from "react"
import { Building2, CreditCard, Save, User, Loader2, Edit2, Trash2, X} from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import {GetAllBranchs, GetAllSalesPoint} from "../../hooks/sales"
import { GetAllUsers } from "../../hooks/user"
import DecodeToken from "../../api/decode"
import axiosInstance from "../../api/axiosintance"
import handleInputChange from "../../utils/handleInputChange"
import usePersistentResponse from "../../utils/response_message"
import {formatDateTime} from "../../utils/formatData"

export default function ManageSalePoint () {
    const token = DecodeToken()
    const {branchs} = GetAllBranchs()
    const {salesPoints, FetchSalesPoints} = GetAllSalesPoint()
    const {users} = GetAllUsers()
    const [ isLoading, setLoading ] = useState(false)
    const [ isAction, setAction ] = useState("Manage Sales Point")

    /* ===============================================================
        Estructura base del punto de venta
    =============================================================== */
    const initialBaseSalesPoint = {
        id: null,
        company: token.company,
        branch: "",
        user: "",
        name: "",
    }
    const [isSalesPoint, setSalesPoint] = useState(initialBaseSalesPoint) // control de datos de punto de venta
    /* ===============================================================
        CREAR / ACTUALIZAR PUNTO DE VENTA
    =============================================================== */
    const handleSubmitSalesPoint = async (e) => {
        e.preventDefault()
        setLoading(true)
        let res
          console.log("Datos enviados", isSalesPoint)
        try {
            if (isSalesPoint.id) {
                // Actualizar Punto de Venta existente
                res = await axiosInstance.put("/posinnovate/app/sale/salepoint/update", isSalesPoint)
            } else {
                // Crear nuevo Punto de Venta
                res = await axiosInstance.post("/posinnovate/app/sale/salepoint/register", isSalesPoint)
            }

            setSalesPoint(initialBaseSalesPoint)
            FetchSalesPoints()
            usePersistentResponse(res)
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }
    /* ===============================================================
        ELIMINAR PUNTO DE VENTA
    =============================================================== */
    const handleDeleteSalesPoint = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return
        setLoading(true)
        try {
            const res = await axiosInstance.delete(`/posinnovate/app/sale/salepoint/delete/${id}`)
            usePersistentResponse(res)
            FetchSalesPoints()
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
        }
    }
    /* ===============================================================
        CARGAR USUARIO PARA EDICIÓN
    =============================================================== */
    const handleEditSalesPoint = (sp) => {
        setSalesPoint({
            id: sp.id,
            company: token.company,
            branch: sp.id_branch,
            user: sp.id_user,
            name: sp.name,
            status: sp.status,
        })
        setAction("Input Sales Point")
    }
    /* ===============================================================
        INTERFAZ
    =============================================================== */
    return (
        <>
            {/* -- Encabezado del módulo -- */}
            <ModulesHeader module={"Administrar Puntos de Venta"} description={"Controla todas la funciones diseñadas para tus puntos de ventas"}/>
            <section className="w-full container mx-auto max-w-5xl">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button onClick={() => setAction("Manage Sales Point")} className={` ${isAction === "Manage Sales Point" && "border-b-4 font-semibold"} px-4 py-2  cursor-pointer`}>Puntos de Venta del Sistema</button>
                    <button onClick={() => setAction("Input Sales Point")} className={` ${isAction === "Input Sales Point" && "border-b-4 font-semibold"} px-4 py-2 cursor-pointer`}>{isSalesPoint.id ? "Editar Punto de Venta" : "Nuevo Punto de Venta"}</button>
                </div>
                {/* ===============================================================
                    📄 TABLA DE USUARIOS
                =============================================================== */}
                {isAction === "Manage Sales Point" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`bg-[#841A1A] text-amber-100`}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">Punto de Venta</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Sucursal</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Usuario Asignado</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Estado</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Fecha de Abrir</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Fecha de Cerrar</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesPoints?.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center p-6">No hay Puntos de registrados</td>
                                    </tr>
                                ) : (
                                    salesPoints?.map((sp) => (
                                        <tr key={sp.id} className="text-nowrap">
                                            <td className="p-4">{sp.name}</td>
                                            <td className="p-4">{sp.branch}</td>
                                            <td className="p-4">{sp.user}</td>
                                            <td className="p-4">
                                                <span
                                                className={`px-3 py-1 flex items-center gap-2 rounded-full text-xs font-semibold ${
                                                    sp.status === "open" ? "bg-amber-200 text-green-700" : "bg-amber-200 text-red-700"
                                                }`}
                                                >
                                                <p className={`h-2 w-2 animate-pulse rounded-full ${ sp.status === "open" ? "bg-green-700" : "bg-red-700" }`}/>
                                                {sp.status === "open" ? "Abierto" : "Cerrado"}
                                                </span>
                                            </td>
                                            <td className="p-4">{formatDateTime(sp.opened_at)}</td>
                                            <td className="p-4">{formatDateTime(sp.closed_at)}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditSalesPoint(sp)}
                                                        className="bg-[#841A1A] text-amber-100 p-1 rounded-lg cursor-pointer"
                                                    >
                                                        <Edit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSalesPoint(sp.id)}
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
                { isAction === "Input Sales Point" && (
                    <section className={`bg-[#841A1A] text-amber-100 rounded-xl p-6`}>
                        <div>
                            <h1 className="font-semibold text-lg">Datos del Punto de Venta</h1>
                            <p className="text-xs">
                                {isSalesPoint.id ? "Actualiza la información del punto de venta" : "Completa la información para registrar un nuevo punto de venta"}
                            </p>
                        </div>
                        <form onSubmit={handleSubmitSalesPoint}>
                            <section className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4 ">
                                {[
                                    { icon: CreditCard, name: "name", label: "Nombre del Punto de Venta", type: "text" },
                                    { icon: Building2, name: "branch", label: "Sucursal", type: "select", options: branchs},
                                    { icon: User, name: "user", label: "Usuario", type: "select", options: users},
                                ].map((field) => (
                                    <section key={field.name}>
                                        <label className="font-semibold text-md mb-1">{field.label}</label>
                                        <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                            {field.type === "select" ? (
                                                <>
                                                    <field.icon className="ml-3" />
                                                    <select disabled={field.name === "status" && isSalesPoint.id !== null} value={isSalesPoint[field.name]}  onChange={(e) => handleInputChange(setSalesPoint, field.name, e.target.value)} className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
                                                        <option value="">Seleccionar...</option>
                                                        {Array.isArray(field.options) && field.options.map((option) => (
                                                            <option key={option.id} value={option.id}>{option.name}</option>
                                                        ))}
                                                    </select>
                                                </>
                                            ) : (
                                                <>
                                                    <field.icon className="ml-3" />
                                                    <input value={isSalesPoint[field.name]} type={field.type} onChange={(e) => handleInputChange(setSalesPoint, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                                </>
                                            )}
                                        </div>
                                    </section>
                                ))}
                            </section>
                           {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isSalesPoint.id && (
                                    <button
                                        onClick={() => setSalesPoint(initialBaseSalesPoint)}
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
                                            <Save /> {isSalesPoint.id ? "Actualizar Punto de Venta" : "Registrar Punto de Venta"}
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