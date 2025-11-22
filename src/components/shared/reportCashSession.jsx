import { formatDecimal } from "../../utils/formatData";

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
          <p className="text-sm text-gray-500">POSInnovate Siigo System</p>
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
          <p><strong>Apertura:</strong> {session.opened_at}</p>
          <p><strong>Cierre:</strong> {session.closed_at}</p>
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
            <p><strong>Sub Total Pagos:</strong>{formatDecimal(session.subtotal_method, true)}</p>
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
        <p>© {new Date().getFullYear()} POSInnovate Siigo – Reporte generado automáticamente.</p>
      </footer>
    </div>
  );
};

export default ReportTemplate;