import { useState, useEffect } from "react"
import { Power, Save, Loader, X, Store, Hash, ToggleLeft, FileSignature, Layers, Cable, FileText, Landmark } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import useInvoiceResolution from "../../hooks/sale/useInvoiceResolution"
import {formatDateTime} from "../../utils/formatData"
import useCostCenter from "../../hooks/sale/useCostCenter"
import useSalePoint from "../../hooks/sale/useSalePoint"
import useHandleInputChange from "../../utils/useHandleInputChange"

export default function InvoiceResolution () {
    const {isLoading, invoicesResolutionSiigo, invoicesResolution, GET_InvoiceResolutionSiigo, POST_InvoiceResolution} = useInvoiceResolution()
    const {costCenters} = useCostCenter()
    const {salePoints} = useSalePoint()
    console.log("Resoluciones del POS:", invoicesResolution)
    const [isAction, setAction] = useState("Resoluciones")
    const initialData = { siigo_id: "", sale_point: "", cost_center_default: "", code: "", name: "", type: "", electronic_type: "", active: "", description: ""}
    const [isResolution, setResolution] = useState(initialData)

    useEffect(() => {
        if(isAction === "Input") {
            GET_InvoiceResolutionSiigo()
        }
    }, [isAction])

    const handleSelectSiigo = (id) => {
        const found = invoicesResolutionSiigo?.find(r => r.id === Number(id))
        if (found) {
            setResolution(found)  // SOLO SE EJECUTA AL CAMBIAR EL SELECT
        }
    }
    
    const SubmitResolution = async (e) => {
        e.preventDefault()
        const payload = { ...isResolution, siigo_id: isResolution.id }
        POST_InvoiceResolution(payload)
        setResolution(initialData)
    }

    return (
        <>
            <ModulesHeader
                module={"Resoluciones de Facturas"}
                description={"Registra tus centro de costos de siigo y visualiza su existencia"}
            />

            <section className=" container mx-auto max-w-7xl 2xl:max-w-[90%]">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button
                        onClick={() => setAction('Resoluciones')}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Resoluciones" && "border-b-4 font-semibold"}`}
                    >
                        Centro de Costos del Sistema
                    </button>
                    <button
                        onClick={() => setAction('Input')}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Input" && "border-b-4 font-semibold"}`}
                    >
                        {isResolution.id ? "Editar Sucursal" : "Registrar Centro de Costo"}
                    </button>
                </div>


                {/* ===============================================================
                    TABLA DE CENTRO DE COSTOS POS
                =============================================================== */}
                {isAction === "Resoluciones" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#841A1A] text-amber-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">ID</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Tipo</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Codigo</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Descripción</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Punto de Venta</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Centro de Costos</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Estado</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Creado en</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="p-4 w-full flex items-center justify-center gap-2">
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Cargando Resoluciones...
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    invoicesResolution?.map((r) => (
                                        <tr key={r.id} className="border-b border-gray-200">
                                            <td className="p-4">{r.siigo_id}</td>
                                            <td className="p-4">{r.type}</td>
                                            <td className="p-4">{r.code}</td>
                                            <td className="p-4">{r.description}</td>
                                            <td className="p-4">{r.sale_point}</td>
                                            <td className="p-4">{r.cost_center}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 flex w-fit items-center gap-2 rounded-full text-xs font-semibold ${
                                                    r.active === 1 ? "bg-amber-200 text-green-700" : "bg-amber-200 text-red-700"
                                                }`}>
                                                    <p className={`h-2 w-2 animate-pulse rounded-full ${ r.active === 1 ? "bg-green-700" : "bg-red-700" }`}/>
                                                    {r.active === 1 ? "Activo" : "Cerrado"}
                                                </span>
                                            </td>
                                            <td className="p-4">{formatDateTime(r.created_at)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ===============================================================
                    FORMULARIO CREAR / EDITAR BODEGA
                =============================================================== */}
                {isAction === "Input" && (
                    <section className="bg-[#841A1A] text-amber-100 rounded-xl p-6">
                        <div>
                            <h1 className="font-semibold text-lg">Datos del Centro de Costo</h1>
                            <p className="text-xs">
                                {isResolution.id ? "Actualiza la información de bodega" : "Completa la información para registrar un nuevo centro de costos"}
                            </p>
                        </div>

                        <section className="w-full mt-6">
                            <label className="block font-semibold mb-1">Elige el centro de costos desde Siigo:</label>
                            <select value={isResolution.id} onChange={(e) => handleSelectSiigo(e.target.value)} className="w-1/2 flex items-center bg-[#6E1515] text-amber-100 px-4 py-2 rounded-lg">
                                <option value="">Seleccionar...</option>
                                {invoicesResolutionSiigo?.map((r) => (
                                    <option key={r?.id} value={r?.id}>
                                        {r?.description}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <form onSubmit={SubmitResolution}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
                                {[
                                    { icon: Hash, name: "code", label: "Codigo" },
                                    { icon: ToggleLeft, name: "active", label: "Estado" },
                                    { icon: FileSignature, name: "name", label: "Nombre" },
                                    { icon: Layers, name: "type", label: "Tipo" },
                                    { icon: Cable, name: "electronic_type", label: "Tipo Electronico" },
                                    { icon: FileText, name: "description", label: "Descripcion" },
                                    { icon: Store, name: "sale_point", label: "Punto de Venta", type: "select", options: salePoints },
                                    { icon: Landmark, name: "cost_center_default", label: "Centro de Costo", type: "select", options: costCenters },
                                ].map((field) => (
                                    <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                                    <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                        {field.type === "select" ? (
                                            <>
                                                <field.icon className="ml-3" />
                                                <select value={isResolution[field.name]} required  onChange={(e) => useHandleInputChange(setResolution, field.name, e.target.value)} className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
                                                    <option value="">Seleccionar...</option>
                                                    {Array.isArray(field.options) && field.options.map((option) => (
                                                        <option key={option.id} value={option.id}>{option.name}</option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : (
                                            <>
                                                <field.icon className="ml-3" />
                                                <input value={isResolution[field.name]} type={"text"} onChange={(e) => useHandleInputChange(setResolution, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                            </>
                                        )}
                                    </div>
                                    </section>
                                ))}
                            </div>
                            {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isResolution.id && (
                                    <button
                                        onClick={() => setResolution(initialData)}
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
                                            <Loader className="w-5 h-5 animate-spin" />
                                            <p>Procesando...</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="w-5 h-5" />
                                            <p>Registrar Centro de Costo</p>
                                        </div>
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