
import { useEffect } from "react";
import { 
  User2, Mail, Phone, ShieldCheck, BadgeCheck, 
  Building2, MapPin, Globe, Landmark, PhoneCall,
  Server, HardDrive, Users, CalendarDays, DollarSign
} from "lucide-react";


import { ModulesHeader } from "../components/shared/headers";
import {formatDateTime, formatDecimal} from "../utils/formatData"
import useAdmin from "../hooks/admin/useAdmin";
import useCompany from "../hooks/admin/useCompany";
import usePlan from "../hooks/admin/usePlan";

export default function Profile() {
  const {admin, GET_Admin} = useAdmin();
  const {company, GET_Company} = useCompany()
  const {plan, GET_Plan} = usePlan()
  console.log(company)

  useEffect(() => {
    GET_Admin();
    GET_Company()
    GET_Plan()
  }, []);

  return (
    <>
      <ModulesHeader
        module="Perfil de Admin"
        description="Gestiona la información de tu perfil y configura tus preferencias."
      />

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto max-w-7xl 2xl:w-[90%]">

        {/* ADMIN */}
        <section className="bg-[#841A1A] text-amber-100 shadow-xl rounded-2xl p-6 border border-red-900/40 relative overflow-hidden">

          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/20 to-transparent" />

          <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
            <User2 className="w-6 h-6 text-amber-300" />
            Información del Administrador
          </h3>

          <div className="space-y-4 text-sm leading-relaxed">

            <p className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">ID:</strong> {admin.id} en Siigo
            </p>

            <p className="flex items-center gap-2">
              <User2 className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Nombre:</strong> {admin.name}
            </p>

            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Email:</strong> {admin.email}
            </p>

            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Teléfono:</strong> {admin.phone}
            </p>

            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Rol:</strong> {admin.rol}
            </p>

            <p className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-green-300" />
              <strong className="text-amber-300">Estado:</strong> {admin.status}
            </p>

          </div>
        </section>

        {/* COMPANY */}
        <section className="bg-[#841A1A] text-amber-100 shadow-xl rounded-2xl p-6 border border-red-900/40 relative overflow-hidden">

          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/20 to-transparent" />

          <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-amber-300" />
            Información de la Empresa
          </h3>

          <div className="space-y-4 text-sm">

            <p className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Empresa:</strong> {company.name}
            </p>

            <p className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">NIT:</strong> {company.nit}
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Dirección:</strong> {company.address}
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Ciudad:</strong> {company.city}
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Departamento:</strong> {company.department}
            </p>

            <p className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">País:</strong> {company.country}
            </p>

            <p className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Teléfono:</strong> {company.cell}
            </p>

            <p className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-green-300" />
              <strong className="text-amber-300">Estado:</strong> {company.status}
            </p>

            <p className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-300" />
              <strong className="text-amber-300">Dominio:</strong>{" "}
              <a
                href={`https://${company.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-1 text-amber-200 hover:text-white transition"
              >
                {company.domain}
              </a>
            </p>

          </div>
        </section>

        {/* PLAN */}
        <section className="bg-[#841A1A] text-amber-100 shadow-xl rounded-2xl p-6 border border-red-900/40 md:col-span-2 relative overflow-hidden">

          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/20 to-transparent" />

          <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
            <Server className="w-6 h-6 text-amber-500" />
            Plan Contratado
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">

            {[
              { label: "Plan", value: "Básico", icon: Server },
              { label: "Usuarios permitidos", value: `${plan.user_count} / ${plan.user_limit}`, icon: Users },
              { label: "Almacenamiento", value: `${plan.storage_used} KB / ${plan.storage_limit} GB`, icon: HardDrive },
              { label: "Precio", value: formatDecimal(plan.price, true), icon: DollarSign },
              { label: "Ciclo de facturación", value: plan.billing_cycle === "monthly" ? "Mensual" : "Anual", icon: CalendarDays },
              { label: "Inicio del plan", value: formatDateTime(plan.start_date), icon: CalendarDays },
              { label: "Vence", value: formatDateTime(plan.end_date), icon: CalendarDays },
              { label: "Estado", value: plan.status, icon: BadgeCheck }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-4 h-4 text-amber-300" />
                  <p className="font-semibold text-amber-300">{item.label}</p>
                </div>
                <p className="text-sm">{item.value}</p>
              </div>
            ))}

          </div>
        </section>

      </div>
    </>
  );
}
