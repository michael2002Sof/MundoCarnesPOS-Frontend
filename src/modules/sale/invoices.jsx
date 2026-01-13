import { useEffect, useState } from "react";
import { Loader, Eye, Printer, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment-timezone";

import {ModulesHeader} from "../../components/shared/headers"
import  {formatDecimal} from "../../utils/formatData"
import useReport from "../../hooks/sale/useReport";

import { exportToExcel } from "../../utils/useExportXlsx";
import DecodeToken from "../../api/decode";
import useUser from "../../hooks/user/useUser";
import InvoicePrinter from "../../components/shared/invoiceQzTry";
import InvoiceModal from "../../components/shared/invoiceModal"

export default function Invoices () {
    const {isLoading, invoices, totalPages, totalCount, GET_InvoicesByDate, GET_InvoicesToExport} = useReport();
    const token = DecodeToken()
    const {usersPOS} = useUser()

    const today = moment().tz("America/Bogota").format("YYYY-MM-DD");
    const [isDate, setDate] = useState(today);
    const [isUser, setUser] = useState(token?.id)
    const [isPrintInvoice, setPrintInvoice] = useState(null);
    const [localPage, setLocalPage] = useState(1);
    const [exporting, setExporting] = useState(false)

    useEffect(() => {
        GET_InvoicesByDate(isDate, isUser, localPage);
    }, [isDate, isUser, localPage]);

    const handleExport = async () => {
        setExporting(true)
        const invoicesExport = await GET_InvoicesToExport(isDate, isUser)
        exportToExcel(invoicesExport, `Facturas_${isDate}`)
        setExporting(false)
    }

    const handlePrevPage = () => {
        setLocalPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setLocalPage(prev => Math.min(totalPages, prev + 1));
    };

    return (
        <>
            <ModulesHeader 
                module={"Facturas de Ventas"} 
                description={"Consulta las factura por fecha y imprime recibos si lo requieres"}
            />
            <section className=" container mx-auto max-w-7xl 2xl:max-w-[90%]">
                {/* Filtro de fecha */}
                <div className="bg-[#841A1A] text-amber-100 w-full rounded-lg shadow p-6 ">
                    <h1 className="text-lg font-semibold">Búsqueda por Fecha</h1>
                    <p className="text-xs">Selecciona la fecha de la factura a buscar</p>
                    <section className="flex items-center justify-between gap-4">
                        <div className="gap-4 flex items-center">
                        <input
                        type="date"
                        className="px-4 py-2 rounded-lg mt-4 border-b focus:outline-none cursor-pointer"
                        value={isDate}
                        onChange={(e) => setDate(e.target.value)}
                        />
                        {token?.rol === "admin" && (
                            <select 
                                type="text" 
                                className="px-4 py-2 rounded-lg mt-4 border-b focus:outline-none cursor-pointer"
                                value={isUser}
                                onChange={(e) => setUser(e.target.value)}
                            >
                            <option value={token?.id}>Todas</option>
                            {usersPOS?.map(u => (
                                <option value={u.id}>{u.name}</option>
                            ))}
                        </select>
                        )}
                        </div>
                        {token?.rol === "admin" && (
                            <button
                                className="bg-amber-100 mt-3 cursor-pointer text-[#841A1A] px-4 py-2 rounded-lg font-bold flex items-center h-fit gap-2 hover:bg-amber-200 transition"
                                onClick={handleExport} // Llamada a la función
                                disabled={isLoading || !invoices?.length}
                            >
                                {exporting ? (
                                    <div className=" flex items-center justify-center gap-2">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Cargando Facturas...
                                    </div>
                                ) :
                                (
                                    <>
                                        <FileDown size={20} />
                                        Exportar a Excel
                                    </>
                                )}
                            </button>
                        )}
                    </section>
                </div>
                <section className="text-gray-700 font-medium w-full my-2  flex justify-end">
                    <p>Total de facturas: {totalCount}</p>
                </section>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-[#841A1A] text-white uppercase text-xs">
                        <tr>
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
                                        className="p-2 rounded-full hover:bg-gray-100 text-[#841A1A] transition"
                                        onClick={() => console.log("Ver detalles:", inv)}
                                        >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="p-2 rounded-full cursor-pointer hover:bg-amber-200 font-semibold text-[#841A1A] transition"
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
                <div className="flex justify-between items-center mt-6">
                    <button 
                        className="bg-[#841A1A] text-amber-100 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#6c1414] transition"
                        onClick={handlePrevPage}
                        disabled={localPage === 1 || isLoading} // Deshabilitar si es la primera página
                    >
                        <ChevronLeft size={20} />
                        Anterior
                    </button>
                    <section className="text-gray-700 font-medium">
                        <p>Página {localPage} de {isLoading ? 1 : totalPages}</p>
                    </section>
                    <button 
                        className="bg-[#841A1A] text-amber-100 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#6c1414] transition"
                        onClick={handleNextPage}
                        disabled={localPage >= totalPages || isLoading} // Deshabilitar si es la última página
                    >
                        Siguiente
                        <ChevronRight size={20} />
                    </button>
                </div>
            </section>

            {isPrintInvoice &&  <InvoiceModal invoice={isPrintInvoice} onFinish={() => setPrintInvoice(null)}/> }
        </>
    )
}