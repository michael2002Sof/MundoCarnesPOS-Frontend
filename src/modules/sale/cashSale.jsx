import { useState, useMemo, useEffect } from "react"
import { Barcode, Loader2, ShoppingCart, Trash2} from "lucide-react"

import { GetAllSalesPoint } from "../../hooks/sales"
import { GetAllProducts } from "../../hooks/products"
import OpenCloseCash from "./cash sale/OpenCloseCash"
import DecodeToken from "../../api/decode"
import ClientSearch from "./cash sale/ClientSearch"
import usePersistentResponse from "../../utils/response_message"
import handleInputChange from "../../utils/handleInputChange"
import axiosInstance from "../../api/axiosintance"
import { formatDecimal } from "../../utils/formatData"
import InvoiceModal from "../../components/shared/invoiceModal"
import toast from "react-hot-toast"


export default function CashSale() {
    /*================================================================
      LLAMADA DE DATOS DEL SISTEMA
    ===================================================================*/
    const { products, FetchProducts } = GetAllProducts()
    const {salesPoints, FetchSalesPoints} = GetAllSalesPoint()         
    const token = DecodeToken()     
    const sp = salesPoints?.find(sp => sp.id_user === token.id ) //Punto de venta del usuario
    const user = token?.id
    /*=======================================================================
      PROCESOS PARA EL REGISTRO DE VENTA DE PRODUCTOS 
    =========================================================================*/

    // Estado inicial
    const [tabs, setTabs] = useState([{ id: Date.now(), name: "Venta 1", cart: [], client: null }])

    const [activeTabId, setActiveTabId] = useState(tabs[0].id) //Pestaña activa

    const [barcode, setBarcode] = useState("") // Codigo escaneado
    const [isSelectedClient, setSelectedClient] = useState(null); // cliente elegido

    // Añadir / Eliminar pestañas
    const addTab = () => {
        const newTab = { id: Date.now(), name: `Venta ${tabs.length + 1}`, cart: [], client: null };
        setTabs((prev) => [...prev, newTab]);
        setActiveTabId(newTab.id);
    };

    const closeTab = (id) => {
        if (tabs.length === 1) return; // siempre una pestaña
        setTabs((prev) => {
        const newTabs = prev.filter((t) => t.id !== id);
        setActiveTabId(newTabs[0].id)
        return newTabs;
        });
    };

    // Utils: actualizar pestaña
    const updateActiveTab = (updater) => {
        setTabs((prev) => prev.map((t) => (t.id === activeTabId ? updater(t) : t)));
    };
    // Por si necesitas eliminar un item del carrito
    const removeItem = (index) => {
        updateActiveTab((tab) => ({ ...tab, cart: tab.cart.filter((_, i) => i !== index) }));
    };

        // Decodificar bascula
    const decodeScaleBarcode = (code) => {
        const productCode = code.slice(2, 7);
        const weightDigits = code.slice(7, 12); // ejemplo: 00655 -> 0.655 kg
        const weight = parseInt(weightDigits, 10) / 1000;

        const product = products?.find((p) => String(p.barcode) === String(productCode))
        if (!product) return null;

        const subtotal = Number(product.base_price) * weight;

        const isTax0 = Number(product.tax0) === 1;
        const hasTax5 = Number(product.tax5) > 0;
        const hasTax19 = Number(product.tax19) > 0;

        let tax5 = 0;
        let tax19 = 0;

        if (hasTax5) tax5 = subtotal * 0.05;
        if (hasTax19) tax19 = subtotal * 0.19;

        const total = subtotal + tax5 + tax19;

        return {
        barcode: productCode,
        name: product.name,
        subtotal:subtotal,
        tax0: isTax0,
        tax5,
        tax19,
        total: total,
        isScale: true,
        quantity: weight,
        };
    };

    // Decodificar normal
    const decodeNormalBarcode = (code) => {
        const product = products?.find((p) => String(p.barcode) === String(code))
        if (!product) return null;
        return {
            barcode: product.barcode,
            name: product.name,    
            subtotal:Number(product.base_price),
            tax0: product.tax0 === 1 ? true : false,
            tax5: Number(product.tax5),
            tax19: Number(product.tax19),
            total: Number(product.sale_price),
            isScale: false,
            quantity: 1,
            unit_mesurement: product.unit_mesurement,
        };
    };

    // Manejar escaneo
    const handleScan = (e) => {
        e.preventDefault();
        if (!barcode) return;
        const prefix = parseInt(barcode.slice(0, 2), 10);
        let product 
        if (barcode.length < 12 && prefix < 20 || prefix > 29) {
            product = decodeNormalBarcode(barcode)
        } else {
            product = decodeScaleBarcode(barcode) 
        }

        console.log(product)

        if (!product) {
            toast.error("Producto no existe")
            setBarcode("");
            return;
        }

        updateActiveTab((tab) => {
        // si es bascula => agregar siempre como item independiente (no sumar cantidades)
        if (product.isScale) {
            return { ...tab, cart: [...tab.cart, product] };
        }

        // para normal => si existe en carrito sumar cantidad
        const existingIndex = tab.cart.findIndex((it) => String(it.barcode) === String(product.barcode));
        if (existingIndex === -1) {
            return { ...tab, cart: [...tab.cart, product] };
        } else {
            const newCart = [...tab.cart];
            const found = { ...newCart[existingIndex] };
            found.quantity = (found.quantity || 1) + 1;
            found.subtotal = Math.round(found.price * found.quantity);
            found.iva5 = (Number(found.tax5) || 0) * found.quantity; // si tu iva es por unidad ajustar según lógica
            found.iva19 = (Number(found.tax19) || 0) * found.quantity;
            found.total = Math.round(found.subtotal + (found.iva5 || 0) + (found.iva19 || 0) + (found.iva0 || 0));
            newCart[existingIndex] = found;
            return { ...tab, cart: newCart };
        }
        });

        setBarcode("");
    };

    /*=======================================================================
      PROCESOS PARA CALCULAR EL RESUMEN DE VENTA 
    =========================================================================*/
    // Totales del tab activo
    const activeTab = useMemo(() => tabs.find((t) => t.id === activeTabId) || tabs[0], [tabs, activeTabId]);
    const subtotal = (activeTab?.cart || []).reduce((s, it) => s + (Number(it.subtotal || 0)), 0);
    const tax5Total = (activeTab?.cart || []).reduce((s, it) => s + Number(it.tax5 || 0), 0);
    const tax19Total = (activeTab?.cart || []).reduce((s, it) => s + Number(it.tax19 || 0), 0);
    const total = subtotal + tax5Total + tax19Total;

    const [isPayment, setPayment] = useState({method: "cash", receipt: "", repay: 0})// Metodo de pago
    useEffect(() => {
        setPayment((prev) => ({
            ...prev,
            receipt: prev.method === "transfer" && total,
            repay: Math.max(0, prev.receipt - total),
        }));
    }, [isPayment.method, total]);
   
    /*=======================================================================
      PROCESOS PARA IMPRIMIR FACTURA Y REGISTAR VENTA
    =========================================================================*/
    const [showInvoice, setShowInvoice] = useState(false);
    const [isInvoicePrinting, setIsInvoicePrinting] = useState(false);
    const [isLoaging, setIsLoading] = useState(false);

    // Confirmar pago: registrar venta + descontar stock + imprimir factura + limpiar carrito
    const handleConfirmPayment = async () => {
        if (isPayment.method === "cash" && isPayment.receipt < total) {
            alert("El monto recibido es menor al total");
            return;
        }
        setIsLoading(true);
        

        // 1️⃣ Crear la parte base de la factura
        const invoiceData = {
        company: token?.company,
        sales_point: sp?.id,
        cash_session: localStorage.getItem("SessionCashID"), // ID de caja abierta
        seller: user,
        customer: isSelectedClient?.id || null,
        subtotal,
        tax0: 0,
        tax5: tax5Total,
        tax19: tax19Total,
        total,
        payment_method: isPayment.method,
        receipt: Number(isPayment.receipt),
        repay: Number(isPayment.repay),
        };

        // 2️⃣ Crear los ítems
        const itemsPayload = (activeTab?.cart || []).map((it) => ({
            product_id: it.id,
            product_name: it.name,
            product_barcode: it.barcode,
            quantity: it.quantity || 1,
            unit_price: it.subtotal,
            tax0: it.tax0,
            tax5: it.tax5,
            tax19: it.tax19,
            total: it.total,
        }));

        // 3️⃣ Combinar todo correctamente
        const data = {
            ...invoiceData,
            invoiceItem: itemsPayload,
        };

        console.log("📦 Data final enviada:", data);

        try {
            const res = await axiosInstance.post("/posinnovate/app/sale/cash/invoice", data);

            // 🧾 Guardar datos y disparar impresión
            setIsInvoicePrinting(res.invoice);
            console.log(res)


            // ✅ Limpiar carrito y cliente
            setTabs((prev) =>
                prev.map((t) =>
                t.id === activeTabId ? { ...t, cart: [], client: null } : t
                )
            );

            FetchProducts?.();
            usePersistentResponse({
                message: "Venta registrada e inventario actualizado correctamente.",
                success: true,
            });
        } catch (error) {
            console.error(error);
            usePersistentResponse({
                message: "Error al registrar la venta o actualizar el inventario.",
                success: false,
            });
        } finally {
            setIsLoading(false);
            setShowInvoice(true);
        }
    };

    // Detectar los IVAs activos antes del render
    const showIVA0 = activeTab.cart.some(it => it.tax0 === true);
    const showIVA5 = activeTab.cart.some(it => it.tax5 > 0);
    const showIVA19 = activeTab.cart.some(it => it.tax19 > 0);


    return (
        <>
            <OpenCloseCash sp={sp} user={user} FetchSalesPoints={FetchSalesPoints}/>
            {/*================================================================
                VISTA DE REGISTRO DE PRODUCTO A LA VENTA
            ===================================================================*/}
                {/* Pestañas */}
                <div className="flex gap-2">
                    <div className={`px-3 py-2 rounded ${tabs[0].id === activeTabId ? "bg-[#841A1A] text-amber-100" : "bg-amber-200 text-[#841A1A]"}`}>
                        <button onClick={() => setActiveTabId(tabs[0].id)}>{tabs[0].name}</button>
                    </div>
                    {tabs.slice(1).map((t) => (
                    <div key={t.id} className={`px-3 py-2 rounded ${t.id === activeTabId ? "bg-[#841A1A] text-amber-100" : "bg-amber-200 text-[#841A1A]"}`}>
                        <button onClick={() => setActiveTabId(t.id)}>{t.name}</button>
                        <button onClick={() => closeTab(t.id)} className="ml-2 text-sm">x</button>
                    </div>
                    ))}
                    <button onClick={addTab} className="px-3 py-2 bg-green-500 text-white rounded">+ Nueva</button>
                </div>
                <div className="flex gap-6  container mx-auto max-w-7xl">
                    {/*============================================================
                     COLUMNA DE ESCANEO Y CARRITO
                    ==============================================================*/}
                    <div className="space-y-4 w-2/3">
                    <section className="p-4 bg-[#841A1A] text-amber-100 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                        <Barcode /><h3 className="text-lg font-bold">Escáner</h3>
                        </div>
                        <form onSubmit={handleScan} className="flex gap-2">
                            <input value={barcode} onChange={(e) => setBarcode(e.target.value)} className="flex-1 p-2 rounded bg-[#6E1515]" placeholder="Escanea o escribe código" autoFocus />
                        </form>
                    </section>

                    <section className="p-4 bg-[#841A1A] text-amber-100 rounded-xl">
                        <h4 className="font-semibold mb-2 flex items-center">
                            {tabs.length !== 0 && (
                                <p>
                                    Carrito de  {tabs.find((t) => t.id === activeTabId)?.name}: 
                                </p>
                            )}             
                        </h4>
                        {activeTab.cart.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShoppingCart className="mx-auto mb-2" />
                            <p>No hay productos</p>
                        </div>
                        ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                            <thead className="bg-amber-200 text-[#841A1A]">
                                <tr className="border-b text-nowrap">
                                <th className="text-center px-4 py-2">Producto</th>
                                <th className="text-center px-4 border-l">Cant / Peso</th>
                                <th className="text-center px-4  border-l">V.Unit</th>
                                {showIVA0 && <th className="text-center px-4 border-l">IVA 0%</th>}
                                {showIVA5 && <th className="text-center px-4  border-l">IVA 5%</th>}
                                {showIVA19 && <th className="text-center px-4  border-l">IVA 19%</th>}
                                <th className="text-center px-4  border-l">Total</th>
                                <th className="text-center px-4 border-l">Acc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab.cart.map((it, idx) => (
                                <tr key={idx} className="text-nowrap">
                                    <td className="px-4">{it.name}</td>
                                    <td className="px-4 text-center py-2">{it.quantity} {it.unit_mesurement}</td>
                                    <td className="px-4 text-center py-2">{formatDecimal(it.subtotal, true)}</td>
                                    {showIVA0 && (
                                    <td className="px-4 text-center py-2">
                                        {it.tax0 ? "$ 0" : "-"}
                                    </td>
                                    )}
                                    {showIVA5 && (
                                    <td className="px-4 text-center py-2">
                                        {it.tax5 > 0 ? formatDecimal(it.tax5, true) : "-"}
                                    </td>
                                    )}
                                    {showIVA19 && (
                                    <td className="py-2 px-4 text-center">
                                        {it.tax19 > 0 ? formatDecimal(it.tax19, true) : "-"}
                                    </td>
                                    )}
                                    <td className="px-4 text-center py-2">{formatDecimal(it.total, true)}</td>
                                    <td className="px-4 flex items-center justify-center py-2"><button onClick={() => removeItem(idx)} className="text-amber-200 cursor-pointer"><Trash2 size={16} /></button></td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        )}
                    </section>
                    </div>

                    {/*============================================================
                     RESUMEN DE VENTA Y FACUTRACION 
                    ==============================================================*/}
                    <div className="p-4 bg-[#841A1A] text-amber-100 space-y-4 rounded-xl w-1/3">
                    <h4 className="font-bold">Resumen</h4>
                    <div className="text-right">
                        <div className="flex justify-between"><span>Subtotal:</span><span>{formatDecimal(subtotal, true)}</span></div>
                        {showIVA0 && (
                            <div className="flex justify-between">IVA 0%: <span>$0</span></div>
                        )}
                        {activeTab.cart.some(it => it.tax5 > 0) && (
                            <div className="flex justify-between">IVA 5%: <span>{formatDecimal(tax5Total, true)}</span></div>
                        )}
                        {activeTab.cart.some(it => it.tax19 > 0) && (
                            <div className="flex justify-between">IVA 19%: <span>{formatDecimal(tax19Total, true)}</span></div>
                        )}
                        <div className="flex justify-between font-bold mt-2"><span>Total:</span><span>{formatDecimal(total, true)}</span></div>
                    </div>

                    <ClientSearch   isSelectedClient={isSelectedClient} setSelectedClient={setSelectedClient}/>
                    {activeTab.client && (<div className="mt-2 p-2 bg-amber-200 text-[#841A1A] rounded">{activeTab.client.name} — {activeTab.client.document}</div>)}

                    <section className="flex items-center gap-2 w-full">
                        {/* Método de pago */}
                        <div className={`${isPayment.method === "cash" ? "w-1/3" : "w-1/2"}`}>
                            <label className="font-semibold mb-1 text-sm text-nowrap">Método de Pago:</label>
                            <select
                            value={isPayment.method}
                            onChange={(e) => handleInputChange(setPayment, "method", e.target.value)}
                            className="w-full p-2 rounded cursor-pointer bg-[#6E1515] outline-none text-white"
                            >
                            <option value="cash">Efectivo</option>
                            <option value="transfer">Bancolombia</option>
                            </select>
                        </div>

                        {/* Recibido */}
                        <div className={`${isPayment.method === "cash" ? "w-1/3" : "w-1/2"}`}>
                            <label className="font-semibold mb-1 text-sm">Recibido:</label>
                            <input
                            type="number"
                            value={isPayment.receipt}
                            disabled={isPayment.method !== "cash"}
                            onChange={(e) =>
                                handleInputChange(setPayment, "receipt", Number(e.target.value))
                            }
                            className={`bg-[#6E1515] w-full px-2 py-1 outline-none text-white ${
                                isPayment.method !== "cash" ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            />
                        </div>

                        {/* Devuelta */}
                        {isPayment.method === "cash" && (
                            <div className="w-1/3">
                            <label className="font-semibold mb-1 text-sm">Devuelta:</label>
                            <input
                                type="number"
                                value={Math.max(0, isPayment.receipt - total)}
                                readOnly
                                className="bg-[#6E1515] outline-none w-full px-2 py-1 text-white"
                            />
                            </div>
                        )}
                    </section>


                    <button onClick={() => handleConfirmPayment()} disabled={activeTab.cart.length === 0} className="mt-4 bg-amber-200 text-[#841A1A] p-2 rounded font-semibold w-full">
                        {isLoaging ? 
                            <div className="flex justify-center items-center gap-2">
                                <Loader2 className="animate-spin mr-2 inline-block" />
                                <p>Procesando...</p>
                            </div> 
                        : 
                            <div>Confirmar Pago</div>
                        }
                    </button>
                  </div>
                </div>
            {showInvoice && (
                <div className=" fixed inset-0 py-12 bg-black/70 flex justify-center items-center p-4 z-50">
                    <InvoiceModal setShowInvoice={setShowInvoice}  invoice={isInvoicePrinting}/>
                </div>
            )}
        </>
    )
}