import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { formatDecimal } from "../../utils/formatData";
import QRCode from "react-qr-code";

export default function InvoicePrinter({ invoice, onFinish }) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Factura-${invoice?.code || "Mundo Carnes POS"}`,
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0mm;
      }
      body {
        margin: "0 auto",
        padding: "2mm 4mm 2mm 2mm"
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `,
  });


  useEffect(() => {
  // Esperar un pequeño tiempo para que el DOM esté listo
  const timer = setTimeout(() => {
    if (printRef.current ) {
      handlePrint();

      setTimeout(() => {
        onFinish?.(); // si existe, ejecute
      }, 300);
    }
  }, 50);

  return () => clearTimeout(timer);
}, []);




  if (!invoice) return null;

  const {
    company,
    code,
    nit,
    address,
    city,
    cell,
    caja,
    created_at,
    client,
    cc,
    address_client,
    vendedor,
    invoiceItem = [],
    subtotal,
    tax0,
    tax5,
    tax19,
    total,
    cufe,
    receipt_cash,
    receipt_transfer,
    total_payment,
    repay,
  } = invoice;

  useEffect(() => {
    console.log("Referencia lista:", printRef.current);
  }, []);

  // Detectar los IVAs activos antes del render
  const showIVA0 = invoiceItem.some(it => Number(it.tax5) === 0 && Number(it.tax19) === 0);
  console.log("Mostrar IVA 0%:", showIVA0);
  const showIVA5 = invoiceItem.some(it => Number(it.tax5) > 0);
  const showIVA19 = invoiceItem.some(it => Number(it.tax19) > 0);

  return (
    <div style={{display: "none"}}>
      {/* Contenido que se imprime */}
      <div ref={printRef} className="bg-white  shadow w-full">
        <div
          className=" text-[11px] text-gray-900 font-sans mx-auto"
          style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.4" }}
        >
          <section className="w-full flex justify-center">
          {/* Logo */}
          <img
            src={"/logo_mundocarnes.svg"}
            alt="Logo empresa"
            className="w-16 h-auto mb-2 mt-1 object-contain"
          />
          </section>

          {/* Encabezado */}
          <h2 className="text-[13px] font-bold mb-1 text-center uppercase border-b border-gray-400 pb-1">
            FACTURA DE VENTA
          </h2>

          {/* Datos de empresa */}
          <div className="text-center mb-2">
            <p className="font-semibold text-[12px]">{company}</p>
            <p>NIT: {nit}</p>
            <p>{address}</p>
            <p>{city}</p>
            <p>Tel: {cell}</p>
            <p><strong>Caja:</strong> {caja}</p>
          </div>

          {/* Datos cliente */}
          <div className="w-full border-t border-b border-gray-300 py-1 my-2 text-left">
            <p><strong>Factura N°:</strong> {code}</p>
            <p><strong>Fecha:</strong> {created_at}</p>
            <p><strong>Cliente:</strong> {client || "Consumidor Final"}</p>
            <p><strong>CC/NIT:</strong> {cc || "----"}</p>
            <p><strong>Dirección:</strong> {address_client || "----"}</p>
            <p><strong>Vendedor:</strong> {vendedor}</p>
          </div>

          {/* Tabla productos */}
          <table className="w-full border-collapse my-2 text-[11px]">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-1">Producto</th>
                <th className="text-right py-1 w-10">Cant</th>
                <th className="text-right py-1 w-16">V.Unit</th>
                {showIVA0 && <th className="text-right py-1 w-16">IVA 0%</th>}
                {showIVA5 && <th className="text-right py-1 w-16">IVA 5%</th>}
                {showIVA19 && <th className="text-right py-1 w-16">IVA 19%</th>}
                <th className="text-right py-1 w-16">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItem.map((it, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-0.5">{it.product_name}</td>
                  <td className="text-right">{it.quantity}</td>
                  <td className="text-right">
                    {formatDecimal(it.unit_price, true).toLocaleString("es-CO")}
                  </td>
                  {showIVA0 && (
                    <td className="text-right">
                      {Number(it.tax5) === 0 && Number(it.tax19) === 0 ? "$ 0" : "-"}
                    </td>
                  )}
                  {showIVA5 && (
                    <td className="text-right">
                      {it.tax5 > 0 ? formatDecimal(it.tax5, true) : "-"}
                    </td>
                  )}
                  {showIVA19 && (
                  <td className="text-right">
                    {it.tax19 > 0 ? formatDecimal(it.tax19, true) : "-"}
                  </td>
                  )}
                  <td className="text-right">
                    {formatDecimal(it.total, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totales de pago */}
          <div className="w-full mt-2 border-t border-gray-300 pt-1">
            {receipt_cash > 0 && <p><strong>Recibido en Efectivo:</strong> {formatDecimal(receipt_cash, true)}</p>}
            {receipt_transfer > 0 && <p><strong>Recibido en Trasnferencia:</strong> {formatDecimal(receipt_transfer, true)}</p>}
            <p><strong>Cambio:</strong> {formatDecimal(repay, true)}</p>
            <p><strong>Total pago:</strong> {formatDecimal(total_payment, true)}</p>
          </div>

          {/* Totales */}
          <div className="w-full border-t border-gray-300 pt-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatDecimal(subtotal, true)}</span>
            </div>
            {showIVA0 && (
              <div className="flex justify-between">
                <span>IVA 0%:</span>
                <span>{formatDecimal(tax0, true)}</span>
              </div>
            )}
            {showIVA5 && (
              <div className="flex justify-between">
                <span>IVA 5%:</span>
                <span>{formatDecimal(tax5, true)}</span>
              </div>
            )}
            {showIVA19 > 0 && (
              <div className="flex justify-between">
                <span>IVA 19%:</span>
                <span>{formatDecimal(tax19, true)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-gray-400 mt-1 pt-1 text-[12px]">
              <span>Total:</span>
              <span>{formatDecimal(total, true)}</span>
            </div>
          </div>

          {/* Mensaje final */}
          <p className="text-center font-semibold text-[12px] mt-2">
            ¡Gracias por su compra!
          </p>

          {/* QR PEQUEÑO PARA EL CUFE */}
          <div className="flex flex-col items-center mt-6">
            <QRCode
              value={cufe || "000"}
              size={70}
              style={{ width: "80px", height: "80px" }}
            />
            <p className="text-[10px] mt-1 w-[90%] font-semibold break-all text-center">
              CUFE: {cufe}
            </p>
          </div>

          {/* Nota legal */}
          <p className="text-[12px] mt-2 font-semibold leading-tight text-center">
            Responsable de IVA - Actividad Económica 4723.  
            A esta factura de venta aplican las normas relativas a la letra de cambio  
            (artículo 5 Ley 1231 de 2008).  
            El comprador declara haber recibido real y materialmente las mercancías o  
            servicios descritos en este título - Valor.
          </p>
          <p className="text-[12px] mt-2 font-semibold mb-8 leading-tight text-center">
            Número Autorización Electrónica 18764091224670 aprobado en 20250329 prefijo 
            CMC desde el número 10001 al 20000 Vigencia: 24 Meses.
          </p>
        </div>
      </div>
    </div>
  );
}
