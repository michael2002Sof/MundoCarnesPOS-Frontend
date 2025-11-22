import { useState, useEffect, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { LockOpen, Lock, Loader2, Loader } from "lucide-react"

import { ModulesHeader } from "../../../components/shared/headers"
import handleInputChange from "../../../utils/useHandleInputChange"
import { formatDecimal, formatInputNumber } from "../../../utils/formatData"

import {useCashSession, useSessionId} from "../../../hooks/sale/useCashSession"
import toast from "react-hot-toast"
import ReportTemplate from "../../../components/shared/reportCashSession"


export default function OpenCloseCash ({sp, user, GET_SalePoint}) {
    const {isLoading, session, POST_CashSession, GET_SessionById, POST_CreditNote, PUT_CashSession} = useCashSession()

    const sessionActive = useSessionId(sp?.id)
    const reportRef = useRef();
    const handleWorkerPrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: `Reporte_Caja_${sessionActive}`,
        pageStyle: `
        @page {
            size: 80mm auto;
            margin: 4mm;
        }
        body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        `,
    });




    //console.log("Sesión del dia traida",session)
    console.log("ID de la sesión:", sessionActive)
    /*=======================================================================
        CONSTANTES PARA LA APERTURA DE CAJA y CREACION DE REGISTRO DIARIO
    =========================================================================*/
    const [cashDisplay, setCashDisplay] = useState(""); // lo que ve el usuario

    /* -- Iniciar Registro de caja -- */
    const [ isRegisterCashSession, setRegisterCashSession ] = useState({
        sale_point: sp?.id,
        branch: sp?.branch,
        initial_cash: 0,
    })

    /* -- Sincroniza el id del punto de venta cuando cambie -- */
    useEffect(() => {
        setRegisterCashSession({
            sale_point: sp?.id,
            branch: sp?.branch,
            initial_cash: 0,
        })
    }, [sp]);

    /* -- Función: Abrir caja (crear registro diario) -- */
    const [ showOpenModal, setShowOpenModal ] = useState(false)
    const handleOpenRegister = async (e) => {
        e.preventDefault()
        await POST_CashSession(isRegisterCashSession)
        await GET_SalePoint()
        useCashSession(sp?.id)
        setShowOpenModal(false)
    };

    /*=======================================================================
        CONSTANTES PARA EL CIERRE DE CAJA y FINALIZACION DEL REGISTRO DIARIO
    =========================================================================*/
    const [ showCloseModal, setShowCloseModal ] = useState(false)
    const [creditNotesSuccess, setCreditNotesSuccess] = useState(false)
    console.log("creditNotesSuccess", creditNotesSuccess)

    /* -- Función: Registrar Notas de Crédito antes de cerrar caja -- */
    const RegisterCreditNotes = async () => {
        const success = await POST_CreditNote()
        if (!success) {
            toast.error("No se pueden cargar las notas de crédito. No es posible cerrar caja.")
            return
        }
        setCreditNotesSuccess(true)
    }
    useEffect(() => {
        if(creditNotesSuccess  && sessionActive !== null) {
            setShowCloseModal(true)
            if (sessionActive) {
                GET_SessionById(sessionActive)  // ← usa el ID correcto
            }
            setCreditNotesSuccess(false)
        }
    }, [creditNotesSuccess, sessionActive])
