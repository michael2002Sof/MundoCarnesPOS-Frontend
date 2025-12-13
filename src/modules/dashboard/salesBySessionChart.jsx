import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { useMemo } from "react";
import moment from "moment";

export default function SalesBySessionChart({ data = [], from, to }) {

    function getGroupMode(from, to) {
        const days = moment(to).diff(moment(from), "days");

        if (days <= 7) return "day";
        if (days <= 31) return "week";
        return "month";
    }

    const DAYS_ES = {
        Sun: "Dom",
        Mon: "Lun",
        Tue: "Mar",
        Wed: "Mié",
        Thu: "Jue",
        Fri: "Vie",
        Sat: "Sáb"
    };

    function getWeekOfMonth(date) {
        const startOfMonth = date.clone().startOf("month");
        const offset = startOfMonth.day(); // 0 = domingo
        return Math.ceil((date.date() + offset) / 7);
    }


    function groupBarChartData(data, mode) {
        const map = {};

        data.forEach(row => {
            const date = moment(row.period);

            let label;
            if (mode === "day") label = DAYS_ES[date.format("ddd")];
            else if (mode === "week") {
                const weekOfMonth = getWeekOfMonth(date);
                label = `Semana ${weekOfMonth}`;
            }
            else label = date.format("MMM YYYY");

            if (!map[label]) {
                map[label] = { label };
            }

            map[label][row.sale_point] =
                (map[label][row.sale_point] || 0) + Number(row.total_sales);
        });

        return Object.values(map);
    }



    const groupMode = useMemo(
        () => getGroupMode(from, to),
        [from, to]
    );

    const chartData = useMemo(
        () => groupBarChartData(data, groupMode),
        [data, groupMode]
    );

    if (!chartData.length) return null;

    // Detectar puntos de venta dinámicamente
    const salePoints = Object.keys(chartData[0]).filter(k => k !== "label");

    return (
        <div>
            <h3 className="text-lg font-semibold mb-1">
                Ganancias por {
                    groupMode === "day"
                        ? "Día"
                        : groupMode === "week"
                        ? "Semana"
                        : "Mes"
                }
            </h3>

            <p className="text-sm mb-4">
                Comparación por punto de venta
            </p>

            <ResponsiveContainer width="100%" height={360} className="px-3">
                <BarChart data={chartData}  margin={{ top: 20, right: 20, left: 60, bottom: 20 }}>
                    {/* EJE X */}
                    <XAxis dataKey="label" />

                    {/* EJE Y */}
                    <YAxis
                        tickFormatter={v => `$${Number(v).toLocaleString()}`}
                    />

                    <Tooltip
                        formatter={v => `$${Number(v).toLocaleString()}`}
                    />

                    <Legend />

                    {salePoints.map((sp, idx) => (
                        <Bar
                            key={sp}
                            dataKey={sp}
                            barSize={32}
                            fill={idx === 0 ? "#841A1A" : "#c08608"}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
