import { useState, useMemo, useEffect, useRef } from "react"
import { Barcode, Loader, Loader2, ShoppingCart, Trash2} from "lucide-react"

import OpenCloseCash from "./cash sale/OpenCloseCash"
import DecodeToken from "../../api/decode"
import ClientSearch from "./cash sale/ClientSearch"
import useHandleInputChange from "../../utils/useHandleInputChange"
import { formatDecimal } from "../../utils/formatData"
import InvoiceModal from "../../components/shared/invoiceModal"
import InvoicePrinter from "../../components/shared/invoiceQzTry"

import {useDecodeScale, useDecodeNormal} from "./cash sale/useDecodeBarcode"

import useSalePoint from "../../hooks/sale/useSalePoint"
import useProductSiigo from "../../hooks/siigo/useProduct"
import useInvoiceSiigo from "../../hooks/siigo/useInvoice"
import useInvoiceResolution from "../../hooks/sale/useInvoiceResolution"
import { useSessionId } from "../../hooks/sale/useCashSession"
import toast from "react-hot-toast"
import moment from "moment-timezone"




export default function CashSale() {
    /*================================================================
      LLAMADA DE DATOS DEL SISTEMA
    ===================================================================*/
    const {isLoading, POST_InvoiceSiigo} = useInvoiceSiigo()
    const {GET_ProductSiigoByCode} = useProductSiigo()
    const {salePoints, GET_SalePoint} = useSalePoint()      
    const {sessionId, GET_SessionId} = useSessionId() 
    const {invoicesResolution, GET_InvoiceResolution} = useInvoiceResolution()

    const [loadingProduct, setLoadingProduct] = useState(false)
    const inputScannerRef = useRef()
    const cashInputRef = useRef(null); 
    const transferInputRef = useRef(null);
    useEffect(() => {
        const focusInput = (e) => {
            if (!inputScannerRef.current || loadingProduct) return;

            const active = document.activeElement;

            // Si el elemento activo es un input, textarea o select → NO ROBAR FOCO
            const isTypingField =
                ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);

            if (isTypingField) {
                // Solo dejar que tome el foco si ES el input del escáner
                if (active !== inputScannerRef.current) return;
            }

            // Caso contrario → forzar foco al escáner
            inputScannerRef.current.focus();
        };

        // Usar solo keydown de ESCÁNER → evitar uso normal del teclado
        window.addEventListener("keydown", focusInput);

        return () => window.removeEventListener("keydown", focusInput);
    }, [loadingProduct]);
    // ... useEffect para el focus del escáner (existing)

    // 🆕 NUEVO useEffect PARA ATAJOS DE PAGO
    useEffect(() => {
        const handlePaymentShortcuts = (e) => {
            // Asegúrate de que Ctrl (o Cmd en Mac) esté presionado
            if (!e.ctrlKey && !e.metaKey) return; 

            // Determinar a qué input dirigir el foco
            let targetRef = null;

            if (e.key === 'e' || e.key === 'E') {
                targetRef = cashInputRef;
            } else if (e.key === 'b' || e.key === 'B') {
                targetRef = transferInputRef;
            }

            if (targetRef && targetRef.current) {
                e.preventDefault(); // Previene el comportamiento por defecto (ej. buscar en el navegador)
                targetRef.current.focus();
                // Opcional: Seleccionar el texto actual para facilitar la sobreescritura
                targetRef.current.select(); 
            }
        };

        window.addEventListener("keydown", handlePaymentShortcuts);

        return () => window.removeEventListener("keydown", handlePaymentShortcuts);
    }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar

    // ... lógica de cliente, fechas, token



    const [selectedCustomer, setSelectedCustomer] = useState(null); // cliente elegido
    const today = moment().tz("America/Bogota").format("YYYY-MM-DD");
    const token = DecodeToken()     
    const sp = useMemo(() => { return salePoints?.find(sp => sp.user === token.id)}, [salePoints, token?.id])  //Punto de venta del usuario]
    const resolution = invoicesResolution?.find( ir => ir.sale_point === sp?.id)
    //console.log("Resolucion de fatura: ", resolution)
    const wh = sp?.warehouse
    const user = token?.id

    useEffect (() => {
        if(!resolution) {
            GET_InvoiceResolution()
        }
    }, [resolution, invoicesResolution])

    const calledRef = useRef({});
    useEffect(() => {
        if (!sp || sp?.status !== "open") return;

        if (calledRef.current[sp.id]) return; // ya se llamó antes

        calledRef.current[sp?.id] = true;

        GET_SessionId(sp?.id);
    }, [sp]);

    //console.log("Punto de venta:", sp);
    //console.log("Sesión activa:", sessionId);

    async function retrySession() {
        await GET_SessionId(sp?.id)
    }
    async function retryResolution() {
        await GET_InvoiceResolution()
    }

    /*=======================================================================
      ESTRUCURA DE DATOS PARA LA GENERACION DE FACTURA 
    =========================================================================*/
    const initalData = {
        document: { id: ""},
        date: today,
        customer: selectedCustomer,
        cost_center: "",
        stamp: { send: true },
        mail: { send: true},
        observations: "Venta realizada en punto de venta",
        payments: [],
        globaldiscounts: [
            {
                id: "",
                percentage: "",
                value: ""
            }
        ],
        additional_fields: {},

        //Para mi pos
        customerName: "",
        customerCC: "",
        customerAddress: "",
        sale_point: "",
        cash_session: "",
        receipt_cash: 0,
        receipt_transfer: 0,
        total_payment: 0,
        repay: 0,

        subtotal: "",
        tax0: 0,
        tax5: "",
        tax19: "",
        total: ""

    }
    const [isBuildInvoice, setBuildInvoice] = useState(initalData)
 
    /*=======================================================================
      PROCESOS PARA EL REGISTRO DE VENTA DE PRODUCTOS 
    =========================================================================*/
    // Estado inicial
    const initialTabs = () => {
        const savedTabs = localStorage.getItem("cashSaleTabs");
        if (savedTabs) {
            try {
                const parsedTabs = JSON.parse(savedTabs);
                // Opcional: Si el backup está vacío, retornar el estado inicial
                if (parsedTabs && parsedTabs.length > 0) {
                    return parsedTabs;
                }
            } catch (error) {
                console.error("Error al parsear tabs de localStorage", error);
                // Si hay un error, se ignora el backup y se usa el estado inicial
            }
        }
        // Estado inicial de fallback
        return [{ id: Date.now(), name: "Venta 1", cart: [], client: null }];
    };

    const [tabs, setTabs] = useState(initialTabs)
    useEffect(() => {
        localStorage.setItem("cashSaleTabs", JSON.stringify(tabs));
    }, [tabs]);
    const [activeTabId, setActiveTabId] = useState(tabs[0].id) //Pestaña activa
    const [barcode, setBarcode] = useState("") // Codigo escaneado



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



    // Manejar escaneo
    const handleScan = async (e) => {
        e.preventDefault();
        if (!barcode) return;

        const prefix = parseInt(barcode.slice(0, 2), 10);
        let product 
        if (barcode.length < 12 && prefix < 20 || prefix > 29) {
            setLoadingProduct(true)
            const productSiigo = await GET_ProductSiigoByCode(barcode)
            product = useDecodeNormal(productSiigo, wh)
        } else {
            setLoadingProduct(true)
            const productCode = barcode.slice(2, 7);
            const adjust_code = productCode.padStart(6, "0")
            setBarcode(adjust_code)
            const productSiigo = await GET_ProductSiigoByCode(adjust_code)
            const weightDigits = barcode.slice(7, 12); // ejemplo: 00655 -> 0.655 kg
            let weight
            if (productSiigo.unit.code === "94") {
                weight = parseInt(weightDigits, 10) 
            } else {
                weight = parseInt(weightDigits, 10) / 1000;
            }
            product = useDecodeScale(productSiigo, weight, wh) 
        }

        if (!product) {
            toast.error("ERROR: Producto no existe ")
            return
        }

        //console.log("Producto codificado de siigo", product)

   

        updateActiveTab((tab) => {
        // si es bascula => agregar siempre como item independiente (no sumar cantidades)
        if (product.isScale) {
            return { ...tab, cart: [...tab.cart, product] };
        }

        // para normal => si existe en carrito sumar cantidad
        const existingIndex = tab.cart.findIndex((it) => String(it.code) === String(product.code));
        if (existingIndex === -1) {
            return { ...tab, cart: [...tab.cart, product] };
        } else {
            const newCart = [...tab.cart];
            const found = { ...newCart[existingIndex] };
            found.quantity += 1
            found.subtotal = product.subtotal * found.quantity
            found.tax5 = found.tax5 > 0 && Number( (found.subtotal * 0.05).toFixed(2) ); // si tu iva es por unidad ajustar según lógica
            found.tax19 = found.tax19 > 0 && Number( (found.subtotal * 0.19).toFixed(2) )
            found.total = found.subtotal + found.tax5 + found.tax19
            newCart[existingIndex] = found;
            return { ...tab, cart: newCart };
        }
        });

        setBarcode("");
        setLoadingProduct(false)
    };

    /*=======================================================================
      PROCESOS PARA CALCULAR EL RESUMEN DE VENTA 
    =========================================================================*/
    // Totales del tab activo
    const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]
    //console.log("Cariito activo", activeTab)
    const subtotal = (activeTab?.cart || []).reduce((s, it) => s + (Number(it.subtotal || 0)), 0);
    const tax5Total = (activeTab?.cart || []).reduce((s, it) => s + Number(it.tax5 || 0), 0);
    const tax19Total = (activeTab?.cart || []).reduce((s, it) => s + Number(it.tax19 || 0), 0);
    let total = subtotal + tax5Total + tax19Total;
    total = parseFloat(total.toFixed(2))

    /* -- CONTROL DE PAGOS -- */
    const getCashMethodId = () => {
        if (!sp?.methods) return null;
        return sp?.methods?.find(m => m.name.toLowerCase().includes("efectivo"))?.id || null;
    };
    const getTransferMethodId = () => {
        if (!sp?.methods) return null;
        return sp?.methods?.find(m =>  m.name.toLowerCase().includes("bancolombia") )?.id || null;
    };
    const cashMethodId = getCashMethodId();
    const transferMethodId = getTransferMethodId();

    const formatMoney = (value) => {
        if (!value) return "0";
        return Number(value).toLocaleString("es-CO");
    };
    const cleanNumber = (value) => {
        if (!value) return 0; // evita el error

        return Number(
            value.toString().replace(/\./g, "").replace(/,/g, "")
        ) || 0;
    }

    const [paymentValues, setPaymentValues] = useState({}); //Valores ingresados en los metodos de pago
    const handlePaymentChange = (id, value) => {
        const notFormat = cleanNumber(value); // número sin formato
        const clean = Math.floor(notFormat * 100) / 100


        setPaymentValues(prev => ({
            ...prev,
            [id]: clean
        }));
    };
    //console.log("Valores del metodo de pago", paymentValues)

    const cash = paymentValues[cashMethodId] || 0;
    const transfer = paymentValues[transferMethodId] || 0;

    const repay = Math.max((cash + transfer) - total, 0) // nunca negativo

    const receipt_cash =  parseFloat((cash - repay).toFixed(2)) === Math.round(total) ? total : parseFloat((cash - repay).toFixed(2))
    const receipt_transfer = Math.round(total) === transfer ? total : transfer
    const total_payment = receipt_cash + receipt_transfer

    let payments = sp?.methods.map(m => {
        let value = 0;
        if (m.id === cashMethodId) value = receipt_cash 
        if (m.id === transferMethodId) value = receipt_transfer

        return { id: m.id, value, due_date: today };
    }).filter(p => p.value > 0);


    /*=======================================================================
      PROCESOS PARA IMPRIMIR FACTURA Y REGISTAR VENTA
    =========================================================================*/
    const [isInvoicePrinting, setIsInvoicePrinting] = useState(false);

    useEffect(() => {
        useHandleInputChange(setBuildInvoice, "document.id", resolution?.id)
        useHandleInputChange(setBuildInvoice, "customer", selectedCustomer)
        useHandleInputChange(setBuildInvoice, "cost_center", sp?.cost_center)
        useHandleInputChange(setBuildInvoice, "sale_point", sp?.id)
    }, [selectedCustomer, resolution, sp])

    // Confirmar pago: registrar venta + descontar stock + imprimir factura + limpiar carrito
    const handleConfirmPayment = async () => {
        console.log(total_payment, total)
        if (total_payment < total) {
            toast.error("El monto recibido es menor al total");
            return;
        }
        if (receipt_transfer > total){
            return toast.error("El ingreso de tranferencia no es exacto")
        }

        if (!sessionId) {
            await retrySession()
            if (!sessionId) {
                return toast.error("No hay sesión de caja activa");
            }
        }
        if (!isBuildInvoice.document.id) {
            await retryResolution()
        }
        if (!selectedCustomer){
            return toast.error("No hay cliente seleccionado, intentalo de nuevo")
        }
        

        // Crear los ítems
        const itemsPayload = (activeTab?.cart || []).map((it) => ({
            code: it.code,
            description: it.description,
            quantity: it.quantity,
            price: it.price,
            discount: it.discount,
            warehouse: it.warehouse,
            taxes: it.taxes,
        }));


        // Crear los ítems
        const invoiceItem = (activeTab?.cart || []).map((it) => ({
            product_name: it.name,
            product_barcode: it.code,
            quantity: it.quantity,
            unit_price: it.base_price,
            tax0: it.tax0,
            tax5: it.tax5,
            tax19: it.tax19,
            total: it.total
        }));

        const invoiceData = {
            ...isBuildInvoice, 
            customer: selectedCustomer,
            customerName: selectedCustomer?.name?.join(" ") || "Consumidor Final",
            customerCC: selectedCustomer?.identification || "222222222222",
            customerAddress: selectedCustomer?.address?.address || "Sin Direccioón",
            items: itemsPayload, 
            invoiceItem, 
            subtotal: Math.round(subtotal), 
            tax0: 0, 
            tax5: tax5Total, 
            tax19: tax19Total, 
            total: Math.round(total),
            payments,
            receipt_cash: Math.round(receipt_cash),
            receipt_transfer: Math.round(receipt_transfer),
            repay: Math.round( (repay).toFixed(2) ),
            total_payment: Math.round(total_payment),
            cash_session: sessionId
        }

        const invoice = await POST_InvoiceSiigo(invoiceData)
        // Guardar datos y disparar impresión
        if (invoice) {
            console.log("Factura a imprimir: ", {...invoice, invoiceItem})
            setIsInvoicePrinting({...invoice, invoiceItem});
            // Limpiar carrito y cliente
            setTabs((prev) =>
                prev.map((t) =>
                t.id === activeTabId ? { ...t, cart: [], client: null } : t
                )
            );
            // Actualizar localStorage también
            const updatedTabs = tabs.map((t) =>
                t.id === activeTabId ? { ...t, cart: [], client: null } : t
            );
            localStorage.setItem("cashSaleTabs", JSON.stringify(updatedTabs));

            setPaymentValues({}); // limpiar pagos
            setSelectedCustomer(null); // limpiar cliente   
        }

    };

    // Detectar los IVAs activos antes del render
    const showIVA0 = activeTab.cart.some(it => it.tax0 === true);
    const showIVA5 = activeTab.cart.some(it => it.tax5 > 0);
    const showIVA19 = activeTab.cart.some(it => it.tax19 > 0);

    //console.log("Factura registrada en el pos", isInvoicePrinting)


    return (
        <>
            {/*================================================================
                VISTA DE REGISTRO DE PRODUCTO A LA VENTA
            ===================================================================*/}
            <div className="flex gap-6  container mx-auto max-w-7xl 2xl:max-w-[90%]">
                <div className="w-2/3 space-y-4">
                    <OpenCloseCash sp={sp} user={user} GET_SalePoint={GET_SalePoint}/>
                    {/* Pestañas */}
                    <section className="flex gap-2 w-full justify-center">
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
                    </section>
                    {/*============================================================
                    COLUMNA DE ESCANEO Y CARRITO
                    ==============================================================*/}
                    <div className="space-y-4">
                    <section className="p-4 bg-[#841A1A] text-amber-100 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                        <Barcode /><h3 className="text-lg font-bold">Escáner</h3>
                        </div>
                        <form onSubmit={handleScan} className="flex gap-2 items-center relative">
                            <input 
                                ref={inputScannerRef} 
                                value={barcode}  
                                disabled={loadingProduct} 
                                onChange={(e) => setBarcode(e.target.value)} 
                                className="flex-1 p-2 focus:outline-none rounded-lg bg-[#6E1515]" 
                                placeholder="Escanea o escribe código" 
                                autoFocus 
                            />
                            {loadingProduct && (
                                <div className="flex gap-2 absolute text-amber-100/50 right-2 items-center">
                                    <Loader className="animate-spin self-center" size={24}/>
                                    <p>Cargando producto...</p>
                                </div>
                            )}
                        </form>
                    </section>

                    <section className="p-4 bg-[#841A1A] text-amber-100 rounded-xl">
                        <h4 className="font-semibold mb-2 flex items-center">
                            {tabs.length !== 0 && (
                                <div className="mr-4 flex justify-between w-full">
                                    <p>
                                        Carrito de  {tabs.find((t) => t.id === activeTabId)?.name}
                                    </p>
                                    <p>
                                    Total items: {tabs.find((t) => t.id === activeTabId)?.cart.length} 
                                    </p>
                                </div>
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
                                    <td className="px-4 text-center py-2">{it.quantity}</td>
                                    <td className="px-4 text-center py-2">{formatDecimal(it.base_price, true)}</td>
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
                </div>

                {/*============================================================
                    RESUMEN DE VENTA Y FACUTRACION 
                ==============================================================*/}
                <div className="p-4 bg-[#841A1A] text-amber-100 space-y-3 flex flex-col items-center justify-center rounded-xl w-1/3">
                <div className="text-center">
                    {/*Tipo de Facuración */}
                    <p className="font-bold text-lg">{resolution?.type} - {resolution?.code} - {resolution?.name}</p>
                    {/*Centro de Costos */}
                    <p className="font-semibold">{sp?.cost_center_name}</p>
                </div>
                <hr className="border-amber-200/20 w-[90%] " />
                <h4 className="font-semibold mt-1">Resumen</h4>
                {/*Valores de la venta*/}
                <div className="text-righ w-full">
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
                    <div className="flex justify-between font-bold"><span>Total:</span><span>{formatDecimal(total, true)}</span></div>
                </div>

                <hr className="border-amber-200/20 w-[90%] "/>

                {sp?.methods.map((m) => (
                    <section key={m.id} className="flex items-center gap-2 w-full">
                        <label className="font-semibold w-1/2 text-nowrap overflow-hidden text-ellipsis text-sm">{m.name}:</label>
                        
                        <input
                            ref={m.id === cashMethodId ? cashInputRef : m.id === transferMethodId ? transferInputRef : null}
                            type="text"
                            className="bg-[#6E1515] w-1/2 px-4 py-1 rounded-lg outline-none text-white"
                            value={formatMoney(paymentValues[m.id] || "")}
                            onChange={(e) => handlePaymentChange(m.id, e.target.value)}
                            name="payment"
                        />
                    </section>
                ))}

                <section className="flex items-center gap-2 w-full">
                    <label className="font-semibold text-sm">Devuelta:</label>
                    <input
                        readOnly
                        value={formatMoney(repay)}
                        className="w-full  rounded-lg outline-none font-semibold opacity-70"
                        name="repay"
                    />
                </section>

                <hr className="border-amber-200/20 w-[90%]" />

                <ClientSearch setCustomer={setSelectedCustomer} selectedCustomer={selectedCustomer}/>

                <button onClick={() => handleConfirmPayment()} disabled={activeTab.cart.length === 0 || sp?.status === "closed"} className={`${sp?.status === "closed" && "cursor-not-allowed"} mt-4 bg-amber-200 text-[#841A1A] p-2 rounded font-semibold w-full`}>
                    {isLoading ? 
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

                 
            {isInvoicePrinting && <InvoiceModal  invoice={isInvoicePrinting} onFinish={() => setIsInvoicePrinting(null)}/> }

        </>
    )
}