// 
    /* -- Función: Cerrar caja del día -- */
    const handleCloseRegister = async () => {
        if (!sessionActive) {
            return toast.error("No hay sesión activa para cerrar");
        }
        await PUT_CashSession({
            cash_session: sessionActive,
            sales_point: sp?.id,
            closed_by: user,
        })

        GET_SalePoint()
        setShowCloseModal(false);
        // Ahora imprime
        setTimeout(() => handleWorkerPrint(), 300);
    };

    
    return (
        <>
            {/*================================================================
                MODAL PARA INGRESAR MONTO INICIAL DE LA CAJA
            ===================================================================*/}
            {showOpenModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 min-h-screen">
                    <form onSubmit={handleOpenRegister} className="bg-[#841A1A] text-amber-100 p-12 rounded-xl flex flex-col">
                        <h1 className="text-xl font-semibold">Ingresa el Valor Inicial de la Caja</h1>
                        <input 
                            value={cashDisplay} 
                            onChange={(e) => { 
                                const display = formatInputNumber(e.target.value)
                                setCashDisplay(display)
                                const numeric = Number(display.replace(/[^\d]/g, ""));  // guardar limpio
                                handleInputChange(setRegisterCashSession, "initial_cash", numeric)
                            }} 
                            type="text"
                            inputMode="numeric"
                            className="focus:outline-none bg-[#6E1515] px-4 py-2 mt-4 rounded-lg"
                        />
                        <div className="flex gap-2 items-center w-full justify-center">
                            <button type="button" onClick={() => setShowOpenModal(false)} className="border-amber-200 border text-amber-200 hover:bg-amber-200/10 rounded-lg px-4 py-2 cursor-pointer mt-8 font-semibold">
                                Cancelar
                            </button>
                            <button type="submit" disabled={isLoading} className="bg-amber-200 text-[#841A1A] rounded-lg px-4 py-2 cursor-pointer mt-8 font-semibold">
                                {isLoading ? "Abriendo..." : "Iniciar Sesión de Caja"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/*================================================================
                MODAL PARA CONFIRMAR CIERRE DE CAJA
            ===================================================================*/}
            {showCloseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 min-h-screen">
                    <div className="bg-[#841A1A] text-amber-100 p-8 rounded-xl w-[480px]">
                        <h2 className="text-xl font-semibold mb-6">Cierre de Caja</h2>

                        {session ? (
                            <>
                                <div className="bg-[#6E1515] p-4 rounded-lg mb-6 space-y-2">
                                    <h3 className="font-semibold mb-3">Metodos de Pago:</h3>

                                    <div className="flex justify-between text-sm">
                                        <span>En efectivo:</span>
                                        <span className="font-mono">
                                            {formatDecimal(session.total_cash, true)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Por transferencia:</span>
                                        <span className="font-mono">
                                            {formatDecimal(session.total_transfer, true)}
                                        </span>
                                    </div>
                                    
                                    <hr className="border-amber-200/30 my-2" />
                                    
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span className="font-mono">
                                            {formatDecimal(session.subtotal_method, true)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Devoluciones:</span>
                                        <span className="font-mono">
                                            {formatDecimal(session.total_return, true)}
                                        </span>
                                    </div>

                                    <hr className="border-amber-200/30 my-2" />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span className="font-mono">
                                            {formatDecimal(session.total_method, true)}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-[#6E1515] p-4 rounded-lg mb-6 space-y-2">
                                    <h3 className="font-semibold mb-3">Resumen del Día:</h3>

                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span className="font-mono">
                                            {formatDecimal(session.subtotal, true)}
                                        </span>
                                    </div>

                                    {session.tax0 === 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>IVA 0%:</span>
                                            <span className="font-mono">
                                                $0
                                            </span>
                                        </div>
                                    )}

                                    {session.tax5 > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>IVA 5%:</span>
                                            <span className="font-mono">
                                                {formatDecimal(session.tax5, true)}
                                            </span>
                                        </div>
                                    )}

                                    {session.tax19 > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>IVA 19%:</span>
                                            <span className="font-mono">
                                                {formatDecimal(session.tax19, true)}
                                            </span>
                                        </div>
                                    )}

                                    <hr className="border-amber-200/30 my-2" />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total del Día:</span>
                                        <span className="font-mono">
                                            {formatDecimal(session.total, true)}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-[#6E1515] p-4 rounded-lg mb-6 text-center">
                                <p>Calculando totales...</p>
                            </div>
                        )}

                        <p className="text-sm text-amber-200 mb-6">
                            ¿Estás seguro de cerrar la caja? Esta acción generará el reporte del día.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCloseRegister}
                                disabled={isLoading}
                                className="flex-1 bg-amber-200 text-[#841A1A] rounded-lg px-4 py-2 font-semibold hover:bg-amber-300 transition disabled:opacity-50"
                            >
                                {isLoading ? (
                                   <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={16} />
                                        Cerrando...
                                    </div>
                                ) : (
                                    "Confirmar Cierre"
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setShowCloseModal(false)
                                }}
                                disabled={isLoading}
                                className="px-4 py-2 border border-amber-200 rounded-lg hover:bg-amber-200/10 transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-between gap-2">
                <ModulesHeader
                    module={`Punto de Venta ${sp?.name}`}
                    description={"Vende tus productos de forma rapida, escaneando su codigo"}
                />
                <section
                    className={`flex text-nowrap w-full items-center justify-end gap-3 px-4 py-2 rounded-lg transition-all duration-300
                    ${sp?.status === "open" 
                    ? " text-green-700  dark:text-green-400 dark:border-green-600" 
                    : " border-red-400 text-red-700 dark:text-red-400 dark:border-red-600"}`}
                >
                    {sp?.status === "open" ? (
                    <>
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-md shadow-green-400/40" />
                        <p className="font-semibold flex items-center gap-1">
                        <LockOpen size={18} /> Caja Abierta
                        </p>
                    </>
                    ) : (
                    <>
                        <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-md shadow-red-400/40" />
                        <p className="font-semibold flex items-center gap-1">
                        <Lock size={18} /> Caja Cerrada
                        </p>
                    </>
                    )}
                </section>
            </div>
            <section className="flex gap-4 w-full justify-start">
                <button onClick={() => setShowOpenModal(true)} className={`px-4 py-2 rounded-lg border cursor-pointer flex gap-2 items-center ${sp?.status === "open" ? `bg-[#841A1A] text-amber-100` : `border-[#841A1A] text-[#841A1A] `}`}>
                    <LockOpen/> Apertura de Caja
                </button>
                <button onClick={RegisterCreditNotes}  disabled={sp?.status !== "open"} className={`px-4 py-2 rounded-lg border cursor-pointer flex gap-2 items-center ${sp?.status  === "closed" ? `bg-[#841A1A] text-amber-100` : `border-[#841A1A] text-[#841A1A]`}`}>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader className="w-5 h-5 animate-spin" />
                            <p>Procesando Notas...</p>
                        </div>
                    ) : (
                        <>
                          <Lock/> Cierre de Caja
                        </>
                    )}
                </button>
            </section>

            <div style={{ display: "none" }}>
                <div ref={reportRef}>
                    {session && <ReportTemplate session={session} />}
                </div>
            </div>
        </>
    )
}