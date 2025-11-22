import { useEffect, useState } from "react"
import { Power, WarehouseIcon, Save, Loader, X, ActivityIcon } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import {formatDateTime} from "../../utils/formatData"
import useWarehouse from "../../hooks/inventory/useWarehouse"

export default function Warehouse () {
    const {isLoading, warehouses, warehouseSiigo, POST_Warehouse, GET_WarehouseSiigo} = useWarehouse()
    //console.log("Bodegas POS: ", warehouses)
    //console.log("Bodegas Siigo: ", warehouseSiigo)
    const [isAction, setAction] = useState("Warehouses")
    const initialData = { id: "", name: "", active: "", has_movements: ""}
    const [isWarehouse, setWarehouse] = useState(initialData)

    useEffect(() => {
        GET_WarehouseSiigo()
    }, [])

    const handleSelectSiigo = (id) => {
        const found = warehouseSiigo?.find(u => u.id === Number(id))
        if (found) {
            setWarehouse(found)  // SOLO SE EJECUTA AL CAMBIAR EL SELECT
        }
    }


    const SubmitWarehouse = async (e) => {
        e.preventDefault()
        POST_Warehouse(isWarehouse)
    }

    return (
        <>
            <ModulesHeader
                module={"Bodegas"}
                description={"Registra tus bodegas de siigo y visualiza su existencia"}
            />

            <section className=" container mx-auto max-w-7xl 2xl:max-w-[90%]">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button
                        onClick={() => setAction('Warehouses')}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Warehouses" && "border-b-4 font-semibold"}`}
                    >
                        Sucursales del Sistema
                    </button>
                    <button
                        onClick={() => setAction('Input')}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Input" && "border-b-4 font-semibold"}`}
                    >
                        {isWarehouse.id ? "Editar Sucursal" : "Registrar Sucursal"}
                    </button>
                </div>


                {/* ===============================================================
                    TABLA DE BODEGAS POS
                =============================================================== */}
                {isAction === "Warehouses" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#841A1A] text-amber-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">ID</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Bodega</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Estado</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Movimiento</th>
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
                                    warehouses?.map((wh) => (
                                        <tr key={wh.id} className="border-b border-gray-200">
                                            <td className="p-4">{wh.id}</td>
                                            <td className="p-4">{wh.name}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 flex w-fit items-center gap-2 rounded-full text-xs font-semibold ${
                                                    wh.active === 1 ? "bg-amber-200 text-green-700" : "bg-amber-200 text-red-700"
                                                }`}>
                                                    <p className={`h-2 w-2 animate-pulse rounded-full ${ wh.active === 1 ? "bg-green-700" : "bg-red-700" }`}/>
                                                    {wh.active === 1 ? "Activo" : "Cerrado"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 flex w-fit items-center gap-2 rounded-full text-xs font-semibold ${
                                                    wh.has_movements === 1 ? "bg-amber-200 text-green-700" : "bg-amber-200 text-red-700"
                                                }`}>
                                                    <p className={`h-2 w-2 animate-pulse rounded-full ${ wh.has_movements === 1 ? "bg-green-700" : "bg-red-700" }`}/>
                                                    {wh.has_movements === 1 ? "Activo" : "Cerrado"}
                                                </span>
                                            </td>
                                            <td className="p-4">{formatDateTime(wh.created_at)}</td>
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
                            <h1 className="font-semibold text-lg">Datos de Bodega</h1>
                            <p className="text-xs">
                                {isWarehouse.id ? "Actualiza la información de bodega" : "Completa la información para registrar una nueva bodega"}
                            </p>
                        </div>

                        <section className="w-full mt-6">
                            <label className="block font-semibold mb-1">Elige la bodega de Siigo:</label>
                            <select value={isWarehouse.id} onChange={(e) => handleSelectSiigo(e.target.value)} className="w-1/2 flex items-center bg-[#6E1515] text-amber-100 px-4 py-2 rounded-lg">
                                <option value="">Seleccionar...</option>
                                {warehouseSiigo?.map((wh) => (
                                    <option key={wh?.id} value={wh?.id}>
                                        {wh?.name}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <form onSubmit={SubmitWarehouse}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
                                {[
                                    { icon: WarehouseIcon, name: "name", label: "Bodega" },
                                    { icon: Power, name: "active", label: "Estado" },
                                    { icon: ActivityIcon, name: "has_movements", label: "Movimiento" },
                                ].map((field) => (
                                    <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                                    <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                        <field.icon className="ml-3" />
                                        <input value={isWarehouse[field.name]} disabled type={"text"} onChange={(e) => useHandleInputChange(setWarehouse, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                    </div>
                                    </section>
                                ))}
                            </div>
                            {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isWarehouse.id && (
                                    <button
                                        onClick={() => setWarehouse(initialData)}
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
                                            <p>Registrar Bodega</p>
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