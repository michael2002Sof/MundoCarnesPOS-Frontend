import { Boxes, ShoppingCart, Users, UserCog } from "lucide-react"

const Modules = [
    {
        icon: <UserCog/>,
        name: "Usuarios",
        description: "Gestiona los usuarios de tu sistema",
        to: "/user"
    },
    {
        icon: <ShoppingCart/>,
        name: "Ventas",
        description: "Gestiona tus ventas del sistema",
        to: "/sale"
    },
]

export default Modules

