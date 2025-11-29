import { CreditCard, Wallet, Banknote, Calendar, Zap } from 'lucide-react';
import usePlan from '../hooks/admin/usePlan'; // Usa el mismo hook
import { useEffect } from 'react';
import moment from 'moment-timezone';
// Asume que la función de pago por Nequi/Wompi estará aquí o en un hook
// import { initiateNequiPayment } from '../api/payment'; 

export default function PaymentMethodPage() {
    const { plan, GET_Plan } = usePlan(); // Obtener los datos del plan
    useEffect(() => {
        GET_Plan()
    }, [])

    // Opcional: useEffect para asegurar que el plan se cargue si no lo hace AppLayout
    // useEffect(() => { GET_Plan(); }, []); 

    if (!plan || !plan?.price) {
        return <div className="p-8 text-center">Cargando detalles del plan...</div>;
    }
    
    // Formatear el precio y las fechas
    const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(plan?.price);
    const endDate = moment(plan?.end_date).format('DD [de] MMMM [de] YYYY');
    const today = moment().tz("America/Bogota").format("YYYY-MM-DD")
    const daysRemaining = moment(plan?.end_date).diff(moment(today), 'days');

    return (
        <>
            <div className="max-w-7xl 2xl:max-w-[90%] container mx-auto  rounded-xl">
                <h1 className="text-3xl font-bold text-[#841A1A] mb-8 border-b pb-3 flex items-center gap-3">
                    <CreditCard size={32} /> Método de Pago y Renovación
                </h1>

                {/* --- Detalles del Plan Actual --- */}
                <div className="mb-8 p-6 rounded-lg bg-amber-50 border border-amber-300">
                    <h2 className="text-xl font-semibold text-amber-700 mb-4 flex items-center gap-2">
                        <Zap size={20} /> Tu Plan Actual
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <div className="flex justify-between items-center"><span className="font-medium">Costo Total:</span> <span className="text-2xl font-bold text-green-600">{formattedPrice}</span></div>
                        <div className="flex justify-between items-center"><span className="font-medium">Ciclo de Facturación:</span> <span>{plan?.billing_cycle === 'monthly' ? 'Mensual' : 'Anual'}</span></div>
                        <div className="flex justify-between items-center"><span className="font-medium">Fecha de Vencimiento:</span> <span className="flex items-center gap-1"><Calendar size={18}/> {endDate}</span></div>
                        <div className="flex justify-between items-center"><span className="font-medium">Días Restantes:</span> <span className={`font-bold ${daysRemaining <= 5 ? 'text-red-600' : 'text-green-600'}`}>{daysRemaining} días</span></div>
                    </div>
                </div>

                {/* --- Opciones de Pago --- */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Selecciona tu Método de Pago</h2>
                <div className="space-y-6">
                    
                    {/* Opción 1: Nequi (Automático/Wompi) */}
                    <div className="p-5 border-2 border-green-500 rounded-lg bg-green-50 shadow-md">
                        <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-2">
                            <Wallet /> Pago Automatizado con Nequi (¡Recomendado!)
                        </h3>
                        <p className="text-gray-600 mb-4">Usa el sistema de pago seguro para renovar tu plan de forma instantánea.</p>
                        <button 
                            // onClick={() => initiateNequiPayment(plan.price)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200"
                        >
                            Pagar {formattedPrice} con Nequi
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}