// src/components/shared/invoiceQzTry.jsx
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { formatDecimal } from "../../utils/formatData";
import QRCode from "react-qr-code";
import qz from "qz-tray"

import axiosInstance from "../../api/axiosintance";

// Bandera global para evitar re-configurar las promesas
let isQzSecurityConfigured = false;

const setuQz = () => {
    if (isQzSecurityConfigured) return;

    console.log("🛠️ [PASO 1]: Configurando Seguridad QZ (v2.2.5)");

    // Configurar Certificado
    qz.security.setCertificatePromise((resolve) => {
      resolve(`-----BEGIN CERTIFICATE-----
MIID1TCCAr2gAwIBAgIUP3UkWvE5+owVkbOfUCD11KKDrfQwDQYJKoZIhvcNAQEL
BQAwejELMAkGA1UEBhMCQ08xGzAZBgNVBAgMEk5vcnRlIGRlIFNhbnRhbmRlcjEP
MA0GA1UEBwwGQ3VjdXRhMRkwFwYDVQQKDBBNdW5kbyBDYXJuZXMgU0FTMSIwIAYD
VQQDDBltdW5kb2Nhcm5lc3Bvcy52ZXJjZWwuYXBwMB4XDTI2MDExMDE0MTk0NloX
DTM2MDEwODE0MTk0NlowejELMAkGA1UEBhMCQ08xGzAZBgNVBAgMEk5vcnRlIGRl
IFNhbnRhbmRlcjEPMA0GA1UEBwwGQ3VjdXRhMRkwFwYDVQQKDBBNdW5kbyBDYXJu
ZXMgU0FTMSIwIAYDVQQDDBltdW5kb2Nhcm5lc3Bvcy52ZXJjZWwuYXBwMIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArZYLWNqmmuwn2G+G0lAywVsgf0Bm
GPXIIe5mXyWeWc6TcqcxysHS/7OOV76Q307Phmg6tyFh8atTtcKJ9OvGlzvjNgr0
j2a0CPBGYZSjK2XY8RhVCm8sdzS6Akl5Hh4D/4uq1FMzoR467hlos+SyDNGvt0Uc
18zgn/G/KjCHskfknF4gdop7s/qmUTwoobXIuzlsc8ZPD+zfJ5yHZvtrqZSM0v2b
QF1QYWMq6UqBEb0YpAOoiAdGkHNJ0bXpGOrkSFMEaPU8m91HmZvbCtD/HXZ9k/Sd
1YD4INOoMHLP2LN2ZfbLyu0B//kwCI8TjCDRDRAVM8/GS/0jf/ifp4R4uwIDAQAB
o1MwUTAdBgNVHQ4EFgQUWUgBNcDsWDaex6QM2qnQOJd25kIwHwYDVR0jBBgwFoAU
WUgBNcDsWDaex6QM2qnQOJd25kIwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0B
AQsFAAOCAQEAa/xJwPWAEPfzmtvQpOyhr/eKpL5uVcBHhck6gAc2pO4h3qymxp+O
1pZWDFxDf9wDd/OxcKOxvDC+bwgB1CaJ9LmbnYt0/2BklVH9eIxC+k/q0mdEVC23
RUGUd3N8wH5D9y8ylvOV8yGs5OeuHGXyMwVlYsB+IM7jlewQden3+JZxRcLQK+fY
icqrVOQUYYCNnHLBq4+kEpnI2G/x1FCYbQPRD8HKQpUmcAgxshvWdKP+6/1Ab5Cz
2ujLaQlPwWStTEKsebXeLRFYgAj4LeEPFBWBM70ISvNu5LlBZv51aNDd8zT8i/DM
QPaP+tXAMtcm5OQtiVuURG916Gu5QmHXRg==
-----END CERTIFICATE-----`);
    });

    console.log("ℹ️ [PASO 2]: Entregando certificado público al cliente");

  // Configurar Firma
  qz.security.setSignaturePromise(async (toSign) => {
    const res = await axiosInstance.post("/posinnovate/siigo/qz/sign", { toSign })
      .then(signature => {
        console.log(signature)
        return String(signature).trim();
      })
    return res;
  });

  isQzSecurityConfigured = true;
};

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
    <div style={{ width: "80mm", padding: "2mm", fontFamily: "Arial, sans-serif", fontSize: "11px", lineHeight: "1.2", color: "#000" }}>
      
      {/* CABECERA */}
      <header style={{ textAlign: "center", marginBottom: "8px" }}>
        <img src="https://mundocarnespos.vercel.app/logo_mundocarnes.svg" style={{ width: "40mm", bottom: "2px" }} />
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
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "11px", marginTop: "4px" }}>
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
        <p style={{ fontSize: "7px", wordBreak: "break-all", margin: "5px 0" }}>
          <strong>CUFE:</strong> {cufe || "PROCESANDO FIRMA ELECTRÓNICA..."}
        </p>
        <p style={{ fontSize: "10px", fontWeight: "bold" }}>*** GRACIAS POR PREFERIRNOS ***</p>
        <p style={{ fontSize: "9px" }}>Desarrollado por POSinnovate</p>
      </div>
    </div>
  );
};

// 3. LÓGICA DE IMPRESIÓN
export default function InvoicePrinter({ invoice, onFinish }) {
    const [status, setStatus] = useState("Iniciando...");

    useEffect(() => {
        setuQz();
    }, []);

    useEffect(() => {
        if (!invoice) return;

        const printTicket = async () => {
            try {
                console.log("🚀 [INICIO]: Intentando imprimir factura", invoice.code);

                // Conectar Socket
                if (!qz.websocket.isActive()) {
                    console.log("🔌 [SOCKET]: No activo, conectando...");
                    setStatus("Conectando con QZ Tray...");
                    await qz.websocket.connect();
                    console.log("🔌 [SOCKET]: Conectado con éxito.");
                }

                // Obtener Impresora
                console.log("🔍 [IMPRESORA]: Buscando impresora predeterminada...");
                const printerName = await qz.printers.getDefault();
                console.log("🖨️ [IMPRESORA]: Usando:", printerName);

                const config = qz.configs.create(printerName, {
                    rasterize: true,
                    delay: 500,
                    size: { width: 80 },
                    units: 'mm'
                });

                // Preparar HTML
                const invoiceHtml = renderToStaticMarkup(<InvoiceDesign invoice={invoice} />);
                const data = [{
                    type: 'pixel',
                    format: 'html',
                    flavor: 'plain',
                    data: `<html><body style="margin:0;">${invoiceHtml}</body></html>`
                }];

                console.log("📤 [ENVÍO]: Enviando datos a QZ Tray...");
                setStatus("Enviando a impresora...");
                await qz.print(config, data);
                
                console.log("🎉 [ÉXITO]: Impresión enviada.");
                setStatus("¡Impreso!");
                setTimeout(() => onFinish?.(), 1500);

            } catch (err) {
                console.error("💥 [FALLO]:", err);
                
                // Mensaje amigable para errores comunes
                let friendlyError = err.message;
                if (err.message.includes("Connection blocked")) {
                    friendlyError = "Bloqueado por QZ Tray (Configura Allowed Sites)";
                } else if (err.message.includes("Could not find printer")) {
                    friendlyError = "No se encontró la impresora predeterminada";
                }

                setStatus("Error: " + friendlyError);
                setTimeout(() => onFinish?.(), 4000);
            }
        };

        printTicket();
    }, [invoice]);

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