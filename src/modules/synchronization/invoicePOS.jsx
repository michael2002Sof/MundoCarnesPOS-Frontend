import { Loader, Eye, Printer, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import moment from "moment-timezone"
import axiosInstance from "../../api/axiosintance"

import { ModulesHeader } from "../../components/shared/headers"
import DecodeToken from "../../api/decode"
import useReport from "../../hooks/sale/useReport"
import useUser from "../../hooks/user/useUser"

import { formatDecimal } from "../../utils/formatData"
import toast from "react-hot-toast"



export default function InvoicePOS () {
    const { isLoading, invoices, totalCount, totalPages, GET_InvoicesByDate } = useReport()
    const token = DecodeToken()
    const {usersPOS} = useUser()
    const [synchroning, setSynchroning] = useState(false)

    const today = moment().tz("America/Bogota").format("YYYY-MM-DD");
    const [date, setDate] = useState(today);
    const [user, setUser] = useState(token?.id)
    const [page, setLocalPage] = useState(1);

    const [selectedInvoices, setSelectedInvoices] = useState([]);

    useEffect(() => {
        GET_InvoicesByDate({date, user, page, pos: true });
    }, [date, user, page]);

    const handlePrevPage = () => {
        setLocalPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setLocalPage(prev => Math.min(totalPages, prev + 1));
    };

    const toggleInvoice = (id) => {
        setSelectedInvoices(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const currentPageIds = invoices.map(inv => inv.id);

        const allSelected = currentPageIds.every(id =>
            selectedInvoices.includes(id)
        );

        if (allSelected) {
            // Deseleccionar todas las de la página actual
            setSelectedInvoices(prev =>
                prev.filter(id => !currentPageIds.includes(id))
            );
        } else {
            // Seleccionar todas las de la página actual
            setSelectedInvoices(prev => [
                ...new Set([...prev, ...currentPageIds])
            ]);
        }
    };

    const allSelected =
        invoices?.length > 0 &&
        invoices?.every(inv => selectedInvoices.includes(inv.id));

    const handleSyncInvoices = async () => {
        try {
            //console.log("Data enviada: ", selectedInvoices)
            setSynchroning(true)
            const res = await axiosInstance.post("/posinnovate/siigo/sync/invoice", selectedInvoices);

            GET_InvoicesByDate({
                date,
                user,
                page,
                pos: true
            });   
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSynchroning(false)
        }
    };

    let length

    return (
        <>
            <ModulesHeader 
                module="Facturas POS"
                description="Consulta las facturas POS por fecha y sincrioniza con Siigo"
            />

             {/* Filtro de fecha */}
            <div className="bg-foreground text-amber-100 w-full rounded-lg shadow p-6 ">
                <h1 className="text-lg font-semibold">Búsqueda por Fecha</h1>
                <p className="text-xs">Selecciona la fecha de la factura a buscar</p>
                <section className="flex items-center justify-between gap-4">
                    <div className="gap-4 flex items-center">
                    <input
                    type="date"
                    className="px-4 py-2 rounded-lg mt-4 border-b focus:outline-none cursor-pointer"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                    {token?.rol === "admin" && (
                        <select 
                            type="text" 
                            className="px-4 py-2 rounded-lg mt-4 border-b focus:outline-none cursor-pointer"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        >
                        <option value={token?.id}>Todas</option>
                        {usersPOS?.map(u => (
                            <option value={u.id}>{u.name}</option>
                        ))}
                    </select>
                    )}
                    </div>
                </section>
            </div>
            <section className="flex w-full">
                <button
                    disabled={!selectedInvoices?.length}
                    onClick={handleSyncInvoices}
                    className="bg-green-600 whitespace-nowrap cursor-pointer text-white px-4 py-2 rounded-lg"
                >
                    {synchroning ? (
                        <span>Sincronizando...</span>
                    ): (
                        <span>Sincronizar ({selectedInvoices?.length})</span>
                    )}
                </button>
                <section className="text-gray-700 font-medium w-full my-2  flex justify-end">
                    <p>Total de facturas: {totalCount}</p>
                </section>
            </section>

            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-foreground text-white uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="px-4 py-3">Factura</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Vendedor</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3 rounded-tr-lg text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700">
                    {isLoading ? (
                        <tr>
                        <td colSpan={10}>
                            <div className="p-4 w-full flex items-center justify-center gap-2">
                                <Loader className="w-5 h-5 animate-spin" />
                                Cargando Facturas...
                            </div>
                        </td>
                        </tr>
                    ): (
                        <>
                        {invoices?.map((inv, idx) => (
                            <tr
                            key={idx}
                            className={`border-b hover:bg-gray-50 transition ${
                                idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                            }`}
                            >
                            <td className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedInvoices.includes(inv.id)}
                                    onChange={() => toggleInvoice(inv.id)}
                                />
                            </td>
                            <td className="px-4 py-2 text-gray-700">{inv.code}</td>
                            <td className="px-4 py-2">{inv.client || "—"}</td>
                            <td className="px-4 py-2">{inv.vendedor || "—"}</td>
                            <td className="px-4 py-2">{formatDecimal(inv.total, true)}</td>
                            <td className="px-4 py-2">
                                <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    inv.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : inv.status === "credited"
                                    ? "bg-yellow-300 text-yellow-900"
                                    : "bg-red-100 text-red-800"
                                }`}
                                >
                                {inv.status}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                {inv.created_at}
                            </td>
                            <td className="px-4 py-2 text-center">
                                <button
                                    className="p-2 rounded-full hover:bg-gray-100 text-foreground transition"
                                    onClick={() => console.log("Ver detalles:", inv)}
                                    >
                                    <Eye size={18} />
                                </button>
                                <button
                                    className="p-2 rounded-full cursor-pointer hover:bg-amber-200 font-semibold text-foreground transition"
                                    onClick={() => setPrintInvoice(inv)}
                                    >
                                    <Printer size={18} />
                                </button>
                            </td>
                            </tr>
                        ))}
                        </>

                    )}
                    </tbody>
                </table>
            </div>
            {/* 🚨 CAMBIO 6: Implementación de los controles de paginación */}
            <div className="flex justify-between w-full items-center mt-6">
                <button 
                    className="bg-foreground text-amber-100 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#6c1414] transition"
                    onClick={handlePrevPage}
                    disabled={page === 1 || isLoading} // Deshabilitar si es la primera página
                >
                    <ChevronLeft size={20} />
                    Anterior
                </button>
                <section className="text-gray-700 font-medium">
                    <p>Página {page} de {isLoading ? 1 : totalPages}</p>
                </section>
                <button 
                    className="bg-foreground text-amber-100 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#6c1414] transition"
                    onClick={handleNextPage}
                    disabled={page >= totalPages || isLoading} // Deshabilitar si es la última página
                >
                    Siguiente
                    <ChevronRight size={20} />
                </button>
            </div>
        </>
    )
}