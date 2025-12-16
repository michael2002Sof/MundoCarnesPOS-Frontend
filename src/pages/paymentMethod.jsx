import { Calendar, CreditCard, Zap, Check } from 'lucide-react';
import usePlan from '../hooks/admin/usePlan';
import useCompany from '../hooks/admin/useCompany';
import useAdmin from '../hooks/admin/useAdmin';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';
import SubscriptionInvoice from '../components/shared/subscriptionInvoice';
import axiosInstance from '../api/axiosintance';
import DecodeToken from '../api/decode';
import toast from 'react-hot-toast';
import {ModulesHeader} from "../components/shared/headers"
import {formatDecimal} from "../utils/formatData"

export default function PaymentMethodPage() {
    const { plan, GET_Plan } = usePlan();
    console.log("PLAN EN PAYMENT METHOD:", plan);
    const token = DecodeToken();
    const { company, GET_Company } = useCompany();
    const { admin, GET_Admin } = useAdmin();
    const [receiptFile, setReceiptFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);

    useEffect(() => {
        GET_Plan();
        GET_Company();
        GET_Admin();
    }, []);


    // Si aún no hay plan, renderiza "loading" SIN romper reglas de hooks
    if (!plan || !plan?.price) {
        return <div className="p-8 text-center">Cargando detalles del plan...</div>;
    }

    // Datos “quemados” (mejor: pásalos a .env o a config)
    const NEQUI_ACCOUNT = {
        holder: "POSinnovate",     // <-- cambia
        phone: "324 4178590"       // <-- cambia (opcional)
    };

    const planCycleLabel = plan?.billing_cycle === 'monthly' ? 'Mes' : 'Año';

    const endDate = moment(plan?.end_date).format('DD [de] MMMM [de] YYYY');
    const today = moment().tz("America/Bogota").format("YYYY-MM-DD");
    const daysRemaining = moment(plan?.end_date).diff(moment(today), 'days');

    const paymentReference = `Plan-${plan?.id || 'XXXXXX'}-${today} `;

    const getRenewalDates = () => {
        const tz = "America/Bogota";
        const today = moment().tz(tz).startOf("day");

        // Si el plan aún está vigente, renovamos desde su end_date; si ya venció, desde hoy.
        const currentEnd = plan?.end_date ? moment(plan.end_date).tz(tz).startOf("day") : today;
        const start = currentEnd.isAfter(today) ? currentEnd : today;

        const daysToAdd = plan?.billing_cycle === "monthly" ? 30 : 365;
        const end = start.clone().add(daysToAdd, "days");
        const notice = end.clone().subtract(2, "days");

        return {
            start_date: start.format("YYYY-MM-DD"),
            end_date: end.format("YYYY-MM-DD"),
            notice_date: notice.format("YYYY-MM-DD"),
        };
    };

    const onSubmitManualNequi = async () => {

        if (!receiptFile) {
            toast.error("Debes adjuntar el comprobante (imagen o PDF) antes de enviar.");
            return;
        }

        try {
            setSubmitting(true);

            const { start_date, end_date, notice_date } = getRenewalDates();

            const form = new FormData();
            form.append("admin", String(token?.id));
            form.append("company", String(token?.company));
            form.append("plan", String(plan?.id));
            form.append("amount", String(plan?.price));
            form.append("start_date", start_date);
            form.append("end_date", end_date);
            form.append("payment_notice", notice_date);
            form.append("voucher", receiptFile);

            console.log(form)

            const res = await axiosInstance.put(`/posinnovate/siigo/subscription/renovation`, form);
            toast.success(res?.data?.message || "Comprobante enviado")
            setReceiptFile(null);
            setShowInvoice(true);
            GET_Plan();
        } catch (e) {
            toast.error(e?.message || "Error enviando el comprobante.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <ModulesHeader 
                module="Renovación de suscripción" 
                description="Selecciona y configura tu método de pago para renovar tu plan de suscripción." 
            />
            <div className="max-w-7xl 2xl:max-w-[90%] container mx-auto rounded-xl flex justify-center items-center flex-col xl:flex-row gap-6 py-6">

                {/* --- Detalles del Plan Actual --- */}
                <div className="mb-8 rounded-2xl bg-white border border-amber-200 overflow-hidden xl:w-[50%] 2xl:w-125">
                    <div className="px-6 py-5 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-amber-800">
                            <Zap size={18} />
                            <h2 className="text-lg font-bold">Tu plan actual</h2>
                        </div>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full border ${daysRemaining <= 5 ? 'text-red-700 border-red-200 bg-red-50' : 'text-green-700 border-green-200 bg-green-50'}`}>
                            {daysRemaining} días restantes
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                            <div className="text-center gap-4">
                                <h1 className='text-4xl font-extrabold'>Plane Basic</h1>
                                <p className="mt-1 text-3xl font-extrabold text-gray-900">
                                    {formatDecimal(plan?.price, true)}
                                    <span className="text-base font-semibold text-gray-600">/{planCycleLabel}</span>
                                </p>

                                <span
                                    className={`inline-flex items-center mt-1 px-3 py-1 rounded-full text-sm font-bold border ${
                                        plan?.status === 'active'
                                            ? 'text-green-700 border-green-200 bg-green-50'
                                            : plan?.status === 'suspended'
                                                ? 'text-red-700 border-red-200 bg-red-50'
                                                : 'text-amber-700 border-amber-200 bg-amber-50'
                                    }`}
                                >
                                    {plan?.status === 'active' ? 'Activo' : plan?.status === 'suspended' ? 'Suspendido' : 'Pendiente de pago'}
                                </span>
                            </div>

                            <div className="mt-4 text-center gap-3">
                               <ul className="space-y-3 text-start p-4">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div className="flex-1">
                                            <span className="font-medium">Usuarios:</span>{" "}
                                            <span className="text-muted-foreground">{plan?.user_limit ?? 0}</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div className="flex-1">
                                            <span className="font-medium">Almacenamiento:</span>{" "}
                                            <span className="text-muted-foreground">{Math.round(plan?.storage_limit ?? 0)} GB</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div className="flex-1 space-y-1">
                                            <section>
                                                <span className="font-medium">Soporte Técnico:</span>{" "}
                                                <span className="text-muted-foreground">{plan?.technical_support?.name}</span>
                                            </section>
                                            <section className="pl-4 space-y-0.5 text-sm text-muted-foreground">
                                                <div>• {plan?.technical_support?.response_time}</div>
                                                <div>• {plan?.technical_support?.schedule}</div>
                                            </section>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                        {/* Dates Section */}
                        <div className="space-y-3 p-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Fechas</h3>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Fecha de inicio</span>
                            <span className="text-sm font-semibold">
                                {plan?.start_date ? moment(plan.start_date).format("DD [de] MMMM [de] YYYY") : "—"}
                            </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Aviso de pago</span>
                            <span className="text-sm font-semibold">
                                {plan?.payment_notice ? moment(plan.payment_notice).format("DD [de] MMMM [de] YYYY") : "—"}
                            </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/5 border border-primary/20">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Fecha de vencimiento
                            </span>
                            <span className="text-sm font-bold">{endDate}</span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl overflow-hidden border border-purple-200 bg-white">
                        <div className="px-6 py-5 bg-linear-to-r from-purple-700 to-fuchsia-600 text-white">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                                    <img width={24} src="/icons/Nequi.svg" alt="Nequi" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold leading-tight">Pago con Nequi</h3>
                                    <p className="text-sm text-white/90">Paga desde tu app y adjunta el comprobante para verificación.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-4">
                            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                                <p className="font-bold text-purple-900 mb-2">Datos para pagar</p>
                                <div className="text-gray-800 space-y-1">
                                    <p><span className="font-semibold">Titular:</span> {NEQUI_ACCOUNT.holder}</p>
                                    <p><span className="font-semibold">Nequi:</span> {NEQUI_ACCOUNT.phone}</p>
                                    <p className="mt-2"><span className="font-semibold">Valor:</span> <span className="font-extrabold text-gray-900">{formatDecimal(plan?.price, true)}</span></p>
                                    <p><span className="font-semibold">Referencia:</span> <span className="font-mono text-purple-900">{paymentReference}</span></p>
                                </div>
                            </div>

                            <div className="rounded-xl border-purple-200 border bg-purple-50 p-4">
                                <p className="font-bold text-purple-900 mb-2">Instrucciones</p>
                                <ol className="list-decimal pl-5 text-gray-700 space-y-2">
                                    <li>Ingresa a tu app Nequi.</li>
                                    <li>Selecciona “Envía” → “A otro número de Nequi”.</li>
                                    <li>Envía el valor exacto: <b>{formatDecimal(plan?.price, true)}</b>.</li>
                                    <li>En “Mensaje/Referencia” escribe: <b className="font-mono">{paymentReference}</b>.</li>
                                    <li>Guarda el comprobante (captura o PDF) y adjúntalo aquí.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="rounded-xl border border-dashed border-purple-300 bg-purple-50 p-4">
                                <label className="block font-bold text-purple-900 mb-2">
                                    Adjuntar comprobante (imagen o PDF)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => {
                                        setReceiptFile(e.target.files?.[0] ?? null);
                                    }}
                                    className="block w-full text-sm"
                                />
                                <p className="mt-2 text-xs text-purple-800/80">
                                    El botón se habilita cuando adjuntas el archivo.
                                </p>
                            </div>
                        </div>

                        <div className="px-6 pb-6">

                            <button
                                onClick={onSubmitManualNequi}
                                disabled={submitting || !receiptFile}
                                className={`w-full font-bold py-3 px-4 rounded-xl transition duration-200 ${
                                    submitting || !receiptFile
                                        ? "bg-purple-300 text-white cursor-not-allowed"
                                        : "bg-linear-to-r from-purple-700 to-fuchsia-600 text-white hover:from-purple-800 hover:to-fuchsia-700"
                                }`}
                            >
                                {submitting ? "Enviando comprobante..." : "Solicitar Renovación"}
                            </button>

                            <p className="text-xs text-gray-600 mt-3">
                                Al Solicitar renovación tu plan puede ser renovado automáticamente y quedará <b>pendiente de verificación</b>.
                                Si el comprobante es inválido, el plan podria ser cancelado.
                            </p>
                        </div>
                    </div>
                </div>


                {showInvoice && (   
                    <div className="mt-6">
                        <SubscriptionInvoice
                            company={company}
                            admin={admin}
                            plan={plan}
                            paymentReference={paymentReference}
                            paymentMethodLabel="Nequi (manual)"
                            statusLabel="Pendiente de verificación"
                        />
                    </div>
                )}
            </div>
        </>
    );
}