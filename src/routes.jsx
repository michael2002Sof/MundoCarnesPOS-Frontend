import Login from "./pages/login"

import ModuleItems from "./config/modulesItems"
import AppLayout from "./layout"
import Home from "./pages/home"
import CompanyProfile from "./pages/companyProfile"
import ModuleIndex from "./components/shared/moduleIndex"

import ManageRol from "./modules/user/manageRole"
import ManageUser from "./modules/user/manageUser"

import ManageProduct from "./modules/inventory/ManageProduct"

import ManageCustomer from "./modules/customer/manageCustomer"


import ManageBranch from "./modules/sale/manageBranch"
import ManageSalePoint from "./modules/sale/manageSalePoint"
import CashSale from "./modules/sale/cashSale"
import ReportSale from "./modules/sale/reportSale"
import CreditNote from "./modules/sale/creditNote"

const MundoCarnesPosRoutes = [
    { path: "/", element: <Login/> },

    { element: <AppLayout/>, 
        children: [
            { path: "/home", element:<Home/> },
            { path: "/company", element:<CompanyProfile/> },


            /*========================================================
                RUTAS PARA EL MODULO DE USER
            =========================================================== */
            { path: "/user", element: <ModuleIndex items={ModuleItems["Usuarios"]} title={"Gestión de Usuarios"}/>},
            { path: "/user/managerol", element: <ManageRol/> },
            { path: "/user/manage", element: <ManageUser/> },


            /*========================================================
                RUTAS PARA EL MODULO DE INVENTARIO
            =========================================================== */
            { path: "/inventory", element: <ModuleIndex items={ModuleItems["Inventario"]} title={"Gestión de Inventario"}/>},
            { path: "/inventory/manage-product", element: <ManageProduct/> },


            /*========================================================
                RUTAS PARA EL MODULO DE VENTAS
            =========================================================== */
            { path: "/sale", element: <ModuleIndex items={ModuleItems["Ventas"]} title={"Gestión de Ventas"}/>},
            { path: "/sale/manage-salepoint", element: <ManageSalePoint/>},
            { path: "/sale/manage-branch", element: <ManageBranch/>},
            { path: "/sale/cash-sale", element: <CashSale/>},
            { path: "/sale/report", element: <ReportSale/>},
            { path: "/sale/credit-note", element: <CreditNote/>},


            /*========================================================
                RUTAS PARA EL MODULO DE CLIENTES
            =========================================================== */
            { path: "/customer", element: <ModuleIndex items={ModuleItems["Clientes"]} title={"Gestión de Clientes"}/>},
            { path: "/customer/manage", element: <ManageCustomer/> },
        ]
    }
]

export default MundoCarnesPosRoutes