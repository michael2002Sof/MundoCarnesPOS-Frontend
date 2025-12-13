import { DollarSign, Loader } from "lucide-react";
import { ModulesHeader } from "../../components/shared/headers";
import StatsView from "../../components/shared/stats_view";
import useReport from "../../hooks/sale/useReport";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import SalesBySessionChart from "./salesBySessionChart";
import {formatDecimal} from "../../utils/formatData"

export default function Dashboard() {
    const { sessionStatic, GET_SessionStatic, loading } = useReport();
    console.log(sessionStatic)

    const [from, setFrom] = useState(
        moment().startOf("month").format("YYYY-MM-DD")
    );
    const [to, setTo] = useState(
        moment().endOf("month").format("YYYY-MM-DD")
    );
    useEffect(() => {
        GET_SessionStatic(from, to);
    }, []);

    const totalGanancias = sessionStatic.reduce((sum, s) => sum + Number(s.total_sales), 0);
    const totalEfectivo = sessionStatic.reduce((sum, s) => sum + Number(s.total_cash), 0);
    const totalTransfer = sessionStatic.reduce((sum, s) => sum + Number(s.total_transfer), 0);
    const totalVentas = sessionStatic.reduce((sum, s) => sum + Number(s.total_invoices), 0);

    const stats = [
        {
            icon: <DollarSign />,
            title: "Ganancias",
            valor: formatDecimal(totalGanancias, true),
            color: "bg-[#841A1A] text-amber-100"
        },
        {
            icon: <DollarSign />,
            title: "Efecivo",
            valor: formatDecimal(totalEfectivo, true),
            color: "bg-[#841A1A] text-amber-100"
        },
        {
            icon: <DollarSign />,
            title: "Transferencias",
            valor: formatDecimal(totalTransfer, true),
            color: "bg-[#841A1A] text-amber-100"
        },
        {
            icon: <DollarSign />,
            title: "Ventas",
            valor: totalVentas,
            color: "bg-[#841A1A] text-amber-100"
        }
    ]

    return (
        <>
            <ModulesHeader
                module="Informe General"
                description="Mira las estadísticas de tu empresa en ganancias y ventas"
            />

            <section className="container mx-auto max-w-7xl 2xl:max-w-[90%] space-y-6">

                {/* Filtros */}
                <div className="bg-[#841A1A] text-amber-100  rounded-xl shadow p-6 flex justify-between gap-4 items-end">
                    <div className="flex gap-4">
                        <section className="flex flex-col">
                            <label className="text-sm font-semibold">Desde</label>
                            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="rounded-md outline-none border-b cursor-pointer py-2"/>
                        </section>

                        <section className="flex flex-col">
                            <label className="text-sm font-semibold">Hasta</label>
                            <input type="date" value={to} onChange={e => setTo(e.target.value)} className="rounded-md outline-none border-b cursor-pointer py-2"/>
                        </section>
                    </div>

                    <button onClick={() => GET_SessionStatic(from, to)} className="bg-amber-200 text-[#841A1A] px-4 py-2 rounded-md cursor-pointer font-semibold">
                        {loading ? (
                            <div className="flex gap-2 items-center">
                                <Loader/>
                                <p>Cargando Informe...</p>
                            </div>
                        ) : (
                            <p> Generar informe</p>
                        )}
                    </button>
                </div>

                {/* Stats */}
                <StatsView designStats={stats}/>

                {/* Gráfica principal */}
                <SalesBySessionChart data={sessionStatic} from={from} to={to} />

            </section>
        </>
    );
}
