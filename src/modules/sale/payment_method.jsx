import { useState, useEffect } from "react"
import { CreditCard, DamIcon, Loader, Save, X, Power } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import {formatDateTime} from "../../utils/formatData"
import usePaymentMethod from "../../hooks/sale/usePaymentMethod"

export default function PaymentMethod () {
    const {isLoading, paymentMethodSiigo, paymentMethods, POST_PaymentMethod, GET_PaymentMethodSiigo} = usePaymentMethod()
    const [isAction, setAction] = useState("PaymentMethod")
    const initialData = { id: "", name: "", type: "", active: "", due_date: ""}
    const [isPaymentMethod, setPaymentMethod] = useState(initialData)

    useEffect(() => {
        GET_PaymentMethodSiigo()
    }, [])

    const handleSelectSiigo = (id) => {
        const found = paymentMethodSiigo?.find(u => u.id === Number(id))
        if (found) {
            setPaymentMethod(found)  // SOLO SE EJECUTA AL CAMBIAR EL SELECT
        }
    }

    const SubmitPaymentMethod = async (e) => {
        e.preventDefault()
        POST_PaymentMethod(isPaymentMethod)
    }
    return (
        <>
            <ModulesHeader
                module={"Metodos de Pago"}
                description={"Registra tus metodos de pago de siigo, visualizalos y mantenlos actualizados"}
            />
            <section className=" container mx-auto max-w-7xl 2xl:max-w-[90%]">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button
                        onClick={() => setAction('PaymentMethod')}
                        className={`px-4 py-2 cursor-pointer ${isAction === "PaymentMethod" && "border-b-4 font-semibold"}`}
                    >
                        Metodos de Pagos del Sistema
                    </button>
                    <button
                        onClick={() => setAction('Input')}
                        className={`px-4 py-2 cursor-pointer ${isAction === "Input" && "border-b-4 font-semibold"}`}
                    >
                        {isPaymentMethod.id ? "Editar Sucursal" : "Registrar Metodo de Pago"}
                    </button>
                </div>

                {/* ===============================================================
                    TABLA DE CENTRO DE COSTOS POS
                =============================================================== */}
                {isAction === "PaymentMethod" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#841A1A] text-amber-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-nowrap">ID</th>
                                    <th className="px-4 py-3 text-left text-nowrap">name</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Tipo</th>
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
                                    paymentMethods?.map((pm) => (
                                        <tr key={pm.id} className="border-b border-gray-200">
                                            <td className="p-4">{pm.id}</td>
                                            <td className="p-4">{pm.name}</td>
                                            <td className="p-4">{pm.type}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 flex w-fit items-center gap-2 rounded-full text-xs font-semibold ${
                                                    pm.active === 1 ? "bg-amber-200 text-green-700" : "bg-amber-200 text-red-700"
                                                }`}>
                                                    <p className={`h-2 w-2 animate-pulse rounded-full ${ pm.active === 1 ? "bg-green-700" : "bg-red-700" }`}/>
                                                    {pm.active === 1 ? "Activo" : "Cerrado"}
                                                </span>
                                            </td>
                                            <td className="p-4">{formatDateTime(pm.created_at)}</td>
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
                            <h1 className="font-semibold text-lg">Datos del Metodo de Pago</h1>
                            <p className="text-xs">
                                {isPaymentMethod.id ? "Actualiza la información de bodega" : "Completa la información para registrar un nuevo metodo de pago"}
                            </p>
                        </div>

                        <section className="w-full mt-6">
                            <label className="block font-semibold mb-1">Elige el centro de costos desde Siigo:</label>
                            <select value={isPaymentMethod.id} onChange={(e) => handleSelectSiigo(e.target.value)} className="w-1/2 flex items-center bg-[#6E1515] text-amber-100 px-4 py-2 rounded-lg">
                                <option value="">Seleccionar...</option>
                                {paymentMethodSiigo?.map((pm) => (
                                    <option key={pm.id} value={pm.id}>
                                        {pm.name}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <form onSubmit={SubmitPaymentMethod}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
                                {[
                                    { icon: CreditCard, name: "name", label: "Metodo de Pago" },
                                    { icon: DamIcon, name: "type", label: "Tipo" },
                                    { icon: Power, name: "active", label: "Estado" },
                                    { icon: DamIcon, name: "due_date", label: "Vencimiento" },
                                ].map((field) => (
                                    <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                                    <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                        <field.icon className="ml-3" />
                                        <input value={isPaymentMethod[field.name]} disabled type={"text"} onChange={(e) => useHandleInputChange(setPaymentMethod, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                    </div>
                                    </section>
                                ))}
                            </div>
                            {/* -- Botones de acción -- */}
                            <div className="flex justify-end mt-8 gap-2">
                                {isPaymentMethod.id && (
                                    <button
                                        onClick={() => setPaymentMethod(initialData)}
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