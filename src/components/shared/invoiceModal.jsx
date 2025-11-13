import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { formatDecimal } from "../../utils/formatData";

export default function InvoicePrinter({ invoice, setShowInvoice }) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: `Factura-${invoice?.code || "POS"}`,
  pageStyle: `
    @page {
      size: 80mm auto;
      margin: 4mm;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  `,
});


  if (!invoice) return null;

  const {
    logo,
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
    itemsProduct = [],
    subtotal,
    tax0,
    tax5,
    tax19,
    total,
    method_payment,
    receipt,
    repay,
  } = invoice;

  useEffect(() => {
    console.log("Referencia lista:", printRef.current);
  }, []);

  // Detectar los IVAs activos antes del render
  const showIVA0 = itemsProduct.some(it => it.tax0 === true);
  const showIVA5 = itemsProduct.some(it => it.tax5 > 0);
  const showIVA19 = itemsProduct.some(it => it.tax19 > 0);

  return (
    <div className="flex flex-col items-center bg-amber-50 p-12">
      {/* Contenido que se imprime */}
      <div ref={printRef} className="bg-white p-2 rounded shadow">
        <div
          className="w-[80mm] text-[11px] text-gray-900 font-sans mx-auto flex flex-col items-center justify-center"
          style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.4" }}
        >
          {/* 🏷️ Logo */}
          <img
            src={logo || "/logo_mundocarnes.svg"}
            alt="Logo empresa"
            className="w-16 h-auto mb-2 mt-1 object-contain"
          />

          {/* 🧾 Encabezado */}
          <h2 className="text-[13px] font-bold mb-1 text-center uppercase border-b border-gray-400 pb-1">
            FACTURA DE VENTA
          </h2>

          {/* 🏢 Datos de empresa */}
          <div className="text-center mb-2">
            <p className="font-semibold text-[12px]">{company}</p>
            <p>NIT: {nit}</p>
            <p>{address}</p>
            <p>{city}</p>
            <p>Tel: {cell}</p>
            <p><strong>Caja:</strong> {caja}</p>
          </div>

          {/* 🧍 Datos cliente */}
          <div className="w-full border-t border-b border-gray-300 py-1 my-2 text-left">
            <p><strong>Factura N°:</strong> {code}</p>
            <p><strong>Fecha:</strong> {created_at}</p>
            <p><strong>Cliente:</strong> {client || "Consumidor Final"}</p>
            <p><strong>CC/NIT:</strong> {cc || "----"}</p>
            <p><strong>Dirección:</strong> {address_client || "----"}</p>
            <p><strong>Vendedor:</strong> {vendedor}</p>
          </div>

          {/* 📋 Tabla productos */}
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
              {itemsProduct.map((it, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-0.5">{it.product_name}</td>
                  <td className="text-right">{it.quantity}</td>
                  <td className="text-right">
                    {formatDecimal(it.unit_price, true).toLocaleString("es-CO")}
                  </td>
                  {showIVA0 && (
                    <td className="text-right">
                      {it.tax0 ? "$ 0" : "-"}
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

          {/* 🧮 Totales */}
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

          {/* 💰 Método de pago */}
          <div className="w-full mt-2 border-t border-gray-300 pt-1">
            <p><strong>Método:</strong> {method_payment === "cash" ? "Efectivo" : "Transferencia"}</p>
            <p><strong>Recibido:</strong> {formatDecimal(receipt, true)}</p>
            <p><strong>Cambio:</strong> {formatDecimal(repay, true)}</p>
          </div>

          {/* 🧡 Mensaje final */}
          <p className="text-center font-semibold text-[12px] mt-3">
            ¡Gracias por su compra!
          </p>
          <p className="text-center italic text-[10px] text-gray-500 mt-1">
            -- Factura emitida a través del programa <strong>Siigo</strong> --
          </p>
        </div>
      </div>

      {/* Botones */}
      <section className="flex gap-4 items-center justify-center">
        <button
          onClick={() => setShowInvoice(false)}
          className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          ❌ Cerrar
        </button>

        <button
          onClick={() => handlePrint()}
          className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          🖨️ Imprimir Tirilla
        </button>
      </section>
    </div>
  );
}
