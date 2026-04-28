import { useEffect, useState } from "react";
import { Loader, Eye, Printer, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment-timezone";
import clsx from "clsx";

import {ModulesHeader} from "../../components/shared/headers"
import  {formatDecimal} from "../../utils/formatData"
import useReport from "../../hooks/sale/useReport";

import { exportToExcel } from "../../utils/useExportXlsx";
import DecodeToken from "../../api/decode";
import useMovement from "../../hooks/inventory/useMovement";

export default function Movement () {
    const {isLoading, movements, movementProducts, pages, FetchMovement, FetchMovementProduct} = useMovement();
    const token = DecodeToken()
    console.log(movements)

    const today = moment().tz("America/Bogota").format("YYYY-MM-DD");
    const [isDate, setDate] = useState(today);
    const [isPrintInvoice, setPrintInvoice] = useState(null);
    const [page, setPage] = useState(1);
    const [selectedMovement, setSelectedMovement] = useState(null);
    const [activeTab, setActiveTab] = useState("movement")

    useEffect(() => {
        if (activeTab === "movement") {
            FetchMovement({page, from: isDate});
        } else if (activeTab === "product") {
            FetchMovementProduct({page, from: isDate})
        }
    }, [isDate, page, activeTab]);

    const handlePrevPage = () => {
        setPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setPage(prev => Math.min(pages, prev + 1));
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
                        </div>
                    </section>
                </div>

                <section className="flex items-center mt-4">
                    <button 
                    onClick={() => setActiveTab("movement")}
                    className={clsx(
                        "font-semibold px-4 py-2 cursor-pointer transition-colors duration-300",
                        activeTab === "movement" && "bg-foreground text-amber-100"
                    )}>
                        Por Movimiento
                    </button>
                    <button 
                    onClick={() => setActiveTab("product")}
                    className={clsx(
                        "font-semibold px-4 py-2 cursor-pointer transition-colors duration-300",
                        activeTab === "product" && "bg-foreground text-amber-100"
                    )}>
                        Por Producto
                    </button>
                </section>

                <div className="overflow-x-auto mt-6">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-[#841A1A] text-white uppercase text-xs">
                        {activeTab === "movement" ? (
                            <tr>
                                <th className="px-4 py-3">Factura</th>
                                <th className="px-4 py-3">Vendedor</th>
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3 rounded-tr-lg text-center">Acciones</th>
                            </tr>
                        ) : (
                            <tr>
                                <th className="px-4 py-3">Producto</th>
                                <th className="px-4 py-3">Bodega</th>
                                <th className="px-4 py-3">Invetario inicial</th>
                                <th className="px-4 py-3">Entradas</th>
                                <th className="px-4 py-3">Salidas</th>
                                <th className="px-4 py-3">Invetario Final</th>
                                <th className="px-4 py-3">Fecha</th>
                            </tr>
                        )}
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
                        ): activeTab === "movement" ? (
                            movements?.map((inv, idx) => (
                                <tr
                                key={idx}
                                className={`border-b hover:bg-gray-50 transition ${
                                    idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                                }`}
                                >
                                <td className="px-4 py-2 text-gray-700">{inv.code}</td>
                                <td className="px-4 py-2">{inv.seller || "—"}</td>
                                <td className="px-4 py-2">{inv.customer || "—"}</td>
                                <td className="px-4 py-2">
                                    {inv.created_at}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-100 text-[#841A1A] transition"
                                        onClick={() => setSelectedMovement(inv)}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                                </tr>
                            ))
                        ) : (
                            movementProducts?.map((inv, idx) => (
                                <tr
                                key={idx}
                                className={`border-b hover:bg-gray-50 transition ${
                                    idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                                }`}
                                >
                                <td className="px-4 py-2 text-gray-700">{inv.name}</td>
                                <td className="px-4 py-2">{inv.warehouse || "—"}</td>
                                <td className="px-4 py-2">{Number(inv.start) || "—"}</td>
                                <td className="px-4 py-2">{Number(inv.entries)}</td>
                                <td className="px-4 py-2">{Number(inv.exits)}</td>
                                <td className="px-4 py-2">{Number(inv.end)}</td>
                                <td className="px-4 py-2">{moment(inv.date).format("YYYY-MM-DD")}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

               {/* 🚨 CAMBIO 6: Implementación de los controles de paginación */}
                <div className="flex justify-between items-center mt-6">
                    <button 
                        className="bg-[#841A1A] text-amber-100 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#6c1414] transition"
                        onClick={handlePrevPage}
                        disabled={page === 1 || isLoading} // Deshabilitar si es la primera página
                    >
                        <ChevronLeft size={20} />
                        Anterior
                    </button>
                    <section className="text-gray-700 font-medium">
                        <p>Página {page} de {isLoading ? 1 : pages}</p>
                    </section>
                    <button 
                        className="bg-[#841A1A] text-amber-100 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#6c1414] transition"
                        onClick={handleNextPage}
                        disabled={page >= pages || isLoading} // Deshabilitar si es la última página
                    >
                        Siguiente
                        <ChevronRight size={20} />
                    </button>
                </div>
            </section>

            {selectedMovement && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#841A1A]">
                                Factura {selectedMovement.code}
                            </h2>

                            <button
                                className="text-gray-500 hover:text-red-600"
                                onClick={() => setSelectedMovement(null)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Info general */}
                        <div className="text-sm text-gray-600 mb-4 space-y-1">
                            <p><b>Cliente:</b> {selectedMovement.customer}</p>
                            <p><b>Vendedor:</b> {selectedMovement.seller}</p>
                            <p><b>Fecha:</b> {selectedMovement.created_at}</p>
                        </div>

                        {/* Items */}
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left p-2">Producto</th>
                                        <th className="text-center p-2">Código</th>
                                        <th className="text-center p-2">Cantidad</th>
                                        <th className="text-center p-2">DIAN</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedMovement.items.map((item, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="p-2">{item.name}</td>
                                            <td className="text-center">{item.code}</td>
                                            <td className="text-center">-{item.quantity}</td>
                                            <td className="text-center">
                                                {item.dian ? "Sí" : "No"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                onClick={() => setSelectedMovement(null)}
                            >
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}