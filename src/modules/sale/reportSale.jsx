import { useRef, useState, useEffect } from 'react';
import {
  Download,
  DollarSign,
  Target,
  Package
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { ModulesHeader } from '../../components/shared/headers';
import StatsView from '../../components/shared/stats_view';
import axiosInstance from '../../api/axiosintance';
import {formatDateTime, formatDecimal} from "../../utils/formatData"

/* --- Simulación de llamada a backend --- */
const useFetchCashSessions = (fecha) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos una llamada a backend según fecha
    const fetchData = async () => {
      setLoading(true);

      // Aquí iría tu llamada real:
    const res = await axiosInstance.get(`/posinnovate/app/sale/report/sales/date/${fecha}`)
    const mockData = res.data;
    console.log("Sesiones de caja obtenidas:", mockData);

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


/* --- Plantilla para imprimir --- */
/* --- Plantilla de reporte --- */
const ReportTemplate = ({ session }) => {
  if (!session) return null;

  return (
    <div className="font-sans  p-10 bg-white">
      {/* Encabezado */}
      <header className="border-b-4 border-black/30 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Reporte Diario</h1>
          <p className="text-lg font-semibold mt-1">{session.branch_name}</p>
          <p className="text-sm text-gray-600 mt-1">
            Fecha de generación:{" "}
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Reporte Interno</p>
          <p className="text-sm text-gray-500">POS Innovate System</p>
        </div>
      </header>

      {/* Datos de la sesión */}
      <section className="border border-black/30 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-center underline decoration-black/50 underline-offset-4">
          Sesión de Caja #{session.id}
        </h3>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <p><strong>Sucursal:</strong> {session.branch_name}</p>
          <p><strong>Caja:</strong> {session.sales_point_name}</p>
          <p><strong>Vendedor:</strong> {session.opened_by}</p>
          <p><strong>Estado:</strong> {session.status === "in progress" ? "En Progreso" : "Finalizado"}</p>
          <p><strong>Apertura:</strong> {formatDateTime(session.opened_at)}</p>
          <p><strong>Cierre:</strong> {formatDateTime(session.closed_at)}</p>
          <p><strong>Cerrado por:</strong> {session.closed_by || "—"}</p>
        </div>

        <div className="border-t border-black/30 pt-4">
          <h4 className="text-xl font-semibold mb-2 text-center">Movimiento de Caja</h4>
          <p><strong>Base Inicial:</strong> {formatDecimal(session.initial_cash, true)}</p>

          {/* Métodos de pago */}
          <div className="bg-gray-50 rounded-xl py-3 px-4 mt-4 border border-black/20">
            <h5 className="font-bold text-lg mb-2 text-center">Totales por Método de Pago</h5>
            <p><strong>Ingreso en Efectivo:</strong> {formatDecimal(session.total_cash, true)}</p>
            <p><strong>Ingreso en Transferencias:</strong> {formatDecimal(session.total_transfer, true)}</p>
            <p><strong>Sub Total Pagos:</strong>{formatDecimal(session.subtotal_method)}</p>
            <p><strong>Devoluciones:</strong>{formatDecimal(session.total_return, true)}</p>
            <p className="font-bold mt-2 border-t border-[#841A1A]/20 pt-2">
              <strong>Total Métodos de Pago:</strong>{" "}
              {formatDecimal(session.total_method, true)}
            </p>
          </div>

          {/* Totales Generales */}
          <div className="bg-gray-50 rounded-xl py-3 px-4 mt-6 border border-black/20">
            <h5 className="font-bold text-lg mb-2 text-center">Totales Generales</h5>
            <p><strong>Sub Total:</strong> {formatDecimal(session.subtotal, true)}</p>
            <p><strong>Total IVA 0%:</strong> {formatDecimal(session.tax0, true)}</p>
            <p><strong>Total IVA 5%:</strong> {formatDecimal(session.tax5, true)}</p>
            <p><strong>Total IVA 19%:</strong> {formatDecimal(session.tax19, true)}</p>
            <p className="font-bold mt-2 border-t border-black/20 pt-2">
              <strong>Total Ventas:</strong> {formatDecimal(session.total, true)}
            </p>
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="text-center text-xs text-gray-500 mt-10 border-t border-black/20 pt-4">
        <p>© {new Date().getFullYear()} POSInnovate – Reporte generado automáticamente.</p>
      </footer>
    </div>
  );
};



export default function ReportSale() {
  const today = new Date().toISOString().split('T')[0];
  const [filterFechaInicio, setFilterFechaInicio] = useState(today);
  const [selectedLocal, setSelectedLocal] = useState('*');
  const reportRef = useRef();

  // --- Llamada simulada ---
  const { data: sesiones, loading } = useFetchCashSessions(filterFechaInicio);

  // --- Estadísticas base ---
 

  // --- Funciones utilitarias ---
  const formatCurrency = (amount) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Reporte_${selectedLocal}_${filterFechaInicio}`,
  });

  const generarDatosLocal = (local) => {
    setSelectedLocal(local);
    setTimeout(() => handlePrint(), 100);
  };

  // --- Estadísticas globales ---
  const totalVentas = sesiones.reduce((sum, s) => sum + (s.total || 0), 0);
  const promedioVentas = sesiones.length ? totalVentas / sesiones.length : 0;
  const crecimiento = 3.5; // Temporal, se implementará después

  const stats = [
    {
      title: "Total Ventas",
      icon: <DollarSign />,
      valor: formatCurrency(totalVentas),
      color: "bg-[#841A1A] text-white",
    },
    {
      title: "Promedio por Caja",
      icon: <Target />,
      valor: formatCurrency(promedioVentas),
      color: "bg-[#841A1A] text-white",
    },
    {
      title: "Crecimiento",
      icon: <DollarSign />,
      valor: `${crecimiento}%`,
      color: "bg-[#841A1A] text-white",
    },
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
                    <p><span className="font-semibold">Apertura:</span> {formatDateTime(s.opened_at)}</p>
                    <p><span className="font-semibold">Cierre:</span> {formatDateTime(s.closed_at)}</p>
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
                    onClick={() => generarDatosLocal(s)}
                    className="bg-[#841A1A] hover:bg-[#6b1414] transition-colors text-amber-100 px-6 py-2 mt-6 rounded-lg flex items-center shadow-md"
                >
                    <Download className="h-5 w-5 mr-2" />
                    Descargar Reporte
                </button>
                </section>
            ))}
          </div>
        )}
      </div>

        {/* --- Plantilla oculta para imprimir --- */}
        <div style={{ display: 'none' }}>
            <div ref={reportRef}>
                {selectedLocal && (
                <ReportTemplate
                    session={selectedLocal}
                />
                )}
            </div>
        </div>
    </>
  );
}
