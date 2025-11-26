import Login from "./pages/login"

import ModuleItems from "./config/modulesItems"

import AppLayout from "./layout"

import Home from "./pages/home"
import Profile from "./pages/profile"
import Account from "./pages/account"

import ModuleIndex from "./components/shared/moduleIndex"

import Role from "./modules/user/role"
import User from "./modules/user/user"

import Warehouse from "./modules/inventory/warehouse"

import ManageBranch from "./modules/sale/manageBranch"
import SalePoint from "./modules/sale/salePoint"
import CashSale from "./modules/sale/cashSale"
import ReportSale from "./modules/sale/reportSale"
import Invoices from "./modules/sale/invoices"
import CreditNote from "./modules/sale/creditNote"
import CostCenter from "./modules/sale/cost_center"
import PaymentMethod from "./modules/sale/payment_method"
import InvoiceResolution from "./modules/sale/invoiceResolution"



const MundoCarnesPosRoutes = [
    { path: "/", element: <Login/> },

    { element: <AppLayout/>, 
        children: [
            { path: "/home", element:<Home/> },
            { path: "/profile", element:<Profile/> },
            { path: "/account-sync", element:<Account/> },


            /*========================================================
                RUTAS PARA EL MODULO DE USER
            =========================================================== */
            { path: "/user", element: <ModuleIndex items={ModuleItems["Usuarios"]} title={"Gestión de Usuarios"}/>},
            { path: "/user/role", element: <Role/> },
            { path: "/user/user", element: <User/> },

            /*========================================================
                RUTAS PARA EL MODULO DE INVENTARIO
            =========================================================== */
            { path: "/inventory", element: <ModuleIndex items={ModuleItems["Inventario"]} title={"Gestión de Inventario"}/>},
            { path: "/inventory/warehouse", element: <Warehouse/>},

            /*========================================================
                RUTAS PARA EL MODULO DE VENTAS
            =========================================================== */
            { path: "/sale", element: <ModuleIndex items={ModuleItems["Ventas"]} title={"Gestión de Ventas"}/>},
            { path: "/sale/manage-salepoint", element: <SalePoint/>},
            { path: "/sale/manage-branch", element: <ManageBranch/>},
            { path: "/sale/cash-sale", element: <CashSale/>},
            { path: "/sale/report", element: <ReportSale/>},
            { path: "/sale/invoices", element: <Invoices/>},
            { path: "/sale/credit-note", element: <CreditNote/>},
            { path: "/sale/cost-center", element: <CostCenter/>},
            { path: "/sale/payment-method", element: <PaymentMethod/>},
            { path: "/sale/invoice-resolution", element: <InvoiceResolution/> }
        ]
    }
]

export default MundoCarnesPosRoutes