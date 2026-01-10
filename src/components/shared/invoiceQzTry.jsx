// src/components/shared/invoiceQzTry.jsx
import { useEffect, useState } from "react";
import qz from "qz-tray";
import { renderToStaticMarkup } from "react-dom/server";
import { formatDecimal } from "../../utils/formatData";
import QRCode from "react-qr-code";

// 1. CONFIGURACIÓN DE SEGURIDAD GLOBAL
// Evita que Vercel falle al compilar (SSR) y configura el certificado
if (typeof window !== "undefined") {
  qz.security.setCertificatePromise((resolve) => {
    resolve(
      "-----BEGIN CERTIFICATE-----\n" +
      "MIIDdTCCAl2gAwIBAgIBADANBgkqhkiG9w0BAQsFADBoMQswCQYDVQQGEwJVUzEL\n" +
      "MAkGA1UECAwCTlkxEDAOBgNVBAcMB0NhbmFzdG90YTEVsCoGA1UECgwLUVogSW5k\n" +
      "dXN0cmllczEPMA0GA1UECwwGU3VwcG9ydDEVBzABBgNVBAMMAWxvY2FsaG9zdDAe\n" +
      "Fw0xOTAxMDYxODQzNDBaFw00OTAxMDYxODQzNDBaMGgxCzAJBgNVBAYTAlVTMQsw\n" +
      "CQYDVQQIDAJOWTEQMA4GA1UEBwwHQ2FuYXN0b3RhMRUwKwYDVQQKDBRRWiBJbmR1\n" +
      "c3RyaWVzLCBMTEMxDzANBgNVBAsMBlN1cHBvcnQxFTATBgNVBAMMDCouZm9vLmJh\n" +
      "cjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMTzC1e1S+lJ49Z/n4M0\n" +
      "bKjWq7zYwZ1Z2w7Wb8wT+7Q5WC1m6/O7O2yF0d/0D0c0h5w4/1Z5z6/1Z5z6/1Z5\n" +
      "z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1\n" +
      "Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6\n" +
      "/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5\n" +
      "z68CAwEAAaMhMB8wHQYDVR0OBBYEFN/f2zV1j2/1Z5z6/1Z5z6/1Z5z6MA0GCSqG\n" +
      "SIb3DQEBCwUAA4IBAQBD/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1\n" +
      "Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6\n" +
      "c5w/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/\n" +
      "1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z\n" +
      "6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z\n" +
      "5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/\n" +
      "1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z\n" +
      "6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z\n" +
      "5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/\n" +
      "1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z\n" +
      "6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z\n" +
      "5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/\n" +
      "1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z\n" +
      "6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z5z6/1Z\n" +
      "-----END CERTIFICATE-----\n"
    );
  });

  qz.security.setSignaturePromise((toSign) => {
    return (resolve) => resolve();
  });
}

