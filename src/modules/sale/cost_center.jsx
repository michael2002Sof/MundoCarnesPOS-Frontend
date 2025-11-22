import { useEffect, useState } from "react"
import { Power, WarehouseIcon, Save, Loader, X, ActivityIcon, Receipt, Hash } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import { formatDateTime } from "../../utils/formatData"
import useCostCenter from "../../hooks/sale/useCostCenter"

export default function CostCenter () {
    const {isLoading, costCenters, costCenterSiigo, POST_CostCenter, GET_CostCenterSiigo} = useCostCenter()
    //console.log("Centro de costos POS: ", costCenters)
    console.log("Centro de costos Siigo: ", costCenterSiigo)
    const [isAction, setAction] = useState("CostCenters")
    const initialData = { id: "", code: "", name: "", active: ""}
    const [isCostCenter, setCostCenter] = useState(initialData)

    const handleSelectSiigo = (id) => {
        const found = costCenterSiigo?.find(u => u.id === Number(id))
        if (found) {
            setCostCenter(found)  // SOLO SE EJECUTA AL CAMBIAR EL SELECT
        }
    }
    useEffect(() => {
        GET_CostCenterSiigo()
    }, [])

    const SubmitCostCenter = async (e) => {
        e.preventDefault()
        POST_CostCenter(isCostCenter)
    }
    return (
        <>
            <ModulesHeader
                module={"Centro de Costos"}
                description={"Registra tus centro de costos de siigo y visualiza su existencia"}
            />

            <section className=" container mx-auto max-w-7xl 2xl:max-w-[90%]">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button
                        onClick={() => setAction('CostCenters')}
                        className={`px-4 py-2 cursor-pointer ${isAction === "CostCenters" && "border-b-4 font-semibold"}`}
                    >
                        Centro de Costos del Sistema
                    </button>
                    <button
                        onClick={() => setAction('Input')}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Input" && "border-b-4 font-semibold"}`}
                    >
                        {isCostCenter.id ? "Editar Sucursal" : "Registrar Centro de Costo"}
                    </button>
                </div>


                {/* ===============================================================
                    TABLA DE CENTRO DE COSTOS POS
                =============================================================== */}
                {isAction === "CostCenters" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#841A1A] text-amber-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">ID</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Codigo</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Centro de Costo</th>
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
                                                Cargando Bodegas...
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    costCenters?.map((cc) => (
                                        <tr key={cc.id} className="border-b border-gray-200">
                                            <td className="p-4">{cc.id}</td>
                                            <td className="p-4">{cc.code}</td>
                                            <td className="p-4">{cc.name}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 flex w-fit items-center gap-2 rounded-full text-xs font-semibold ${
                                                    cc.active === 1 ? "bg-amber-200 text-green-700" : "bg-amber-200 text-red-700"
                                                }`}>
                                                    <p className={`h-2 w-2 animate-pulse rounded-full ${ cc.active === 1 ? "bg-green-700" : "bg-red-700" }`}/>
                                                    {cc.active === 1 ? "Activo" : "Cerrado"}
                                                </span>
                                            </td>
                                            <td className="p-4">{formatDateTime(cc.created_at)}</td>
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
                                {isCostCenter.id ? "Actualiza la información de bodega" : "Completa la información para registrar un nuevo centro de costos"}
                            </p>
                        </div>

                        <section className="w-full mt-6">
                            <label className="block font-semibold mb-1">Elige el centro de costos desde Siigo:</label>
                            <select value={isCostCenter.id} onChange={(e) => handleSelectSiigo(e.target.value)} className="w-1/2 flex items-center bg-[#6E1515] text-amber-100 px-4 py-2 rounded-lg">
                                <option value="">Seleccionar...</option>
                                {costCenterSiigo?.map((cc) => (
                                    <option key={cc?.id} value={cc?.id}>
                                        {cc?.name}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <form onSubmit={SubmitCostCenter}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
                                {[
                                    { icon: Hash, name: "code", label: "Codigo" },
                                    { icon: Receipt, name: "name", label: "Centro de Costo" },
                                    { icon: Power, name: "active", label: "Estado" },
                                ].map((field) => (
                                    <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                                    <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                        <field.icon className="ml-3" />
                                        <input value={isCostCenter[field.name]} disabled type={"text"} onChange={(e) => useHandleInputChange(setCostCenter, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                    </div>
                                    </section>
                                ))}
                            </div>
                            {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isCostCenter.id && (
                                    <button
                                        onClick={() => setCostCenter(initialData)}
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