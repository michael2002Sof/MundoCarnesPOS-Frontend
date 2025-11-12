import { ShieldUser, ShoppingCart, Building2, Package, FileText, CreditCard, User } from "lucide-react"

const ModuleItems = {
    "Usuarios" : [
        {
            icon: <ShieldUser/>,
            name: "Administrar Roles del Sistema",
            to: "/user/managerol",
            description: "Crea roles en tu sitema, para asignarlos a tus usuarios"
        },
        {
            name: 'Administrar Usuarios del Sistema',
            description: 'Crea cuentas para nuevos usuarios y asígnales un rol',
            icon: <User/>,
            to: '/user/manage',
        },
    ],
    "Inventario" : [
        {
            icon: <Package/>,
            name: "Registrar Producto",
            to: "/inventory/manage-product",
            description: "Agrega nuevos productos, al inventario de la empresa de forma rápida y organizada"
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
    ],

    "Clientes" : [
        {
            icon: <User/>,
            name: "Administrar Clientes",
            to: "/customer/manage",
            description: "Registra clientes en tu sistema, edita su información o eliminalos. Usalos para generar tus ventas personalizadas"
        }
    ]
}

export default ModuleItems