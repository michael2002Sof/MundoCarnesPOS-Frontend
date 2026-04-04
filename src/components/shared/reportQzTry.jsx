// src/components/shared/invoiceQzTry.jsx
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { formatDecimal } from "../../utils/formatData";
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
  qz.security.setSignatureAlgorithm("SHA512");
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
const ReportDesign = ({ report }) => {
  const {
    id,
    branch_name, sales_point_name,
    opened_by, opened_at, closed_at, closed_by,
    initial_cash, total_cash, total_transfer, total_datafono, 
    subtotal_method, total_return, total_method,
    subtotal, tax0, tax5, tax19, total, totalSales
  } = report;


  return (
    <div style={{ width: "80mm", marginRight: "4mm", fontFamily: "Arial, sans-serif", fontSize: "12px", lineHeight: "1.2", color: "#000" }}>
      
        {/* CABECERA */}
        <header style={{ textAlign: "center", marginBottom: "8px", position: "relative" }}>
            <h2 style={{ fontSize: "13px", fontWeight: "bold", margin: "0" }}>REPORTE DE VENTA</h2>
            
            <h3 style={{ fontSize: "12px", fontWeight: "bold"}}>
            {sales_point_name}
            </h3>
        </header>

        {/* DATOS META */}
        <div style={{ marginBottom: "8px", fontSize: "12px" }}>
            <p style={{ margin: "1px 0" }}><strong>Sucursal:</strong> {branch_name}</p>
            <p style={{ margin: "1px 0" }}><strong>Turno:</strong> {id}</p>
            <p style={{ margin: "1px 0" }}><strong>Abierto Por:</strong> {opened_by}</p>
            <p style={{ margin: "1px 0" }}><strong>Apertura:</strong> {opened_at}</p>
            <p style={{ margin: "1px 0" }}><strong>Cierre:</strong> {closed_at}</p>
            <p style={{ margin: "1px 0" }}><strong>Cerrado Por:</strong> {closed_by}</p>
        </div>

        <div style={{ textAlign: "center", marginBottom: "8px", position: "relative" }}>
            <h2 style={{ fontSize: "11px", fontWeight: "bold", margin: "0" }}>MOVIMINETO DE CAJA</h2>
        </div>
        <div style={{ marginBottom: "8px", paddingTop: "5px" }}>
            <p style={{ margin: "1px 0" }}><strong>Base Inicial:</strong>{formatDecimal(initial_cash, true)}</p>
            <p style={{ margin: "1px 0" }}><strong>Ventas del Dia:</strong> {totalSales}</p>
        </div>


        <div style={{ textAlign: "center", marginBottom: "8px", position: "relative" }}>
            <h2 style={{ fontSize: "11px", fontWeight: "bold", margin: "0" }}>TOTALES POR METODOS DE PAGO</h2>
        </div>
        <div style={{ marginBottom: "8px", paddingTop: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>En Efectivo:</span> <span>{formatDecimal(total_cash, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>En Transferencia:</span> <span>{formatDecimal(total_transfer, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>En Datáfono:</span> <span>{formatDecimal(total_datafono, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Sub Total:</span> <span>{formatDecimal(subtotal_method, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Devoluciones:</span> <span>{formatDecimal(total_return, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "11px", marginTop: "4px" }}>
                <span>Total:</span> <span>{formatDecimal(total_method, true)}</span>
            </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "8px", position: "relative" }}>
            <h2 style={{ fontSize: "11px", fontWeight: "bold", margin: "0" }}>TOTALES GENERALES</h2>
        </div>
        <div style={{ marginBottom: "8px", paddingTop: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Sub Total:</span> <span>{formatDecimal(subtotal, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>IVA 0%:</span> <span>{formatDecimal(tax0, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>IVA 5%:</span> <span>{formatDecimal(tax5, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>IVA 19%:</span> <span>{formatDecimal(tax19, true)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "11px", marginTop: "4px" }}>
                <span>Total:</span> <span>{formatDecimal(total, true)}</span>
            </div>
        </div>

      

      {/* PIE DE PÁGINA Y QR */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <p style={{ fontWeight: "bold", margin: "1px 0" }}>*** Reporte Generado - Mundo Carnes POS ***</p>
        <p style={{ fontSize: "10px", margin: "1px 0" }}>-- Desarrollado por POSinnovate --</p>
      </div>
    </div>
  );
};

// 3. LÓGICA DE IMPRESIÓN
export default function ReportPrinter({ report, onFinish }) {
    const [status, setStatus] = useState("Iniciando...");

    useEffect(() => {
        setuQz();
    }, []);

    useEffect(() => {
        if (!report) return;

        const printTicket = async () => {
            try {
                console.log("🚀 [INICIO]: Intentando imprimir reporte");

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
                const reportHtml = renderToStaticMarkup(<ReportDesign report={report} />);
                const data = [{
                    type: 'pixel',
                    format: 'html',
                    flavor: 'plain',
                    data: `<html><body style="margin:0;">${reportHtml}</body></html>`
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
    }, [report]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#841A1A] mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800">Imprimiendo Reporte</h3>
                <p className="text-gray-500 mt-2">{status}</p>
            </div>
        </div>
    );
}