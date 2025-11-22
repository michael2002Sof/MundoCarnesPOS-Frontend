import { useEffect, useState } from "react"
import { Building2, CreditCard, Save, User, Loader2, Edit2, Trash2, X, Loader} from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import handleInputChange from "../../utils/useHandleInputChange"
import {formatDateTime} from "../../utils/formatData"

import useWarehouse from "../../hooks/inventory/useWarehouse"
import useUserSiigo from "../../hooks/siigo/useUser"
import useBranch from "../../hooks/sale/useBranch"
import useSalePoint from "../../hooks/sale/useSalePoint"
import useCostCenter from "../../hooks/sale/useCostCenter"
import usePaymentMethod from "../../hooks/sale/usePaymentMethod"

export default function SalePoint () {
    const {warehouses} = useWarehouse()
    //console.log("Bodegas POS", warehouses)
    const {costCenters} = useCostCenter()
    //console.log("Centro de Costos POS", costCenters)
    const {branchs} = useBranch()
    const {isLoading, salePoints, POST_SalePoint, PUT_SalePoint} = useSalePoint()
    console.log("Punto de venta POS", salePoints)
    const {usersPOS} = useUserSiigo()
    const {paymentMethods} = usePaymentMethod()
    //console.log(paymentMethods)
    const [ isAction, setAction ] = useState("Sales Point")

    /* ===============================================================
        Estructura base del punto de venta
    =============================================================== */
    const initialBaseSalesPoint = {
        id: null,
        branch: "",
        user: "",
        name: "",
        warehouse: "",
        cost_center: "",
        methods: []
    }
    const [isSalePoint, setSalePoint] = useState(initialBaseSalesPoint) // control de datos de punto de venta
    /* ===============================================================
        CREAR / ACTUALIZAR PUNTO DE VENTA
    =============================================================== */
    const handleSubmitSalesPoint = async (e) => {
        e.preventDefault()
        if (isSalePoint.id) {
            PUT_SalePoint(isSalePoint)
        } else {
            POST_SalePoint(isSalePoint)
        }
        setSalePoint(initialBaseSalesPoint)
        setAction("Sales Point")
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
                    <button onClick={() => setAction("Sales Point")} className={` ${isAction === "Sales Point" && "border-b-4 font-semibold"} px-4 py-2  cursor-pointer`}>Puntos de Venta del Sistema</button>
                    <button onClick={() => setAction("Input Sales Point")} className={` ${isAction === "Input Sales Point" && "border-b-4 font-semibold"} px-4 py-2 cursor-pointer`}>{isSalePoint.id ? "Editar Punto de Venta" : "Nuevo Punto de Venta"}</button>
                </div>
                {/* ===============================================================
                    TABLA DE PUNTOS DE VENTA
                =============================================================== */}
                {isAction === "Sales Point" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`bg-[#841A1A] text-amber-100`}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">Punto de Venta</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Estado</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Fecha de Abrir</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Fecha de Cerrar</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Sucursal</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Bodega</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Centro de Costos</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Usuario</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Métodos de Pago</th>
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
                                            <td className="p-4">{sp.opened_at || "DD-MM-AA HH:MM"}</td>
                                            <td className="p-4">{sp.closed_at || "DD-MM-AA HH:MM"}</td>
                                            <td className="p-4">{sp.branch_name}</td>
                                            <td className="p-4">{sp.warehouse_name}</td>
                                            <td className="p-4">{sp.cost_center_name}</td>
                                            <td className="p-4">{sp.user_name}</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1 max-w-[220px]">
                                                    {sp.methods?.length > 0 ? (
                                                        sp.methods.map((m) => (
                                                            <span
                                                                key={m.id}
                                                                className="bg-amber-200 border border-amber-300 text-amber-800 text-xs px-2 py-1 rounded-full"
                                                            >
                                                                {m.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">Sin métodos</span>
                                                    )}
                                                </div>
                                            </td>

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
                                    { icon: Building2, name: "warehouse", label: "Bodeha Asignada", type: "select", options: warehouses},
                                    { icon: Building2, name: "cost_center", label: "Centro de Costos", type: "select", options: costCenters},
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
                                {/* ===============================================================
                                    MÉTODOS DE PAGO ASIGNADOS AL PUNTO DE VENTA
                                =============================================================== */}
                                <section className="col-span-1 sm:col-span-2 mt-4">
                                    <label className="font-semibold text-md mb-1">Métodos de Pago Disponibles</label>

                                    <div className="bg-[#6E1515] rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                                        {paymentMethods?.map((pm) => {
                                            const isSelected = isSalePoint.methods.includes(pm.id)

                                            return (
                                                <button
                                                    key={pm.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSalePoint(prev => ({
                                                            ...prev,
                                                            methods: isSelected
                                                                ? prev.methods.filter(id => id !== pm.id)  // Quitar método
                                                                : [...prev.methods, pm.id]                 // Agregar método
                                                        }))
                                                    }}
                                                    className={`
                                                        flex items-center justify-between p-3 rounded-lg border 
                                                        transition cursor-pointer
                                                        ${isSelected
                                                            ? "bg-amber-200 text-[#841A1A] border-amber-300 font-semibold"
                                                            : "bg-[#7a1717] text-amber-100 border-[#8a1a1a]"
                                                        }
                                                    `}
                                                >
                                                    <div className="flex flex-col text-left">
                                                        <p className="font-semibold">{pm.name}</p>
                                                        <p className="text-xs opacity-70">{pm.type}</p>
                                                    </div>

                                                    {isSelected ? (
                                                        <X className="w-5 h-5" />
                                                    ) : (
                                                        <CreditCard className="w-5 h-5" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </section>
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