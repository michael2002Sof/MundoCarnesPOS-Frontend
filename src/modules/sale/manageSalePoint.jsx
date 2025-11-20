import { useEffect, useState } from "react"
import { Building2, CreditCard, Save, User, Loader2, Edit2, Trash2, X, Loader} from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import handleInputChange from "../../utils/useHandleInputChange"
import {formatDateTime} from "../../utils/formatData"

import useWareHouse from "../../hooks/siigo/useWareHouse"
import useUserSiigo from "../../hooks/siigo/useUser"
import useBranch from "../../hooks/sale/useBranch"
import useSalePoint from "../../hooks/sale/useSalePoint"

export default function ManageSalePoint () {
    const {wareHouses} = useWareHouse()
    const {branchs} = useBranch()
    const {isLoading, salePoints, POST_SalePoint, PUT_SalePoint} = useSalePoint()
    console.log(salePoints)
    const {usersPOS} = useUserSiigo()

    const [ isAction, setAction ] = useState("Manage Sales Point")

    /* ===============================================================
        Estructura base del punto de venta
    =============================================================== */
    const initialBaseSalesPoint = {
        id: null,
        branch: "",
        user: "",
        name: "",
        warehouse: "",
    }
    const [isSalePoint, setSalePoint] = useState(initialBaseSalesPoint) // control de datos de punto de venta
    /* ===============================================================
        CREAR / ACTUALIZAR PUNTO DE VENTA
    =============================================================== */
    const handleSubmitSalesPoint = async (e) => {
        e.preventDefault()
        if (isSalePoint.id) {
            console.log(isSalePoint)
            PUT_SalePoint(isSalePoint)
        } else {
            POST_SalePoint(isSalePoint)
        }
        setSalePoint(initialBaseSalesPoint)
        setAction("Manage Sales Point")
    }

    /* ===============================================================
        INTERFAZ
    =============================================================== */
    return (
        <>
            {/* -- Encabezado del módulo -- */}
            <ModulesHeader module={"Administrar Puntos de Venta"} description={"Controla todas la funciones diseñadas para tus puntos de ventas"}/>
            <section className="w-full container mx-auto max-w-7xl 2xl:max-w-[90%]">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button onClick={() => setAction("Manage Sales Point")} className={` ${isAction === "Manage Sales Point" && "border-b-4 font-semibold"} px-4 py-2  cursor-pointer`}>Puntos de Venta del Sistema</button>
                    <button onClick={() => setAction("Input Sales Point")} className={` ${isAction === "Input Sales Point" && "border-b-4 font-semibold"} px-4 py-2 cursor-pointer`}>{isSalePoint.id ? "Editar Punto de Venta" : "Nuevo Punto de Venta"}</button>
                </div>
                {/* ===============================================================
                    TABLA DE PUNTOS DE VENTA
                =============================================================== */}
                {isAction === "Manage Sales Point" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`bg-[#841A1A] text-amber-100`}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">Punto de Venta</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Sucursal</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Bodega</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Usuario Asignado</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Estado</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Fecha de Abrir</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Fecha de Cerrar</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="p-4 w-full flex items-center justify-center gap-2">
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Cargando Puntos de Venta...
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    salePoints?.map((sp) => (
                                        <tr key={sp.id} className="text-nowrap">
                                            <td className="p-4">{sp.name}</td>
                                            <td className="p-4">{sp.branch_name}</td>
                                            <td className="p-4">{wareHouses.find(wh => wh.id === sp.warehouse)?.name || "—"}</td>
                                            <td className="p-4">{sp.user_name}</td>
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
                                                        onClick={() => {
                                                            setSalePoint(sp)
                                                            setAction('Input Sales Point')
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
                { isAction === "Input Sales Point" && (
                    <section className={`bg-[#841A1A] text-amber-100 rounded-xl p-6`}>
                        <div>
                            <h1 className="font-semibold text-lg">Datos del Punto de Venta</h1>
                            <p className="text-xs">
                                {isSalePoint.id ? "Actualiza la información del punto de venta" : "Completa la información para registrar un nuevo punto de venta"}
                            </p>
                        </div>
                        <form onSubmit={handleSubmitSalesPoint}>
                            <section className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4 ">
                                {[
                                    { icon: CreditCard, name: "name", label: "Nombre del Punto de Venta", type: "text" },
                                    { icon: Building2, name: "branch", label: "Sucursal", type: "select", options: branchs},
                                    { icon: User, name: "user", label: "Usuario", type: "select", options: usersPOS},
                                    { icon: Building2, name: "warehouse", label: "Bodeha Asignada", type: "select", options: wareHouses}
                                ].map((field) => (
                                    <section key={field.name}>
                                        <label className="font-semibold text-md mb-1">{field.label}</label>
                                        <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                            {field.type === "select" ? (
                                                <>
                                                    <field.icon className="ml-3" />
                                                    <select disabled={field.name === "status" && isSalePoint.id !== null} value={isSalePoint[field.name]}  onChange={(e) => handleInputChange(setSalePoint, field.name, e.target.value)} className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
                                                        <option value="">Seleccionar...</option>
                                                        {Array.isArray(field.options) && field.options.map((option) => (
                                                            <option key={option.id} value={option.id}>{option.name}</option>
                                                        ))}
                                                    </select>
                                                </>
                                            ) : (
                                                <>
                                                    <field.icon className="ml-3" />
                                                    <input value={isSalePoint[field.name]} type={field.type} onChange={(e) => handleInputChange(setSalePoint, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                                </>
                                            )}
                                        </div>
                                    </section>
                                ))}
                            </section>
                           {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isSalePoint.id && (
                                    <button
                                        onClick={() => setSalePoint(initialBaseSalesPoint)}
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
                                            <Save /> {isSalePoint.id ? "Actualizar Punto de Venta" : "Registrar Punto de Venta"}
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