// src/components/shared/invoiceQzTry.jsx
import { useEffect, useState } from "react";
import qz from "qz-tray";
import { renderToStaticMarkup } from "react-dom/server";
import { formatDecimal } from "../../utils/formatData";
import QRCode from "react-qr-code";

const setuQz = () => {
    if (qz.security.getCertificate()) {
        console.log("🟢 QZ: El certificado ya estaba configurado.");
        return;
    }

    qz.security.setCertificatePromise((resolve) => {
        console.log("ℹ️ QZ: Cargando certificado en el cliente...");
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

    qz.security.setSignaturePromise((toSign) => {
        console.log("🔑 QZ: Solicitando firma al backend para:", toSign.substring(0, 30) + "...");
        return fetch("https://posinno.luidev02.com/qz/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toSign })
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(r => {
            if (!r.signature) throw new Error("El backend no devolvió la propiedad 'signature'");
            console.log("✅ QZ: Firma recibida con éxito del servidor.");
            return r.signature;
        })
        .catch(err => {
            console.error("❌ QZ Error en setSignaturePromise:", err);
            throw err;
        });
    });
};

// ... (InvoiceDesign se mantiene igual)

export default function InvoicePrinter({ invoice, onFinish }) {
    const [status, setStatus] = useState("Iniciando...");

    useEffect(() => {
        setuQz();
    }, []);

    useEffect(() => {
        if (!invoice) return;

        const printTicket = async () => {
            try {
                console.log("🚀 Iniciando proceso de impresión para factura:", invoice.code);
                
                if (!qz.websocket.isActive()) {
                    console.log("🔌 Intentando conectar con QZ Tray local...");
                    setStatus("Conectando con QZ Tray...");
                    await qz.websocket.connect();
                    console.log("✅ Conectado a QZ Tray.");
                }

                console.log("🔍 Buscando impresora predeterminada...");
                const printerName = await qz.printers.getDefault();
                console.log("🖨️ Impresora detectada:", printerName);
                
                const config = qz.configs.create(printerName, {
                    scaleContent: true,
                    rasterize: true,
                    delay: 0.5,
                    margins: 0,
                    units: 'mm',
                    size: { width: 80 }
                });

                console.log("📄 Renderizando HTML a Static Markup...");
                const invoiceHtml = renderToStaticMarkup(<InvoiceDesign invoice={invoice} />);

                const htmlData = `<html><body>${invoiceHtml}</body></html>`;

                const data = [{
                    type: 'pixel',
                    format: 'html',
                    flavor: 'plain',
                    data: htmlData
                }];

                console.log("📤 Enviando datos de impresión a QZ...");
                setStatus("Enviando a impresora...");
                await qz.print(config, data);
                
                console.log("🎉 Impresión completada con éxito.");
                setStatus("¡Impreso!");
                setTimeout(() => onFinish?.(), 1000);
                
            } catch (err) {
                console.error("💥 FALLO EXTRACCIÓN QZ:", err);
                // Analizamos mensajes específicos
                if (err.message.includes("blocked")) {
                    console.error("🛑 BLOQUEO: QZ Tray local rechazó la conexión. Revisa el Site Manager de QZ Tray.");
                }
                setStatus("Error: " + err.message);
                setTimeout(() => onFinish?.(), 3000);
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