// 2. DISEÑO DEL TICKET
const InvoiceDesign = ({ invoice }) => {
  const {
    code,
    created_at,
    customerName,
    customerCC,
    customerAddress,
    invoiceItem = [],
    subtotal,
    tax5,
    tax19,
    total,
    receipt_cash,
    receipt_transfer,
    repay,
    cufe,
    // Datos adicionales que vienen en tu resolución/punto de venta
    vendedor 
  } = invoice;

  return (
    <div style={{ width: "72mm", padding: "1mm", fontFamily: "Arial, sans-serif", fontSize: "11px", lineHeight: "1.2", color: "#000" }}>
      
      {/* CABECERA */}
      <header style={{ textAlign: "center", marginBottom: "8px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "bold", margin: "0" }}>MUNDO CARNES SAS</h2>
        <p style={{ margin: "2px 0" }}>NIT: 901586875-0</p>
        <p style={{ margin: "2px 0", fontSize: "10px" }}>CALLE 123 # 45-67 - CÚCUTA</p>
        <p style={{ margin: "2px 0", fontSize: "10px" }}>TEL: 310 000 0000</p>
        
        <div style={{ borderBottom: "1px dashed #000", margin: "5px 0" }}></div>
        
        <h3 style={{ fontSize: "13px", fontWeight: "bold", margin: "5px 0" }}>
          {code}
        </h3>
      </header>

      {/* DATOS CLIENTE */}
      <div style={{ marginBottom: "8px", fontSize: "10px" }}>
        <p style={{ margin: "1px 0" }}><strong>Fecha:</strong> {created_at}</p>
        <p style={{ margin: "1px 0" }}><strong>Cliente:</strong> {customerName || "CONSUMIDOR FINAL"}</p>
        <p style={{ margin: "1px 0" }}><strong>NIT/CC:</strong> {customerCC || "222222222222"}</p>
        <p style={{ margin: "1px 0" }}><strong>Dirección:</strong> {customerAddress || "CÚCUTA"}</p>
        <p style={{ margin: "1px 0" }}><strong>Vendedor:</strong> {vendedor || "CAJA PRINCIPAL"}</p>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #000" }}>
            <th style={{ textAlign: "left", padding: "4px 0" }}>DESCRIPCIÓN</th>
            <th style={{ textAlign: "center", padding: "4px 0" }}>CANT</th>
            <th style={{ textAlign: "right", padding: "4px 0" }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItem.map((it, i) => (
            <tr key={i}>
              <td style={{ padding: "3px 0", verticalAlign: "top" }}>{it.product_name}</td>
              <td style={{ textAlign: "center", verticalAlign: "top" }}>{it.quantity}</td>
              <td style={{ textAlign: "right", verticalAlign: "top" }}>{formatDecimal(it.total, true)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALES */}
      <div style={{ marginTop: "8px", borderTop: "1px dashed #000", paddingTop: "5px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal:</span> <span>{formatDecimal(subtotal, true)}</span>
        </div>
        {tax5 > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>IVA (5%):</span> <span>{formatDecimal(tax5, true)}</span>
          </div>
        )}
        {tax19 > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>IVA (19%):</span> <span>{formatDecimal(tax19, true)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "13px", marginTop: "4px" }}>
          <span>TOTAL A PAGAR:</span> <span>{formatDecimal(total, true)}</span>
        </div>
      </div>

      {/* MEDIOS DE PAGO */}
      <div style={{ marginTop: "8px", border: "1px solid #000", padding: "4px" }}>
        <p style={{ margin: "0 0 2px 0", fontSize: "9px" }}><strong>FORMA DE PAGO:</strong></p>
        {receipt_cash > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
            <span>Efectivo:</span> <span>{formatDecimal(receipt_cash + repay, true)}</span>
          </div>
        )}
        {receipt_transfer > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
            <span>Transferencia:</span> <span>{formatDecimal(receipt_transfer, true)}</span>
          </div>
        )}
        {repay > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold", color: "#000", borderTop: "0.5px solid #ccc", marginTop: "2px" }}>
            <span>SU CAMBIO:</span> <span>{formatDecimal(repay, true)}</span>
          </div>
        )}
      </div>

      {/* PIE DE PÁGINA Y QR */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <div style={{ marginBottom: "8px" }}>
          <QRCode value={cufe || code || "MundoCarnes"} size={90} />
        </div>
        <p style={{ fontSize: "7px", wordBreak: "break-all", color: "#444", margin: "5px 0" }}>
          <strong>CUFE:</strong> {cufe || "PROCESANDO FIRMA ELECTRÓNICA..."}
        </p>
        <p style={{ fontSize: "10px", fontWeight: "bold" }}>*** GRACIAS POR PREFERIRNOS ***</p>
        <p style={{ fontSize: "9px" }}>Desarrollado por TuSoftwarePOS</p>
      </div>
    </div>
  );
};

// 3. LÓGICA DE IMPRESIÓN
export default function InvoicePrinter({ invoice, onFinish }) {
  const [status, setStatus] = useState("Iniciando...");

  useEffect(() => {
    if (!invoice) return;

    const printTicket = async () => {
      try {
        if (!qz.websocket.isActive()) {
          setStatus("Conectando con QZ Tray...");
          await qz.websocket.connect();
        }

        const printerName = await qz.printers.getDefault();
        
        // CONFIGURACIÓN DE IMPRESIÓN (Aquí agregamos rasterize y delay)
        const config = qz.configs.create(printerName, {
          scaleContent: true,
          rasterize: true, // Renderiza como imagen para máxima compatibilidad
          delay: 0.5,      // Espera 500ms para que el QR se genere
          margins: 0,
          units: 'mm',
          size: { width: 80 }
        });

        const invoiceHtml = renderToStaticMarkup(<InvoiceDesign invoice={invoice} />);

        const htmlData = `
          <html>
            <head>
              <style>
                body { margin: 0; padding: 0; }
                * { font-family: sans-serif; }
              </style>
            </head>
            <body>
              ${invoiceHtml}
            </body>
          </html>
        `;

        const data = [{
          type: 'pixel',
          format: 'html',
          flavor: 'plain',
          data: htmlData
        }];

        setStatus("Enviando a impresora...");
        await qz.print(config, data);
        
        setStatus("¡Impreso!");
        setTimeout(() => onFinish?.(), 1000);
        
      } catch (err) {
        console.error("Error QZ:", err);
        setStatus("Error: " + err.message);
        alert("Asegúrate de que QZ Tray esté abierto.");
        onFinish?.(); 
      }
    };

    printTicket();
  }, [invoice, onFinish]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#841A1A] mx-auto mb-4"></div>
        <h3 className="text-xl font-bold text-gray-800">Imprimiendo Factura</h3>
        <p className="text-gray-500 mt-2">{status}</p>
      </div>
    </div>
  );
}