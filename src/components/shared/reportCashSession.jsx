import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

import { formatDecimal } from "../../utils/formatData";

const ReportTemplate = ({ session, onFinish }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Reporte-Caja-${session?.sales_point_name || "Mundo Carnes POS"}`,
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 1mm;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `,
  });
  useEffect(() => {
    // Esperar un pequeño tiempo para que el DOM esté listo
    const timer = setTimeout(() => {
      if (printRef.current) {
        handlePrint();

        setTimeout(() => {
          onFinish?.(); // si existe, ejecute
        }, 300);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!session) return null;

  const {
    id, branch_name, sales_point_name, opened_by, opened_at, closed_at, closed_by,
    initial_cash, total_cash, total_transfer, subtotal_method, total_return, total_method,
    subtotal, tax0, tax5, tax19, total, totalSales
  } = session;

  return (
    <div style={{display: "none"}}>
      {/* Encabezado */}
      <section ref={printRef} className="w-full pr-6">
        <header className=" w-full flex flex-col items-center mb-4 ">
          <h3 className="font-bold tracking-wide">Reporte Diario</h3>
          <h2 className="font-semibold tracking-wide">{sales_point_name}</h2>
          <div className="flex justify-between items-center w-full mt-2 text-[12px]">
            <section className="font-semibold text-left">
              <p>Sucursal: </p>
              <p># Turno: </p>
              <p>Abierto por: </p>
              <p>Apertura:</p>
              <p>Cierre:</p>
              <p>Cerrado por:</p>
            </section>
            <section className="text-right">
              <p>{branch_name}</p>
              <p>{id}</p>
              <p>{opened_by}</p>
              <p>{opened_at}</p>
              <p>{closed_at}</p>
              <p>{closed_by || "—"}</p>
            </section>
          </div>
        </header>


        {/* Datos de la sesión */}
        <main className=" mb-4 ">
          <h3 className="font-semibold text-center mb-2 ">Movimiento de Caja</h3>
          <p className="text-[12px]"><span className="font-semibold">Base Inicial: </span> {formatDecimal(initial_cash, true)}</p>
          <p className="text-[12px]"><span className="font-semibold">Ventas del Día: </span> {totalSales}</p>
          <h2 className="font-semibold text-center mt-2">Totales por Método de Pago</h2>
          <div className="flex justify-between items-center text-[12px] w-full">
            <section className="font-semibold text-left">
              <p>En efectivo: </p>
              <p>En transferencias:</p>
              <p>Sub total pagos:</p>
              <p>Devoluciones: </p>
              <p>Total Pagos:</p>

            </section>
            <section className="text-right">
              <p>{formatDecimal(total_cash, true)}</p>
              <p>{formatDecimal(total_transfer, true)}</p>
              <p>{formatDecimal(subtotal_method, true)}</p>
              <p>{formatDecimal(total_return, true)}</p>
              <p>{formatDecimal(total_method, true)}</p>
            </section>

          </div>

          <h3 className="font-semibold text-center mt-4">Totales Generales</h3>
          <div className="flex justify-between items-center text-[12px] w-full">
            <section className="font-semibold text-left">
              <p>Sub total: </p>
              <p>Iva 0%:</p>
              <p>Iva 5%: </p>
              <p>Iva 19%:</p>
              <p>Total Ventas:</p>
            </section>
            <section className="text-right">
              <p>{formatDecimal(subtotal, true)}</p>
              <p>{formatDecimal(tax0, true)}</p>
              <p>{formatDecimal(tax5, true)}</p>
              <p>{formatDecimal(tax19, true)}</p>
              <p>{formatDecimal(total, true)}</p>
            </section>

          </div>
        </main>

        {/* Pie de página */}
        <footer className="text-center text-[10px] mt-10 ">
          <p>Mundo Carnes POS</p>
          <p>© {new Date().getFullYear()} POSInnovate Siigo – Reporte generado</p>
        </footer>
      </section>
    </div>
  );
};

export default ReportTemplate;