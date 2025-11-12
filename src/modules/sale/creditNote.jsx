import { useState } from "react"

import { ModulesHeader } from "../../components/shared/headers"

export default function CreditNote () {
    const [isLoading, setLoading] = useState(false)
    const [isNote, setNote] = useState({id: null})
    const [isAction, setAction] = useState("Manage Credit Notes")
    return (
        <>
            <ModulesHeader module="Notas de Crédito" description="Gestiona las notas de crédito emitidas en el sistema, visualiza su información detallada y realiza acciones como editar o eliminar según sea necesario." />
                <section className=" container mx-auto max-w-5xl">
                    {/* -- Pestañas principales -- */}
                    <div className="border-b mb-4 text-[#841A1A]">
                        <button
                            onClick={() => setAction("Manage Credit Notes")}
                            className={`px-4 py-2 cursor-pointer ${isAction === "Manage Credit Notes" && "border-b-4 font-semibold"}`}
                        >
                            Notas de Crédito
                        </button>
                        <button
                            onClick={() => setAction("Credit Note Input")}
                            className={`px-4 py-2 cursor-pointer ${isAction === "Credit Note Input" && "border-b-4 font-semibold"}`}
                        >
                            {isNote.id ? "Editar Sucursal" : "Registrar Sucursal"}
                        </button>
                    </div>
            { isAction === "Manage Credit Notes" && (
                <section className="p-6 bg-white rounded-2xl shadow-sm container mx-auto max-w-4xl mb-6">
                    <h2 className="text-xl font-bold mb-4">Gestión de Notas de Crédito</h2>
                    <p className="text-sm mb-6">Aquí puedes ver y gestionar todas las notas de crédito emitidas en el sistema.</p>
                    {/* Tabla o lista de notas de crédito */}
                </section>
            )}
            { isAction === "Credit Note Input" && (
                <section className="p-6 bg-[#841A1A] text-amber-100 rounded-2xl shadow-sm container mx-auto max-w-4xl mb-6">
                    <h2 className="text-xl font-bold">{ isNote.id ? "Editar Nota de Crédito" : "Registrar Nueva Nota de Crédito"}</h2>
                    <p className="text-sm mb-6">Completa el formulario para { isNote.id ? "editar la nota de crédito" : "registrar una nueva nota de crédito"}.</p>
                    {/* Formulario para registrar o editar nota de crédito */}
                </section>
            )}

            </section>

        </>
    )
}