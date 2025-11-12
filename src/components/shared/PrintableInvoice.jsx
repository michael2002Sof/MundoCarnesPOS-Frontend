// src/components/point_sales/PrintableInvoice.jsx
import React from "react";

const PrintableInvoice = ({ invoice }) => {
  if (!invoice) return null;

  const {
    logo,
    company,
    code,
    nit,
    address,
    city,
    cell,
    id,
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

  return (
    <div
      className="w-[80mm] text-[11px] text-gray-900 font-sans mx-auto min-h-screen flex flex-col items-center justify-center"
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.4",
      }}
    >
      {/* 🏷️ Logo */}
      <img
        src={logo || "/logo_mundocarnes.svg"}
        alt="Logo empresa"
        className="w-28 h-auto mb-2 mt-1 object-contain"
      />


      {/* 🧾 Encabezado */}
      <h2 className="text-[13px] font-bold mb-1 text-center uppercase border-b border-gray-400 pb-1">
        FACTURA DE VENTA
      </h2>
      <p className="text-center text-[10px] mb-2">No {code}</p>

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
        <p><strong>Factura N°:</strong> {id}</p>
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
            <th className="text-right py-1 w-16">Total</th>
          </tr>
        </thead>
        <tbody>
          {itemsProduct.map((it, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="py-0.5">{it.product_name}</td>
              <td className="text-right">{it.quantity}</td>
              <td className="text-right">
                {Number(it.unit_price).toLocaleString("es-CO")}
              </td>
              <td className="text-right">
                {Number(it.total).toLocaleString("es-CO")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🧮 Totales */}
      <div className="w-full border-t border-gray-300 pt-1 text-[11px]">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{Number(subtotal).toLocaleString("es-CO")}</span>
        </div>
        {tax0 > 0 && (
          <div className="flex justify-between">
            <span>IVA 0%:</span>
            <span>{Number(tax0).toLocaleString("es-CO")}</span>
          </div>
        )}
        {tax5 > 0 && (
          <div className="flex justify-between">
            <span>IVA 5%:</span>
            <span>{Number(tax5).toLocaleString("es-CO")}</span>
          </div>
        )}
        {tax19 > 0 && (
          <div className="flex justify-between">
            <span>IVA 19%:</span>
            <span>{Number(tax19).toLocaleString("es-CO")}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t border-gray-400 mt-1 pt-1 text-[12px]">
          <span>Total:</span>
          <span>{Number(total).toLocaleString("es-CO")}</span>
        </div>
      </div>

      {/* 💰 Métodos de pago */}
      <div className="w-full mt-2 border-t border-gray-300 pt-1">
        <p><strong>Método:</strong> {method_payment === "cash" ? "Efectivo" : "Transferencia"}</p>
        <p><strong>Recibido:</strong> {Number(receipt).toLocaleString("es-CO")}</p>
        <p><strong>Cambio:</strong> {Number(repay).toLocaleString("es-CO")}</p>
      </div>

      {/* 🧡 Mensaje final */}
      <p className="text-center font-semibold text-[12px] mt-3">
        ¡Gracias por su compra!
      </p>
      <p className="text-center italic text-[10px] text-gray-500 mt-1">
        -- Factura emitida a través del programa <strong>Siigo</strong> --
      </p>
    </div>
  );
};

export default PrintableInvoice;
