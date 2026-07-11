import { Boxes, ShoppingCart, UserCog, LayoutDashboard, ArrowLeftRight } from "lucide-react"

const Modules = [
    {
        icon: <LayoutDashboard/>,
        name: "Dasboard",
        description: "Mira las estadisticas de tu empresa",
        to: "/dashboard"
    },
    {
        icon: <UserCog/>,
        name: "Usuarios",
        description: "Gestiona los usuarios de tu sistema",
        to: "/user"
    },
    {
        icon: <Boxes/>,
        name: "Inventario",
        description: "Gestiona tu inventario del sistema",
        to: "/inventory"
    },
    {
        icon: <ShoppingCart/>,
        name: "Ventas",
        description: "Gestiona tus ventas del sistema",
        to: "/sale"
    },
    {
        icon: <ArrowLeftRight/>,
        name: "Sincronización",
        description: "Sincroniza información del pos con Siigo",
        to: "/synchronization"
    }
]

export default Modules

