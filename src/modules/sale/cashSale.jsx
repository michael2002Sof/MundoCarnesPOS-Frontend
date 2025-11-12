import { useState, useRef, useMemo, useEffect } from "react"
import { useReactToPrint } from "react-to-print"
import { Barcode, Loader2, ShoppingCart, X} from "lucide-react"

import { GetAllSalesPoint } from "../../hooks/sales"
import { GetAllProducts } from "../../hooks/products"
import OpenCloseCash from "./cash sale/OpenCloseCash"
import DecodeToken from "../../api/decode"
import ClientSearch from "./cash sale/ClientSearch"
import PrintableInvoice from "../../components/shared/PrintableInvoice"
import usePersistentResponse from "../../utils/response_message"
import handleInputChange from "../../utils/handleInputChange"
import axiosInstance from "../../api/axiosintance"
import { formatDecimal } from "../../utils/formatData"


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
    const [tabs, setTabs] = useState([{ id: Date.now(), name: "Venta 1", cart: [], client: null }]);
    const [activeTabId, setActiveTabId] = useState(tabs[0].id);
    const [barcode, setBarcode] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [responseMessage] = useState(null);
    const [printInvoiceData, setPrintInvoiceData] = useState(null);
    const [isSelectedClient, setSelectedClient] = useState(null); // cliente elegido

    // Helpers: detectar codigo de bascula
    const isScaleCode = (code = "") => {
        if (!code || code.length < 12) return false;
        const prefix = parseInt(code.slice(0, 2), 10);
        return prefix >= 20 && prefix <= 29;
    };

        // Decodificar bascula
    const decodeScaleBarcode = (code) => {
        // prefijo 2 digitos, productCode 5 digitos, peso 5 digitos
        const productCode = code.slice(2, 7);
        const weightDigits = code.slice(7, 12); // ejemplo: 00655 -> 0.655 kg
        const weight = parseInt(weightDigits, 10) / 1000;
        const product = products?.find((p) => String(p.barcode) === String(productCode))
        if (!product) return null;
        console.log("Producto de bascula encontrado:", product);
        const subtotal = Number(product.base_price) * weight;

        return {
        ...product,
        weight: Number(weight.toFixed(3)),
        subtotal:subtotal,
        total: subtotal + (Number(product.tax5) || 0) + (Number(product.tax19) || 0) ,
        isScale: true,
        quantity: 1,
        };
    };

    // Decodificar normal
    const decodeNormalBarcode = (code) => {
        const product = products?.find((p) => String(p.barcode) === String(code))
        if (!product) return null;
        return {
        ...product,
        subtotal:Number(product.base_price),
        total: Number(product.sale_price),
        isScale: false,
        quantity: 1,
        };
    };

    // Manejar escaneo
    const handleScan = (e) => {
        e.preventDefault();
        const code = String(barcode).trim();
        if (!code) return;

        const isScale = isScaleCode(code);
        const decoded = isScale ? decodeScaleBarcode(code) : decodeNormalBarcode(code);

        if (!decoded) {
        usePersistentResponse({ message: "Producto no existe", success: false });
        setBarcode("");
        return;
        }

        updateActiveTab((tab) => {
        // si es bascula => agregar siempre como item independiente (no sumar cantidades)
        if (decoded.isScale) {
            return { ...tab, cart: [...tab.cart, decoded] };
        }

        // para normal => si existe en carrito sumar cantidad
        const existingIndex = tab.cart.findIndex((it) => String(it.barcode || it.code) === String(decoded.barcode || decoded.code));
        if (existingIndex === -1) {
            return { ...tab, cart: [...tab.cart, decoded] };
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
      PROCESOS PARA MANEJO DE PESTAÑAS DE VENTA 
    =========================================================================*/
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
        if (id === activeTabId) setActiveTabId(newTabs[0].id);
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


    /*=======================================================================
      PROCESOS PARA CALCULAR EL RESUMEN DE VENTA 
    =========================================================================*/
    // Totales del tab activo
    const activeTab = useMemo(() => tabs.find((t) => t.id === activeTabId) || tabs[0], [tabs, activeTabId]);
    console.log("Carrito activo:", activeTab.cart);
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
      GENERAR VENTA Y REGISTRARLA EN EL SISTEMA 
    =========================================================================*/
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
            quantity: it.isScale ? it.weight : it.quantity || 1,
            unit_price: Number(it.price || it.base_price || 0),
            tax0: Number(it.tax0 || 0),
            tax5: Number(it.tax5 || 0),
            tax19: Number(it.tax19 || 0),
            total: Number(it.total || it.subtotal || 0),
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
            setPrintInvoiceData(res.invoice);
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

        }
    };


    /*=======================================================================
      PROCESOS PARA IMPRIMIR FACTURA 
    =========================================================================*/
    const printRef = useRef()
    const handlePrint = useReactToPrint({ contentRef: printRef })

    useEffect(() => {
        if (printInvoiceData) {
            handlePrint();
            console.log(printInvoiceData)
        }
    }, [printInvoiceData])

 

    return (
        <>
            <OpenCloseCash sp={sp} user={user} FetchSalesPoints={FetchSalesPoints}/>
            {/*================================================================
                VISTA DE REGISTRO DE PRODUCTO A LA VENTA
            ===================================================================*/}
                     {/* Pestañas */}
                <div className="flex gap-2">
                    {tabs.map((t) => (
                    <div key={t.id} className={`px-3 py-2 rounded ${t.id === activeTabId ? "bg-[#841A1A] text-amber-100" : "bg-amber-200 text-[#841A1A]"}`}>
                        <button onClick={() => setActiveTabId(t.id)}>{t.name}</button>
                        <button onClick={() => closeTab(t.id)} className="ml-2 text-sm">x</button>
                    </div>
                    ))}
                    <button onClick={addTab} className="px-3 py-2 bg-green-500 text-white rounded">+ Nueva</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Columna de escaneo y carrito */}
                    <div className="space-y-4">
                    <section className="p-4 bg-[#841A1A] text-amber-100 rounded">
                        <div className="flex items-center gap-3 mb-3">
                        <Barcode /><h3 className="text-lg font-bold">Escáner</h3>
                        </div>
                        <form onSubmit={handleScan} className="flex gap-2">
                            <input value={barcode} onChange={(e) => setBarcode(e.target.value)} className="flex-1 p-2 rounded bg-[#6E1515]" placeholder="Escanea o escribe código" autoFocus />
                        </form>
                    </section>

                    <section className="p-4 bg-[#841A1A] text-amber-100 rounded">
                        <h4 className="font-semibold mb-2">Carrito ( {activeTab.cart.length} )</h4>
                        {activeTab.cart.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShoppingCart className="mx-auto mb-2" />
                            <p>No hay productos</p>
                        </div>
                        ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                            <thead>
                                <tr>
                                <th className="text-left">Producto</th>
                                <th className="text-right">Cant / Peso</th>
                                <th className="text-right">V.Unit</th>
                                {activeTab.cart.map((it, idx) => (
                                    <>
                                    {it.tax0 === 1 && (  <th key={idx} className="text-right font-semibold">IVA 0%</th> )}
                                    </>
                                ))}
                                {activeTab.cart.map((it, idx) => (
                                    <>
                                    {it.tax5 > 0 && (  <th key={idx} className="text-right font-semibold">IVA 5%</th> )}
                                    </>
                                ))}
                                 {activeTab.cart.map((it, idx) => (
                                    <>
                                    {it.tax19 > 0 && (  <th key={idx} className="text-right font-semibold">IVA 19%</th> )}
                                    </>
                                ))}
                                <th className="text-right">Total</th>
                                <th>Acc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab.cart.map((it, idx) => (
                                <tr key={idx}>
                                    <td className="p-2">{it.name}</td>
                                    <td className="p-2 text-right">{it.isScale ? `${it.weight} kg` : (it.quantity ?? 1)}</td>
                                    <td className="p-2 text-right">{formatDecimal(it.subtotal, true)}</td>
                                    {it.tax0 === 1 && (  <td className="p-2 text-right">$ 0</td> )}
                                    {it.tax5 > 0 && (  <td className="p-2 text-right">{formatDecimal(it.tax5, true)}</td> )}
                                    {it.tax19 > 0 && (  <td className="p-2 text-right">{formatDecimal(it.tax19, true)}</td> )}
                                    <td className="p-2 text-right">{formatDecimal(it.total, true)}</td>
                                    <td className="p-2 text-center"><button onClick={() => removeItem(idx)} className="text-red-500"><X size={16} /></button></td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        )}
                    </section>
                    </div>

                    {/* Resumen y pago */}
                    <div className="p-4 bg-[#841A1A] text-amber-100 space-y-4 rounded-xl">
                    <h4 className="font-bold">Resumen</h4>
                    <div className="text-right">
                        <div className="flex justify-between"><span>Subtotal:</span><span>{subtotal.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span></div>
                        {activeTab.cart.some(it => Number(it.tax0) === 1) && (
                            <div className="flex justify-between">IVA 0%: <span>$0</span></div>
                        )}
                        {activeTab.cart.some(it => Number(it.tax5) > 0) && (
                            <div className="flex justify-between">IVA 5%: <span>{tax5Total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span></div>
                        )}
                        {activeTab.cart.some(it => Number(it.tax19) > 0) && (
                            <div className="flex justify-between">IVA 19%: <span>{tax19Total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span></div>
                        )}
                        <div className="flex justify-between font-bold mt-2"><span>Total:</span><span>{total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span></div>
                    </div>

                    <ClientSearch   isSelectedClient={isSelectedClient} setSelectedClient={setSelectedClient}/>
                    {activeTab.client && (<div className="mt-2 p-2 bg-amber-200 text-[#841A1A] rounded">{activeTab.client.name} — {activeTab.client.document}</div>)}

                    <section className="flex items-center gap-2 w-full">
                        {/* Método de pago */}
                        <div className={`${isPayment.method === "cash" ? "w-1/3" : "w-1/2"}`}>
                            <label className="font-semibold mb-1 text-sm">Método de Pago:</label>
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

        

                {/* Componente oculto para impresión */}
                <div style={{ display: "none" }}>
                  <div ref={printRef}>
                    <PrintableInvoice invoice={printInvoiceData} />
                  </div>
                </div>


        </>
    )
}