import { useState, useEffect } from 'react';
import { DollarSign, Target, Printer, Wallet, CreditCard } from 'lucide-react';
import { ModulesHeader } from '../../components/shared/headers';
import StatsView from '../../components/shared/stats_view';
import axiosInstance from '../../api/axiosintance';
import {formatDecimal} from "../../utils/formatData"
import DecodeToken from '../../api/decode';
import ReportTemplate from '../../components/shared/reportCashSession';

/* --- Simulación de llamada a backend --- */
const useFetchCashSessions = (fecha) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos una llamada a backend según fecha
    const fetchData = async () => {
      setLoading(true);

      // Aquí iría tu llamada real:
    const token = DecodeToken()
    const company = token.company
    const res = await axiosInstance.get(`/posinnovate/siigo/sale/report/day/${fecha}/${company}`)
    const mockData = res.data;
    //console.log("Sesiones de caja obtenidas:", mockData);

      // Simulamos retraso de carga
      setTimeout(() => {
        setData(mockData);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, [fecha]);

  return { data, loading };
};



export default function ReportSale() {
  const today = new Date().toISOString().split('T')[0];
  const [filterFechaInicio, setFilterFechaInicio] = useState(today);
  const [session, setSession] = useState(null);


  // --- Llamada simulada ---
  const { data: sesiones, loading } = useFetchCashSessions(filterFechaInicio);
  console.log("Sesión seleccionada para reporte:", sesiones);

  // --- Estadísticas base ---
 

  // --- Funciones utilitarias ---
  const formatCurrency = (amount) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);


  // Convertir valores string a número usando Number() o parseFloat()
  const safeNumber = (valor) => Number(valor) || 0;

  // Total de ventas
  const totalVentas = sesiones.reduce((sum, s) => sum + safeNumber(s.total), 0);
  // Promedio de ventas por caja
  const promedioVentas = sesiones.length ? totalVentas / sesiones.length : 0;
  const totalEfectivo = sesiones.reduce( (sum, s) => sum + safeNumber(s.total_cash), 0);
  const totalTransferencias = sesiones.reduce( (sum, s) => sum + safeNumber(s.total_transfer), 0);


  const stats = [
    {
      title: "Total Ventas",
      icon: <DollarSign />,
      valor: formatDecimal(totalVentas, true),
      color: "bg-[#841A1A] text-white",
    },
    {
      title: "Promedio por Caja",
      icon: <Target />,
      valor: formatDecimal(promedioVentas, true),
      color: "bg-[#841A1A] text-white",
    },
    {
      title: "Total en Efectivo",
      icon: <Wallet />,
      valor: formatDecimal(totalEfectivo, true),
      color: "bg-[#841A1A] text-white",
    },
    {
      title: "Total en Transferencias",
      icon: <CreditCard />,
      valor: formatDecimal(totalTransferencias, true),
      color: "bg-[#841A1A] text-white",
    }
  ];

  return (
    <>
      <ModulesHeader
        module={"Reportes de Ventas"}
        description={"Análisis, métricas y tendencias de ventas"}
      />

      <StatsView designStats={stats} />

      {/* Filtro de fecha */}
      <div className="bg-[#841A1A] text-amber-100 container rounded-lg shadow p-6 mb-6">
        <h1 className="text-lg font-semibold">Búsqueda por Fecha</h1>
        <p className="text-xs">Selecciona la fecha de las sesiones de caja</p>
        <input
          type="date"
          className="px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-blue-500"
          value={filterFechaInicio}
          onChange={(e) => setFilterFechaInicio(e.target.value)}
        />
      </div>

      {/* Tabla de sesiones */}
      <div className="bg-[#841A1A] text-amber-100 container rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold  mb-4">
          Sesiones de Caja – {filterFechaInicio}
        </h3>

        {loading ? (
          <p>Cargando sesiones...</p>
        ) : sesiones.length === 0 ? (
          <p>No hay sesiones registradas para esta fecha.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {sesiones.map((s) => (
                <section
                key={s.id}
                className="bg-amber-100 text-[#841A1A] p-6 mb-6 rounded-2xl shadow-md flex flex-col items-center text-center space-y-2 border border-[#841A1A]/30"
                >
                <h1 className="font-bold text-3xl mb-4 tracking-wide">REPORTE DIARIO</h1>

                <div className="w-full max-w-md space-y-2">
                    <p><span className="font-semibold">Sucursal:</span> {s.branch_name}</p>
                    <p><span className="font-semibold">Caja:</span> {s.sales_point_name}</p>
                    <p><span className="font-semibold">Vendedor:</span> {s.opened_by}</p>
                    <p>
                    <span className="font-semibold">Estado:</span>{" "}
                    <span
                        className={`${
                        s.status === "in progress" ? "italic" : "font-semibold"
                        }`}
                    >
                        {s.status === "in progress" ? "En Progreso" : "Finalizado"}
                    </span>
                    </p>
                    <p><span className="font-semibold">Apertura:</span> {s.opened_at || "DD-MM-AA HH:MM"}</p>
                    <p><span className="font-semibold">Cierre:</span> {s.closed_at || "DD-MM-AA HH:MM"}</p>
                    <p><span className="font-semibold">Cerrado por:</span> {s.closed_by || "—"}</p>
                </div>

                {/* --- Sección de movimiento de caja --- */}
                <div className="w-full max-w-md mt-6 border-t border-[#841A1A]/30 pt-4 space-y-3">
                    <h2 className="text-2xl font-semibold mb-2">Movimiento de Caja</h2>
                    <p><span className="font-semibold">Base Inicial:</span> {formatDecimal(s.initial_cash, true)}</p>

                    {/* Totales por métodos de pago */}
                    <div className="bg-[#841A1A]/10 rounded-xl py-3 mt-4 border border-[#841A1A]/20 shadow-sm">
                    <h3 className="font-bold text-xl mb-2">
                        Totales por Método de Pago
                    </h3>
                    <p><span className="font-semibold">Ingreso en Efectivo:</span> {formatDecimal(s.total_cash, true)}</p>
                    <p><span className="font-semibold">Ingreso en Transferencias:</span> {formatDecimal(s.total_transfer, true)}</p>
                    <p><strong>Sub Total Pagos:</strong>{formatDecimal(s.subtotal_method, true)}</p>
                    <p><strong>Devoluciones:</strong>{formatDecimal(s.total_return, true)}</p>
                    <p className="text-lg font-bold mt-2 border-t border-[#841A1A]/20 pt-2">
                        <span className="font-semibold">Total (Efectivo + Transferencias):</span>{" "}
                        {formatDecimal(s.total_method, true)}
                    </p>
                    </div>

                    {/* Totales Generales */}
                    <div className="bg-[#841A1A]/10 rounded-xl py-3 mt-6 border border-[#841A1A]/20 shadow-sm">
                    <h3 className="font-bold text-xl mb-2">
                        Totales Generales
                    </h3>
                    <p><span className="font-semibold">Sub Total:</span> {formatDecimal(s.subtotal, true)}</p>
                    <p><span className="font-semibold">Total IVA 0%:</span> {formatDecimal(s.tax0, true)}</p>
                    <p><span className="font-semibold">Total IVA 5%:</span> {formatDecimal(s.tax5, true)}</p>
                    <p><span className="font-semibold">Total IVA 19%:</span> {formatDecimal(s.tax19, true)}</p>
                    <p className="text-lg font-bold mt-2 border-t border-[#841A1A]/20 pt-2">
                        <span className="font-semibold">Total Ventas:</span>{" "}
                        {formatDecimal(s.total, true)}
                    </p>
                    </div>
                </div>

                <button
                    onClick={() => setSession(s)}
                    className="bg-[#841A1A] hover:bg-[#6b1414] transition-colors text-amber-100 px-6 py-2 mt-6 rounded-lg flex items-center shadow-md"
                >
                    <Printer className="h-5 w-5 mr-2" />
                    Imprimir Reporte
                </button>
                </section>
            ))}
          </div>
        )}
      </div>

      {session && (
        <ReportTemplate session={session} onFinish={() => setSession(null)} />
      )}
    </>
  );
}
