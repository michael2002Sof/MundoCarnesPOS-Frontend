  import { useMemo, useRef } from "react";
  import { useReactToPrint } from "react-to-print";
  import QRCode from "react-qr-code";
  import moment from "moment-timezone";
  import { formatDecimal } from "../../utils/formatData";

  export default function SubscriptionInvoice({
    company,
    admin,
    plan,
    paymentReference,
    paymentMethodLabel = "Nequi (manual)",
    statusLabel = "Pendiente de verificación",
    renewalDates,
  }) {
    const printRef = useRef();

    const issueDate = useMemo(() => {
      return moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm");
    }, []);

    const formattedTotal = useMemo(() => {
      return formatDecimal(Number(plan?.price ?? 0), true);
    }, [plan?.price]);

    const planCycleLabel = plan?.billing_cycle === "monthly" ? "Mensual" : "Anual";
    const periodLabel = useMemo(() => {
      const start = renewalDates?.start_date || plan?.start_date || "—";
      const end = renewalDates?.end_date || plan?.end_date || "—";
      return `${start} a ${end}`;
    }, [renewalDates?.start_date, renewalDates?.end_date, plan?.start_date, plan?.end_date]);

    const handlePrint = useReactToPrint({
      contentRef: printRef,
      documentTitle: `Factura-Plan-${paymentReference || "POSinnovate"}`,
      pageStyle: `
        @page { size: A4; margin: 14mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `,
    });

    return (
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between gap-4 bg-gray-50 border-b">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Factura de renovación</h3>
            <p className="text-sm text-gray-600">Guárdala como PDF desde imprimir</p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl font-bold text-white bg-[#841A1A] hover:opacity-95"
          >
            Imprimir / Guardar PDF
          </button>
        </div>

        <div className="p-6">
          <div ref={printRef} className="bg-white">
            <header className="flex items-start justify-between gap-6 border-b pb-4">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block">
                  <QRCode value={paymentReference || "POSinnovate"} size={64} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Emisor</p>
                  <p className="text-xl font-extrabold text-gray-900">POSinnovate</p>
                  <p className="text-sm text-gray-700">Suscripción MundoCarnesPOS</p>
                  <p className="text-sm text-gray-700">Correo: posinovate@gmail.com</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-600">Referencia</p>
                <p className="font-mono font-bold text-gray-900 break-all">{paymentReference}</p>
                <p className="mt-2 text-xs text-gray-600">Fecha de emisión</p>
                <p className="text-sm font-semibold text-gray-900">{issueDate}</p>
              </div>
            </header>

            <section className="grid md:grid-cols-2 gap-4 py-4">
              <div className="rounded-xl border p-4">
                <p className="text-sm font-bold text-gray-900">Facturado a</p>
                <p className="mt-2 text-sm text-gray-700"><span className="font-semibold">Empresa:</span> {company?.name || "—"}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">NIT:</span> {company?.nit || "—"}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Dirección:</span> {company?.address || "—"}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Ciudad:</span> {company?.city || "—"}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Teléfono:</span> {company?.cell || "—"}</p>
                {company?.domain && (
                  <p className="text-sm text-gray-700"><span className="font-semibold">Dominio:</span> {company.domain}</p>
                )}
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm font-bold text-gray-900">Contacto</p>
                <p className="mt-2 text-sm text-gray-700"><span className="font-semibold">Administrador:</span> {admin?.name || "—"}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> {admin?.email || "—"}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Teléfono:</span> {admin?.phone || "—"}</p>
                <p className="mt-3 text-sm text-gray-700"><span className="font-semibold">Método de pago:</span> {paymentMethodLabel}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Estado:</span> {statusLabel}</p>
                {renewalDates?.notice_date && (
                  <p className="text-sm text-gray-700"><span className="font-semibold">Aviso:</span> {renewalDates.notice_date}</p>
                )}
              </div>
            </section>

            <section className="border rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b">
                <p className="font-bold text-gray-900">Detalle</p>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="px-4 py-2">Concepto</th>
                    <th className="px-4 py-2">Ciclo</th>
                    <th className="px-4 py-2">Periodo</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2">
                      <p className="font-semibold text-gray-900">Suscripción {plan?.name ? `- ${plan.name}` : ""}</p>
                      <p className="text-xs text-gray-600">Renovación de acceso al software</p>
                    </td>
                    <td className="px-4 py-2">{planCycleLabel}</td>
                    <td className="px-4 py-2">{periodLabel}</td>
                    <td className="px-4 py-2 text-right font-bold">{formattedTotal}</td>
                  </tr>
                </tbody>
              </table>

              <div className="px-4 py-4 flex justify-end">
                <div className="w-full max-w-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formattedTotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-semibold text-gray-900">$ 0</span>
                  </div>
                  <div className="flex items-center justify-between text-base mt-3 pt-3 border-t">
                    <span className="font-extrabold text-gray-900">Total</span>
                    <span className="font-extrabold text-gray-900">{formattedTotal}</span>
                  </div>
                </div>
              </div>
            </section>

            <footer className="mt-6 text-xs text-gray-600">
              <p className="font-semibold text-gray-900">Notas</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Esta factura corresponde a la renovación de la suscripción del software.</li>
                <li>El pago se valida con el comprobante enviado por el cliente.</li>
                <li>Si el comprobante es inválido, el plan podrá ser cancelado.</li>
              </ul>
            </footer>
          </div>
        </div>
      </div>
    );
  }
