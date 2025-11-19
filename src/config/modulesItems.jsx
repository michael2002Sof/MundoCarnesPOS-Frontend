import { ShieldUser, ShoppingCart, Building2, Package, FileText, CreditCard, User } from "lucide-react"

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
    "Ventas" : [
        {
            icon: <ShoppingCart />,
            name: "Punto de Venta",
            to: "/sale/cash-sale",
            description: "Procesa ventas rápidas con integración de productos, control de totales y emisión instantánea de facturas. Administra de forma sencilla la apertura y cierre de caja durante la jornada.",
        },
        {
            icon: <FileText />,
            name: "Reportes de Ventas",
            to: "/sale/report",
            description: "Consulta reportes detallados de ventas por turno o usuario. Realiza arqueos y cierres de caja con control de efectivo, pagos electrónicos y totales generados.",
        },
        {
            icon: <CreditCard />,
            name: "Administrar Punto de Ventas",
            to: "/sale/manage-salepoint",
            description: "Crea nuevos puntos de venta en tu sistema, asignalos a usuarios y gestiona su informacion, visualiza sus estados, edita su informacion o eliminalos del sistema",
        },
        {
            icon: <Building2 />,
            name: "Administrar Sucursales",
            to: "/sale/manage-branch",
            description: "Crea nuevas sucursales en tu sistema y gestiona su informacion, edita su informacion o eliminalas del sistema",
        },
        {
            icon: <Building2 />,
            name: "Panel de Devoluciones",
            to: "/sale/credit-note",
            description: "Modifica las facturas, y actualiza la informacion de tus cuentas al hacer devoluciones",
        },
    ]
}

export default ModuleItems