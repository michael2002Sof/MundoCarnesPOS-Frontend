import { ModulesHeader } from "../components/shared/headers";

export default function Profile() {
  // Datos de ejemplo según tus INSERTS y tablas
  const admin = {
    id: 675,
    name: "Mundo Carnes",
    email: "comercializadoramundocarnessas@gmail.com",
    phone: "3244178590",
    password: "•••••••••••",
    rol: "admin",
    status: "active",
    created_at: "2025-10-10 08:35:00",
  };

  const company = {
    name: "Mundo Carnes SAS",
    nit: "901586875-0",
    address: "LC P1 27 CENABASTOS",
    city: "Cúcuta",
    department: "Norte de Santander",
    country: "Colombia",
    cell: "3135670567",
    status: "active",
    created_at: "2025-10-10 08:40:00",
  };

  const plan = {
    type: "Plan Básico",
    storage_limit: "25 GB",
    storage_used: "3.2 GB",
    user_limit: 5,
    user_count: 3,
    price: "$89.900 COP / mensual",
    billing_cycle: "Mensual",
    start_date: "2025-11-19",
    end_date: "2025-12-19",
    status: "active",
  };

  return (
    <>
      <ModulesHeader
        module="Perfil de Admin"
        description="Gestiona la información de tu perfil y configura tus preferencias."
      />

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ADMIN */}
        <section className="bg-white shadow rounded-xl p-5 border">
          <h3 className="font-bold text-lg mb-3">Información del Administrador</h3>
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {admin.id}</p>
            <p><strong>Nombre:</strong> {admin.name}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Teléfono:</strong> {admin.phone}</p>
            <p><strong>Rol:</strong> {admin.rol}</p>
            <p><strong>Estado:</strong> {admin.status}</p>
            <p><strong>Fecha de registro:</strong> {admin.created_at}</p>
          </div>
        </section>

        {/* COMPANY */}
        <section className="bg-white shadow rounded-xl p-5 border">
          <h3 className="font-bold text-lg mb-3">Información de la Empresa</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Empresa:</strong> {company.name}</p>
            <p><strong>NIT:</strong> {company.nit}</p>
            <p><strong>Dirección:</strong> {company.address}</p>
            <p><strong>Ciudad:</strong> {company.city}</p>
            <p><strong>Departamento:</strong> {company.department}</p>
            <p><strong>País:</strong> {company.country}</p>
            <p><strong>Teléfono:</strong> {company.cell}</p>
            <p><strong>Estado:</strong> {company.status}</p>
          </div>
        </section>

        {/* PLAN */}
        <section className="bg-white shadow rounded-xl p-5 border md:col-span-2">
          <h3 className="font-bold text-lg mb-3">Plan Contratado</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">

            <div>
              <p className="font-semibold">Plan</p>
              <p>{plan.type}</p>
            </div>

            <div>
              <p className="font-semibold">Usuarios permitidos</p>
              <p>{plan.user_count} / {plan.user_limit}</p>
            </div>

            <div>
              <p className="font-semibold">Almacenamiento</p>
              <p>{plan.storage_used} / {plan.storage_limit}</p>
            </div>

            <div>
              <p className="font-semibold">Precio</p>
              <p>{plan.price}</p>
            </div>

            <div>
              <p className="font-semibold">Ciclo de facturación</p>
              <p>{plan.billing_cycle}</p>
            </div>

            <div>
              <p className="font-semibold">Inicio del plan</p>
              <p>{plan.start_date}</p>
            </div>

            <div>
              <p className="font-semibold">Vence</p>
              <p>{plan.end_date}</p>
            </div>

            <div>
              <p className="font-semibold">Estado</p>
              <p>{plan.status}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
