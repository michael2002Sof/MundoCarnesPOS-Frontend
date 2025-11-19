import { useState, useEffect } from "react"
import { Eye, Loader } from "lucide-react"
import { ModulesHeader } from "../../components/shared/headers"
import { formatDateTime, formatDecimal } from "../../utils/formatData"

import useCreditNote from "../../hooks/sale/useCreditNote"


export default function CreditNote() {
  const {isLoading, creditNotes, GET_ByDate} = useCreditNote()

  const today = new Date().toISOString().split('T')[0];
  const [filterFechaInicio, setFilterFechaInicio] = useState(today);

  useEffect(() => {
    GET_ByDate(filterFechaInicio)
  }, [filterFechaInicio])


  return (
    <>
      <ModulesHeader
        module="Notas de Crédito"
        description="Gestiona las notas de crédito emitidas, consulta facturas y genera devoluciones parciales o totales."
      />
      {/* Filtro de fecha */}
      <div className="bg-[#841A1A] text-amber-100 container rounded-lg shadow p-6 mb-6">
        <h1 className="text-lg font-semibold">Búsqueda por Fecha</h1>
        <p className="text-xs">Selecciona la fecha de las sesiones de caja</p>
        <input
          type="date"
          className="px-4 focus:outline-none py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-blue-500"
          value={filterFechaInicio}
          onChange={(e) => setFilterFechaInicio(e.target.value)}
        />
      </div>

      <section className="container mx-auto max-w-7xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#841A1A] text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Código</th>
                <th className="px-4 py-3">Factura</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Vendedor</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 rounded-tr-lg text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={10}>
                    <div className="p-4 w-full flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Cargando Sucursales...
                    </div>
                  </td>
                </tr>
              ): (
                <>
                  {creditNotes?.map((note, idx) => (
                    <tr
                      key={note.id}
                      className={`border-b hover:bg-gray-50 transition ${
                        idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-2 font-semibold text-[#841A1A]">{note.code}</td>
                      <td className="px-4 py-2 text-gray-700">{note.reference_invoice}</td>
                      <td className="px-4 py-2">{note.customer_name || "—"}</td>
                      <td className="px-4 py-2">{note.seller_name || "—"}</td>
                      <td className="px-4 py-2">
                        {formatDateTime(note.created_at)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {formatDecimal(note.total, true)}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{note.reason || "—"}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            note.status === "active"
                              ? "bg-green-100 text-green-800"
                              : note.status === "credited"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {note.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 text-[#841A1A] transition"
                          onClick={() => console.log("Ver detalles:", note)}
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </>

              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
