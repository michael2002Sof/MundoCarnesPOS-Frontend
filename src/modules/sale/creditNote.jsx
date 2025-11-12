import { useState, useEffect } from "react"
import { Eye } from "lucide-react"
import { ModulesHeader } from "../../components/shared/headers"
import { GetInvoiceByCode, GetAllCreditNote } from "../../hooks/sales"
import axiosInstance from "../../api/axiosintance"
import usePersistentResponse from "../../utils/response_message"
import { formatDateTime, formatDecimal } from "../../utils/formatData"


export default function CreditNote() {
  const [codeInvoice, setCodeInvoice] = useState("")
  const { invoice, FetchInvoice } = GetInvoiceByCode(codeInvoice)
  const { creditNotes, FetchCreditNotes} = GetAllCreditNote()
  console.log("Notas de crédito cargadas:", creditNotes)
  const [isLoading, setLoading] = useState(false)
  const [creditNote, setCreditNote] = useState(null)
  const [returnedItems, setReturnedItems] = useState([]) // 🧾 Solo los productos devueltos
  const [action, setAction] = useState("Manage Credit Notes")

  // 🧾 Cuando se encuentra la factura, inicializa los datos base de la nota de crédito
  useEffect(() => {
    if (invoice && invoice.id) {
      setCreditNote({
        ...invoice,
        type: "credit_note",
        reference_invoice: invoice.code,
        code: "", // será generado por backend
        reason: "",
        subtotal: "0.00",
        tax0: "0.00",
        tax5: "0.00",
        tax19: "0.00",
        total: "0.00",
        itemsProduct: invoice.itemsProduct,
      })
      setReturnedItems([]) // Reiniciar si se busca otra factura
    }
  }, [invoice])

  // 🧮 Recalcular totales automáticamente cuando cambian los items devueltos
  useEffect(() => {
    if (!returnedItems || returnedItems.length === 0) {
      setCreditNote((prev) => ({
        ...prev,
        subtotal: "0.00",
        tax0: "0.00",
        tax5: "0.00",
        tax19: "0.00",
        total: "0.00",
      }))
      return
    }

    const subtotal = returnedItems.reduce(
      (acc, item) => acc + parseFloat(item.unit_price) * parseFloat(item.quantity),
      0
    )
    const tax0 = 0
    const tax5 = returnedItems.reduce((acc, i) => acc + parseFloat(i.tax5 || 0), 0)
    const tax19 = returnedItems.reduce((acc, i) => acc + parseFloat(i.tax19 || 0), 0)
    const total = subtotal + tax0 + tax5 + tax19

    setCreditNote((prev) => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      tax0: tax0.toFixed(2),
      tax5: tax5.toFixed(2),
      tax19: tax19.toFixed(2),
      total: total.toFixed(2),
    }))
  }, [returnedItems])

  // 🚀 Enviar la nota de crédito al backend
  const handleSubmit = async () => {
    if (!creditNote || returnedItems.length === 0) {
      alert("Debe seleccionar al menos un producto para devolver.")
      return
    }

    try {
      const payload = {
        company: creditNote.company,
        type: "credit_note",
        reference_invoice: creditNote.reference_invoice,
        sales_point: creditNote.sales_point,
        cash_session: creditNote.cash_session,
        seller: creditNote.seller,
        customer: creditNote.customer,
        subtotal: creditNote.subtotal,
        tax0: creditNote.tax0,
        tax5: creditNote.tax5,
        tax19: creditNote.tax19,
        total: creditNote.total,
        reason: creditNote.reason,
        items: returnedItems.map((i) => ({
          product_name: i.product_name,
          product_barcode: i.product_barcode,
          quantity: i.quantity,
          unit_price: i.unit_price,
          discount: i.discount,
          tax0: i.tax0,
          tax5: i.tax5,
          tax19: i.tax19,
          total: i.total,
        })),
      }

      console.log("Nota de crédito lista para enviar:", payload)

      const res = await axiosInstance.post("/posinnovate/app/sale/return/register", payload)
      usePersistentResponse(res)
    } catch (error) {
      usePersistentResponse(error)
    } finally {
      // Reiniciar estado después de enviar
      setCodeInvoice("")
      setCreditNote(null)
      setReturnedItems([])
      FetchCreditNotes()
    }
  }

  return (
    <>
      <ModulesHeader
        module="Notas de Crédito"
        description="Gestiona las notas de crédito emitidas, consulta facturas y genera devoluciones parciales o totales."
      />

      <section className="container mx-auto max-w-5xl">
        {/* Tabs */}
        <div className="border-b mb-4 text-[#841A1A]">
          <button
            onClick={() => setAction("Manage Credit Notes")}
            className={`px-4 py-2 ${action === "Manage Credit Notes" && "border-b-4 font-semibold"}`}
          >
            Notas de Crédito
          </button>
          <button
            onClick={() => setAction("Credit Note Input")}
            className={`px-4 py-2 ${action === "Credit Note Input" && "border-b-4 font-semibold"}`}
          >
            Registrar Nota de Crédito
          </button>
        </div>
        {action === "Manage Credit Notes" && ( 
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
            </tbody>
          </table>
          </div>
         )}

        {action === "Credit Note Input" && (
          <section className="p-6 bg-[#841A1A] text-amber-100 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Registrar Nueva Nota de Crédito</h2>

            {/* Buscar factura */}
            <div className="flex items-center gap-2 mb-6">
              <input
                type="text"
                placeholder="Código de factura (Ej: FEC-0001)"
                value={codeInvoice}
                onChange={(e) => setCodeInvoice(e.target.value)}
                className="flex-1 p-2 rounded-lg border focus:outline-none"
              />
              <button
                onClick={() => FetchInvoice()}
                disabled={!codeInvoice.trim()}
                className="bg-amber-200 text-[#841A1A] font-semibold px-4 py-2 rounded-lg hover:bg-amber-200/80 cursor-pointer transition"
              >
                Buscar
              </button>
            </div>

            {/* Factura encontrada */}
            {creditNote && creditNote.id ? (
              <div className="bg-white text-gray-800 p-4 rounded-lg shadow-inner">
                <h3 className="text-lg font-semibold mb-3">
                  Factura base: <span className="text-[#841A1A]">{creditNote.reference_invoice}</span>
                </h3>

                {/* Motivo */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Motivo de la devolución
                  </label>
                  <textarea
                    rows="3"
                    value={creditNote.reason}
                    onChange={(e) => setCreditNote({ ...creditNote, reason: e.target.value })}
                    placeholder="Describe el motivo de la devolución..."
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Tabla de productos */}
                <h4 className="font-semibold text-[#841A1A] mb-2">Productos de la factura</h4>
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Producto</th>
                      <th className="p-2">Cantidad</th>
                      <th className="p-2">Precio</th>
                      <th className="p-2">Total</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditNote.itemsProduct.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.product_name}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">${item.unit_price}</td>
                        <td className="p-2">${item.total}</td>
                        <td className="p-2 text-right">
                          <button
                            onClick={() => {
                              setReturnedItems((prev) => [...prev, item])
                              setCreditNote((prev) => ({
                                ...prev,
                                itemsProduct: prev.itemsProduct.map((p) =>
                                  p.product_barcode === item.product_barcode
                                    ? { ...p, returned: true }
                                    : p
                                ),
                              }))
                            }}
                            disabled={item.returned}
                            className={`${
                              item.returned
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:underline"
                            }`}
                          >
                            {item.returned ? "Devuelto" : "Devolver"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Productos devueltos */}
                {returnedItems.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-[#841A1A] mb-2">Productos devueltos</h4>
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2">Producto</th>
                          <th className="p-2">Cantidad</th>
                          <th className="p-2">Precio</th>
                          <th className="p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnedItems.map((item, index) => (
                          <tr key={index} className="border-b bg-red-50 text-red-700">
                            <td className="p-2">{item.product_name}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">${item.unit_price}</td>
                            <td className="p-2">${item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Totales */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Subtotal</label>
                    <input
                      type="number"
                      value={creditNote.subtotal}
                      disabled
                      className="w-full p-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">IVA 19%</label>
                    <input
                      type="number"
                      value={creditNote.tax19}
                      disabled
                      className="w-full p-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Total</label>
                    <input
                      type="number"
                      value={creditNote.total}
                      disabled
                      className="w-full p-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                </div>

                {/* Botón final */}
                <button
                  onClick={handleSubmit}
                  className="mt-6 bg-[#841A1A] text-amber-100 px-6 py-2 rounded-lg font-semibold hover:bg-[#9e1e1e] transition"
                >
                  Generar Nota de Crédito
                </button>
              </div>
            ) : (
                <p className="text-sm text-amber-200 mt-4">
                  Ingresa en código de una factura válida para comenzar a crear una nota de crédito.
                </p>
            )}
          </section>
        )}
      </section>
    </>
  )
}
