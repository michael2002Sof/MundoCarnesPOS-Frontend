import { Link, Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MailWarning } from "lucide-react";

import {AppHeader} from "./components/shared/headers"
import Sidebar from "./components/shared/sidebar";
import Modules from "./config/modules"
import useFilteredAuthorization from "./utils/useFilteredAuthorization";
import DecodeToken from "./api/decode";
import usePlan from "./hooks/admin/usePlan";
import moment from "moment-timezone";
import axiosInstance from "./api/axiosintance";
import toast from "react-hot-toast";

export default function AppLayout() {
    const filteredModules = useFilteredAuthorization(Modules, "modules") // Obtener modulos del usuario
    const token = DecodeToken()
    const {plan, GET_Plan} = usePlan()

    const today = moment().tz("America/Bogota").format("YYYY-MM-DD")
    const [showPaymentWarning, setShowPaymentWarning] = useState(false)
    const [showSuspendedWarning, setShowSuspendedWarning] = useState(false)
    const daysRemaining = moment(plan?.end_date).diff(moment(today), 'days');

    const headerRef = useRef()
    const suspensionRequestedRef = useRef(false)
    const navigate = useNavigate()
    const [contentHeight, setContentHeight] = useState("100vh");
    const [expanded, setExpanded] = useState(false);

    const onToggleSidebar = () => setExpanded(prev => !prev);
    useEffect(() => {
        if (!token){
            navigate("/")
        }
    }, [token])

    useEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) {
            const headerHeight = headerRef.current.offsetHeight;
            setContentHeight(`calc(100vh - ${headerHeight}px)`);
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    // useEffect para CARGAR el plan (solo en el montaje)
    useEffect(() => {
        if(token?.rol === "admin"){ 
            GET_Plan()
        }
    }, [])

    // useEffect para EVALUAR el plan (cada vez que 'plan' cambia/se carga)
    useEffect(() => {
        if (plan && plan?.payment_notice && plan?.end_date) {
            // Convertir las fechas a objetos moment para una comparación robusta
            const paymentNoticeDate = moment(plan.payment_notice)
            const endDate = moment(plan.end_date)
            const currentDate = moment(today)
            console.log(currentDate)

            // Evalúa si la fecha actual está DENTRO del período de aviso:
            // Es decir, si la fecha actual es >= fecha de aviso Y <= fecha de fin
            if (currentDate.isSameOrAfter(paymentNoticeDate, 'day') && currentDate.isSameOrBefore(endDate, 'day')) {
                // Además, si el aviso es sobre 2 días, puedes añadir una condición más:
                const daysRemaining = endDate.diff(currentDate, 'days')

                // Condición: Estamos dentro del período de aviso Y quedan 2 días o menos.
                if (currentDate.isSameOrAfter(paymentNoticeDate, 'day') && daysRemaining <= 2) {
                    setShowPaymentWarning(true)
                } else {
                    setShowPaymentWarning(false)
                }
            } else {
                setShowPaymentWarning(false)
            }
        }
    }, [plan, today])

    useEffect(() => {
        if (!plan?.end_date) return

        const currentDate = moment(today)
        const endDate = moment(plan?.end_date)
        const isExpired = currentDate.isAfter(endDate, 'day')

        if (!isExpired) {
            setShowSuspendedWarning(false)
            suspensionRequestedRef.current = false
            return
        }

        setShowPaymentWarning(false)
        setShowSuspendedWarning(true)

        if (!token?.id) return
        if (suspensionRequestedRef.current) return

        suspensionRequestedRef.current = true

        ;(async () => {
            try {
                await axiosInstance.put('/posinnovate/siigo/subscription/suspend', { company: token?.company} )
                await GET_Plan()
            } catch (error) {
                suspensionRequestedRef.current = false
                toast.error(error?.response?.data?.message ?? error?.message ?? 'No se pudo suspender la cuenta.')
            }
        })()
    }, [plan, today, token?.id])

 
    return (
        <div className={`bg-amber-50  h-screen flex flex-col`}>
            <header ref={headerRef} className={`bg-[#841A1A] text-amber-100`}>
                <AppHeader modules={filteredModules}  onToggleSidebar={onToggleSidebar}/>
            </header>
           <main className="flex flex-1">
                {/* Sidebar */}
                {plan?.status !== 'suspended' && (
                    <div
                        style={{ height: contentHeight }}
                        className={`bg-[#841A1A] text-amber-100 overflow-y-auto hidden lg:flex p-3 flex-col items-center space-y-2 min-h-full transition-all duration-300 ${
                        expanded ? "w-64" : "w-16"
                        }`}
                    >
                        <Sidebar menuItems={filteredModules} expanded={expanded} />
                    </div>
                )}
               

                {/* Contenido */}
                <div className="relative flex-1 w-full p-4 sm:p-8 bg-amber-50  space-y-6 flex flex-col items-center overflow-hidden">
                    {(showSuspendedWarning || plan?.status === 'suspended') && (
                        <section className="bg-red-50 w-full px-4 py-3 border rounded-lg flex items-center justify-between gap-4 border-red-200">
                            <p className="text-red-700 flex gap-2 items-center">
                                <MailWarning />
                                <span>
                                    <span className="font-bold">Cuenta suspendida</span> por suscripción vencida. Renueva para continuar usando los servicios.
                                </span>
                            </p>
                            <Link to={"/payment-method"} className="hover:underline text-red-700 font-semibold whitespace-nowrap">
                                Renovar suscripción
                            </Link>
                        </section>
                    )}

                    {!showSuspendedWarning && plan?.status !== 'suspended' && showPaymentWarning && (
                        <section className="bg-amber-200 w-full px-4 py-2 border rounded-lg flex items-center justify-between gap-4 border-amber-300">
                            <p className="text-amber-700 flex gap-2 items-center">
                                <MailWarning />
                                Tu suscripción está por vencer: quedan <span className="font-bold">{daysRemaining}</span> días.
                            </p>
                            <Link to={"/payment-method"} className="hover:underline text-amber-700 font-semibold whitespace-nowrap">
                                Ir al método de pago
                            </Link>
                        </section>
                    )}
                    <Outlet />
                </div>
            </main>
        </div>
    )

}