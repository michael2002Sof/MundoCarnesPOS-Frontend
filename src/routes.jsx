import Login from "./pages/login"

import ModuleItems from "./config/modulesItems"

import AppLayout from "./layout"
import Home from "./pages/home"
import CompanyProfile from "./pages/companyProfile"
import Account from "./pages/account"

import ModuleIndex from "./components/shared/moduleIndex"

import Role from "./modules/user/role"
import User from "./modules/user/user"


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
            { path: "/account-sync", element:<Account/> },


            /*========================================================
                RUTAS PARA EL MODULO DE USER
            =========================================================== */
            { path: "/user", element: <ModuleIndex items={ModuleItems["Usuarios"]} title={"Gestión de Usuarios"}/>},
            { path: "/user/role", element: <Role/> },
            { path: "/user/user", element: <User/> },


            /*========================================================
                RUTAS PARA EL MODULO DE VENTAS
            =========================================================== */
            { path: "/sale", element: <ModuleIndex items={ModuleItems["Ventas"]} title={"Gestión de Ventas"}/>},
            { path: "/sale/manage-salepoint", element: <ManageSalePoint/>},
            { path: "/sale/manage-branch", element: <ManageBranch/>},
            { path: "/sale/cash-sale", element: <CashSale/>},
            { path: "/sale/report", element: <ReportSale/>},
            { path: "/sale/credit-note", element: <CreditNote/>},
        ]
    }
]

export default MundoCarnesPosRoutes