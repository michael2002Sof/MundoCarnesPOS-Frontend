import { useState, useMemo, useEffect, use } from "react"
import { Barcode, Loader2, ShoppingCart, Trash2} from "lucide-react"

import OpenCloseCash from "./cash sale/OpenCloseCash"
import DecodeToken from "../../api/decode"
import ClientSearch from "./cash sale/ClientSearch"
import useHandleInputChange from "../../utils/useHandleInputChange"
import { formatDecimal } from "../../utils/formatData"
import InvoiceModal from "../../components/shared/invoiceModal"

import {useDecodeScale, useDecodeNormal} from "./cash sale/useDecodeBarcode"

import useSalePoint from "../../hooks/sale/useSalePoint"
import useProductSiigo from "../../hooks/siigo/useProduct"
import useInvoiceSiigo from "../../hooks/siigo/useInvoice"
import usePaymentSiigo from "../../hooks/siigo/usePayment"
import useCostCenterSiigo from "../../hooks/siigo/useCostCenter"
import useWareHouse from "../../hooks/siigo/useWareHouse"
import toast from "react-hot-toast"



export default function CashSale() {
    /*================================================================
      LLAMADA DE DATOS DEL SISTEMA
    ===================================================================*/
    const {isLoading, POST_InvoiceSiigo, typeInvoiceSiigo} = useInvoiceSiigo()
    const today = new Date().toISOString().slice(0, 10);


    const {costCenterSiigo} = useCostCenterSiigo()
    const {wareHouses} = useWareHouse()
    const {GET_ProductSiigoByCode} = useProductSiigo()

    const [selectedCustomer, setSelectedCustomer] = useState(null); // cliente elegido

    const {salePoints, GET_SalePoint} = useSalePoint()         
    const token = DecodeToken()     
    const sp = salePoints?.find(sp => sp.id_user === token.id ) //Punto de venta del usuario


    const {paymentMethodSiigo} = usePaymentSiigo()
    const paymentMethodsBySalePoint = { 
        1: [10780, 7057], // LC PEQUEÑO
        2: [10779, 7057], // LC OFICINA
    };
    const filterPaymentMethods = (methods, salePointId) => {
        const allowedIds = paymentMethodsBySalePoint[salePointId] || [];
        return methods.filter(method => allowedIds.includes(method.id));
    };
    const filteredPayments = filterPaymentMethods(paymentMethodSiigo, sp?.id);
    const paymentArray = filteredPayments.map(method => ({
        id: method.id,
        value: "",
        due_date: today
    }));

    const wh = wareHouses?.find(wh => wh.id === sp?.warehouse) // Bodega del punto de venta
    const user = token?.id //Vendedor del punto de venta

    /*=======================================================================
      ESTRUCTURA DE DATOS PARA LA GENERACION DE FACTURA 
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
        sale_point: "",
        receipt_cash: "",
        receipt_transfer: "",
        total_payment: "",
        repay: "",

        subtotal: "",
        tax0: "",
        tax5: "",
        tax19: "",
        total: ""

    }
    const [isBuildInvoice, setBuildInvoice] = useState(initalData)
 

    /*=======================================================================
      PROCESOS PARA EL REGISTRO DE VENTA DE PRODUCTOS 
    =========================================================================*/
    // Estado inicial
    const [tabs, setTabs] = useState([{ id: Date.now(), name: "Venta 1", cart: [], client: null }])

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
            const productSiigo = await GET_ProductSiigoByCode(barcode)
            console.log(productSiigo)
            product = useDecodeNormal(productSiigo, wh)
        } else {
            const productCode = barcode.slice(2, 7);
            const weightDigits = barcode.slice(7, 12); // ejemplo: 00655 -> 0.655 kg
            const weight = parseInt(weightDigits, 10) / 1000;
            const adjust_code = productCode.padStart(6, "0")
            setBarcode(adjust_code)
            const productSiigo = await GET_ProductSiigoByCode(adjust_code)
            console.log(productSiigo)
            product = useDecodeScale(productSiigo, weight, wh) 
        }

        console.log("Producto traido de siigo", product)

   

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
            found.quantity = (found.quantity || 1) + 1;
            found.subtotal = Math.round(found.subtotal + product.subtotal);
            found.iva5 = (Number(found.tax5) || 0) + product.tax5; // si tu iva es por unidad ajustar según lógica
            found.iva19 = (Number(found.tax19) || 0) + product.tax19;
            found.total = Math.round(found.total + product.total);
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
    const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]
    const subtotal = (activeTab?.cart || []).reduce((s, it) => s + (Number(it.subtotal || 0)), 0);
    const tax5Total = (activeTab?.cart || []).reduce((s, it) => s + Number(it.tax5 || 0), 0);
    const tax19Total = (activeTab?.cart || []).reduce((s, it) => s + Number(it.tax19 || 0), 0);
    const total = subtotal + tax5Total + tax19Total;

    /* -- CONTROL DE PAGOS -- */
    const [receiptCash, setReceiptCash] = useState(0);
    const [receiptTransfer, setReceiptTransfer] = useState(0);

    useEffect(() => {
        const repay = (receiptCash + receiptTransfer) - total;
        useHandleInputChange(setBuildInvoice, "repay", repay < 0 ? 0 : repay);
        useHandleInputChange(setBuildInvoice, "total_payment", (receiptCash + receiptTransfer) - repay);

        // Actualizar Siigo paymentMethods
        const updatedPayments = paymentArray.map(p => {
            if (p.id === filteredPayments[0]?.id) {
                return { ...p, value: (total - receiptTransfer) };
            }
            if (p.id === filteredPayments[1]?.id) {
                return { ...p, value: receiptTransfer };
            }
            return p;
        });

        // Filtrar los pagos con valor 0
        const filteredPaymentsFinal = updatedPayments.filter(p => Number(p.value) > 0);

        useHandleInputChange(setBuildInvoice, "payments", filteredPaymentsFinal);
        useHandleInputChange(setBuildInvoice, "receipt_cash", (receiptCash - repay) );
        useHandleInputChange(setBuildInvoice, "receipt_transfer", receiptTransfer);
    }, [receiptCash, receiptTransfer, total]);

   
    /*=======================================================================
      PROCESOS PARA IMPRIMIR FACTURA Y REGISTAR VENTA
    =========================================================================*/
    const [showInvoice, setShowInvoice] = useState(false);
    const [isInvoicePrinting, setIsInvoicePrinting] = useState(false);

    useEffect(() => {
        useHandleInputChange(setBuildInvoice, "document.id", typeInvoiceSiigo?.id)
        useHandleInputChange(setBuildInvoice, "customer", selectedCustomer)
        if (wh?.id === 26) {
            useHandleInputChange(setBuildInvoice, "cost_center", 1163)
        } else if (wh?.id === 28) {
            useHandleInputChange(setBuildInvoice, "cost_center", 1167)
        }
        useHandleInputChange(setBuildInvoice, "sale_point", sp?.id)
    }, [selectedCustomer, typeInvoiceSiigo, total, wh, isBuildInvoice.cost_center, sp])

    // Confirmar pago: registrar venta + descontar stock + imprimir factura + limpiar carrito
    const handleConfirmPayment = async () => {

        if (isBuildInvoice.total_payment < total) {
            toast.error("El monto recibido es menor al total");
            return;
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
            unit_price: it.subtotal,
            tax0: it.tax0,
            tax5: it.tax5,
            tax19: it.tax19,
            total: it.total
        }));

        const invoiceData = {...isBuildInvoice, items: itemsPayload, invoiceItem, subtotal, tax0: 0, tax5: tax5Total, tax19: tax19Total, total}

        const invoice = await POST_InvoiceSiigo(invoiceData)
        // Guardar datos y disparar impresión
        if (invoice) {
            setIsInvoicePrinting(invoice, invoiceItem);
            // Limpiar carrito y cliente
            setTabs((prev) =>
                prev.map((t) =>
                t.id === activeTabId ? { ...t, cart: [], client: null } : t
                )
            );
            setShowInvoice(true)
        }
    };

    // Detectar los IVAs activos antes del render
    const showIVA0 = activeTab.cart.some(it => it.tax0 === true);
    const showIVA5 = activeTab.cart.some(it => it.tax5 > 0);
    const showIVA19 = activeTab.cart.some(it => it.tax19 > 0);

    //console.log("Factura registrada en el pos", isInvoicePrinting)


    return (
        <>
            <OpenCloseCash sp={sp} user={user} FetchSalesPoints={GET_SalePoint}/>
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
                            <input value={barcode} onChange={(e) => setBarcode(e.target.value)} className="flex-1 p-2 focus:outline-none rounded-lg bg-[#6E1515]" placeholder="Escanea o escribe código" autoFocus />
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
                                    <td className="px-4 text-center py-2">{it.quantity}</td>
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
                    <div className="p-4 bg-[#841A1A] text-amber-100 space-y-4 flex flex-col items-center justify-center rounded-xl w-1/3">
                    <h4 className="font-bold">Resumen</h4>
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
                        <div className="flex justify-between font-bold mt-2"><span>Total:</span><span>{formatDecimal(total, true)}</span></div>
                    </div>

                    <hr className="border-amber-200/20 w-[90%] my-4" />

                    {/*Tipo de Facuración */}
                    <section className="flex flex-col w-full">
                        <label className="font-semibold text-sm">Tipo de Factura:</label>
                        <input value={`${typeInvoiceSiigo?.type} - ${typeInvoiceSiigo?.code} - ${typeInvoiceSiigo?.name}`} type="text" disabled className="bg-[#6E1515] rounded-lg px-4 py-1 mt-1"/>
                    </section>

                    {/*Metodo de pago efectivo*/}
                    <section className="flex flex-col w-full">
                        <label className="font-semibold text-sm">{filteredPayments[0]?.name}:</label>
                        <input
                            type="number"
                            className="bg-[#6E1515] w-full px-4 py-1 rounded-lg outline-none text-white"
                            value={receiptCash}
                            onChange={(e) => setReceiptCash(Number(e.target.value))}
                        />
                    </section>
                    {/*Metodo de pago Bancolombia*/}
                    <section className="flex flex-col w-full">
                        <label className="font-semibold text-sm">Pago Bancolombia:</label>
                        <input
                            type="number"
                            className="bg-[#6E1515] w-full px-4 py-1 rounded-lg outline-none text-white"
                            value={receiptTransfer}
                            onChange={(e) => setReceiptTransfer(Number(e.target.value))}
                        />
                    </section>


                    {/*Centro de Costos */}
                    <section className="flex flex-col w-full">
                        <label className="font-semibold text-sm">Centro de Costos:</label>
                        <select value={isBuildInvoice.cost_center} onChange={(e) => useHandleInputChange(setBuildInvoice, "cost_center", Number(e.target.value) )} className="bg-[#6E1515] cursor-pointer w-full px-2 py-2 rounded-lg outline-none text-white mt-1">
                            <option value="">Seleccionar...</option>
                            {costCenterSiigo?.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </section>

                    <section className="flex flex-col w-full">
                        <label className="font-semibold text-sm">Devuelta:</label>
                        <input
                            type="number"
                            readOnly
                            value={isBuildInvoice.repay}
                            className="bg-[#6E1515] w-full px-4 py-1 rounded-lg outline-none text-white opacity-70"
                        />
                    </section>

                    <ClientSearch setCustomer={setSelectedCustomer}/>

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
            {showInvoice && (
                <div className=" fixed inset-0 py-12 bg-black/70 flex justify-center items-center p-4 z-50">
                    <InvoiceModal setShowInvoice={setShowInvoice}  invoice={isInvoicePrinting}/>
                </div>
            )}
        </>
    )
}