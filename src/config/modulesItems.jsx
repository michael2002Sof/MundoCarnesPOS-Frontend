import { ShieldUser, ShoppingCart, Receipt, BarChart3, Settings, Store, User, Undo2, Warehouse, CreditCard } from "lucide-react"

const ModuleItems = {
    "Usuarios" : [
        {
            icon: <ShieldUser/>,
            name: "Roles del Sistema",
            to: "/user/role",
            description: "Crea roles en tu sistema, editalos o eliminalos. Estos son importantes para asignarlos a tus usuarios"
        },
        {
            name: 'Usuarios del Sistema',
            description: 'Crea cuentas para nuevos usuarios y asígnales un rol, edita su informaion o eliminalos',
            icon: <User/>,
            to: '/user/user',
        },
    ],
    "Inventario" : [
        {
            icon: <Warehouse />,
            name: "Bodegas",
            to: "/inventory/warehouse",
            description: "Administra bodegas y centros de almacenamiento. Controla existencias, movimientos internos, transferencias y stock disponible en tiempo real.",
        },
    ],

    "Ventas" : [
        {
            icon: <ShoppingCart />,
            name: "Punto de Venta",
            to: "/sale/cash-sale",
            description: "Realiza ventas rápidas con búsqueda de productos por código de barras o báscula. Controla totales, métodos de pago y genera facturas de forma automática. Incluye apertura y cierre de caja.",
        },
        {
            icon: <BarChart3 />,
            name: "Reportes de Ventas",
            to: "/sale/report",
            description: "Analiza ventas por fecha, turno, usuario o punto de venta. Revisa arqueos, cierres y movimientos de caja con detalle de pagos, ingresos y diferencias.",
        },
        {
            icon: <Undo2 />,
            name: "Panel de Devoluciones",
            to: "/sale/credit-note",
            description: "Gestiona notas crédito y devoluciones, ajusta facturas emitidas y actualiza automáticamente inventario y cuentas correspondientes.",
        },
        {
            icon: <Settings />,
            name: "Administrar Puntos de Venta",
            to: "/sale/manage-salepoint",
            description: "Configura puntos de venta, asigna responsables, actualiza su información y controla su estado operativo dentro del sistema.",
        },
        {
            icon: <Store />,
            name: "Administrar Sucursales",
            to: "/sale/manage-branch",
            description: "Crea y gestiona sucursales, actualiza datos generales, administra su estado y organiza la estructura de tu empresa.",
        },
        {
            icon: <Receipt />,
            name: "Centro de Costos",
            to: "/sale/cost-center",
            description: "Crea y administra centros de costos para clasificar gastos, ingresos y operaciones internas. Facilita análisis contables y control presupuestal.",
        },
        {
            icon: <CreditCard />,
            name: "Métodos de Pago",
            to: "/sale/payment-method",
            description: "Crea los métodos de pago disponibles para cada punto de venta. Activa o desactiva opciones como efectivo por caja, transferencias, tarjetas y billeteras digitales según la operación de tu empresa.",
        }

    ]
}

export default ModuleItems