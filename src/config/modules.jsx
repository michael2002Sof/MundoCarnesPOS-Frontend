import { Boxes, ShoppingCart, Users, UserCog } from "lucide-react"

const Modules = [
    {
        icon: <UserCog/>,
        name: "Usuarios",
        description: "Gestiona los usuarios de tu sistema",
        to: "/user"
    },
    {
        icon: <Boxes/>,
        name: "Inventario",
        description: "Gestiona el inventario",
        to: "/inventory"
    },
    {
        icon: <Users/>,
        name: "Clientes",
        description: "Gestiona tus clientes",
        to: "/customer"
    },
    {
        icon: <ShoppingCart/>,
        name: "Ventas",
        description: "Gestiona tus ventas del sistema",
        to: "/sale"
    },
]

export default Modules

