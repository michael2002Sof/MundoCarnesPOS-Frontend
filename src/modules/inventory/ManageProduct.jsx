import { useState } from "react"
import { Package, Save, ScanLine, DollarSign, X, Edit, Trash2, CheckCircle, Loader2 } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import DecodeToken from "../../api/decode"
import handleInputChange from "../../utils/handleInputChange"
import usePersistentResponse from "../../utils/response_message"
import {GetAllProducts} from "../../hooks/products"
import axiosInstance from "../../api/axiosintance"
import { formatDecimal } from "../../utils/formatData"

export default function ManageProduct () {
    const token = DecodeToken()
    const {products, FetchProducts} = GetAllProducts()
    console.log(products)
    const [isLoading, setLoading] = useState(false)
    const [isAction, setAction] = useState("Manage Product")
    const [isTax, setTax] = useState(true)
    /* -- Datos de envio del Producto -- */
    const initialBaseProduct = {
        id: null,
        company: token.company,
        name: "",
        barcode: "",
        stock: 0,
        min_stock: 0,
        base_price: 0,
        tax0: true,
        tax5: 0,
        tax19: 0,
        sale_price: 0,
        unit_mesurement: "",
        category: "",
    };
    const [isProduct, setProduct] = useState(initialBaseProduct) //Informacion del producto
    /* -- Envio de Formulario al backend -- */
    const handleSubmitProduct = async (e) => {
        e.preventDefault()
        setLoading(true)
        let Tax5
        let Tax19
        let Tax0
        let salePrice
        /* -- Calcular precio de impuesto del producto y su precio final-- */
        if (isTax === 5) { 
            Tax5 = isProduct.base_price * 0.05  
            Tax0 = false
            salePrice = Tax5 + Number(isProduct.base_price)
        } else if (isTax === 19) {
            Tax19 = isProduct.base_price * 0.19 
            Tax0 = false
            salePrice = Tax19 + Number(isProduct.base_price)
        } else {
            Tax0 = true
            salePrice = isProduct.base_price
        }

        /* -- Completar datos de envio -- */
        const data = { ...isProduct, tax0: Tax0, tax5: Tax5, tax19: Tax19, sale_price: salePrice}
        let res

        try {
            if (isProduct.id) {
                res = await axiosInstance.put("/posinnovate/app/inventory/product/update", data)
            } else {
                console.log(data)
                res = await axiosInstance.post("/posinnovate/app/inventory/product/register", data)
            }
            setProduct(initialBaseProduct)
            usePersistentResponse(res)
        } catch (error) {
            usePersistentResponse(error)
        } finally {
            setLoading(false)
            FetchProducts()
        }
    }

    const deleteProduct = async (id) => {
        try {
        const res = await axiosInstance.delete(`/posinnovate/app/inventory/product/delete/${id}`)
        FetchProducts()
        usePersistentResponse(res)
        } catch (error) {
        usePersistentResponse(error)
        }
        setConfirmDelete({ open: false, id: null })
    }
  

    return (
        <>
            <ModulesHeader
                module={"Administrar Produtos"}
                description={"Registra, actualiza y elimina productos de tu inventario"}
            />

            <section className="container mx-auto max-w-6xl">
                {/* -- Pestañas principales -- */}
                <div className="border-b mb-4 text-[#841A1A]">
                    <button onClick={() => setAction("Manage Product")} className={`px-4 py-2 cursor-pointer ${isAction === "Manage Product" && "border-b-4 font-semibold"}`}>
                        Productos del Sistema
                    </button>
                    <button onClick={() => setAction("Product Input")} className={`px-4 py-2 cursor-pointer ${isAction === "Product Input" && "border-b-4 font-semibold"}`}>
                        {isProduct.id ? "Editar Producto" : "Registrar Producto"}
                    </button>
                </div>
                {/*=================================================================
                    MOSTRAR PRODUCTOS DEL SISTEMA
                ====================================================================*/}
                {isAction === "Manage Product" && (
                    <div className="overflow-x-auto w-full ">
                        <table className="w-full">
                            <thead className="rounded-2xl">
                                <tr className="bg-[#841A1A] text-white">
                                    <th className="px-4 py-3 text-left text-nowrap">Nombre</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Codigo SKU</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Stock</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Stock Minimo</th>
                                    <th className="px-4 py-3 text-left text-nowrap">IVA 0%</th>
                                    <th className="px-4 py-3 text-left text-nowrap">IVA 5%</th>
                                    <th className="px-4 py-3 text-left text-nowrap">IVA 19%</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Precio/Unidad</th>
                                    <th className="px-4 py-3 text-left text-nowrap">Unidad de Medida</th>
                                    <th className="px-4 py-3 text-center text-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center p-6">No hay Productos Registrados</td>
                                    </tr>
                                ) : (
                                    <>
                                        {products?.map((p) => (
                                            <tr key={p.id} className="p-2 text-nowrap">
                                                <td className="p-4">
                                                    <p className="overflow-hidden text-ellipsis  text-nowrap ">
                                                        {p.name}
                                                    </p>
                                                </td>
                                                <td className="p-4">{p.barcode}</td>
                                                <td className="p-4">{formatDecimal(p.stock)}</td>
                                                <td className="p-4">{formatDecimal(p.min_stock)}</td>
                                                <td className="p-4">{p.tax0 === 1 ? <CheckCircle className="text-green-500"/> : <X className="text-red-500"/>}</td>
                                                <td className="p-4">{p.tax5 > 0 ? <>{formatDecimal(p.tax5, true)}</> :  <X className="text-red-500"/>} </td>
                                                <td className="p-4">{p.tax19 > 0 ? <>{formatDecimal(p.taxt19, true)}</> :  <X className="text-red-500"/>}</td>
                                                <td className="p-4">{formatDecimal(p.base_price, true)}</td>
                                                <td className="p-4">{p.unit_mesurement}</td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-3">
                                                    <button className={``}>
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => setConfirmDelete({ open: true, id: p.id })} className={``}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            
                            </tbody>
                        </table>
                    </div>
                )}
                {/*=================================================================
                    REGISTRAR / ACTUALIZAR PRODUCTOS
                ====================================================================*/}
                {isAction === "Product Input" && (
                    <form onSubmit={handleSubmitProduct} className="bg-[#841A1A] text-white p-12 rounded-xl">
                        <div>
                            <h1 className="font-semibold text-lg">Datos del Producto</h1>
                            <p className="text-xs">Completa la información del producto</p>
                        </div>
                        <section className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4 ">
                            {[
                                { icon: Package, name: "name", label: "Nombre del Producto", type: "text"},
                                { icon: ScanLine, name: "barcode", label: "Código / SKU", type: "text", autoFocus: true },
                                { icon: Package, name: "stock", label: "Cantidad Inicial", type: "number"},
                                { icon: Package, name: "min_stock", label: "Cantidad Mínima", type: "number"},
                                { icon: DollarSign, name: "base_price", label: "Precio (sin IVA)", type: "number"},
                                { icon: Package, name: "unit_mesurement", label: "Inidad de Medida", type: "select", options: ["58 - Kilogramo", "94 - Unidad"]},
                                { icon: Package, name: "category", label: "Categoria", type: "select", options: ["Carnes Excluidas"]},
                            ].map((field) => (
                                <section key={field.name}>
                                    <label className="block text-sm font-semibold mb-1">{field.label}</label>   
                                    {field.type === "select" ? (
                                        <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                            <field.icon className="ml-3" />
                                            <select name={field.name} onChange={(e) => handleInputChange(setProduct, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
                                            <option value="">Seleccionar</option>
                                            {field.options.map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                            </select>
                                        </div>
                                    ) :(
                                        <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                            <field.icon className="ml-3" />
                                            <input value={isProduct[field.name]} autoFocus={field.autoFocus} type={field.type} onChange={(e) => handleInputChange(setProduct, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                                        </div>
                                    )}
                                </section>
                            ))}
                        </section>
                        {/* -- Niveles de IVA y Boton de Envio de Datos -- */}
                        <div className="flex justify-end flex-col sm:flex-row mt-8 items-center gap-4">
                            <div className="flex gap-4">
                                <section>
                                <label>IVA 0%: </label>
                                <input
                                    checked={isTax === true}
                                    onChange={() => setTax(true)}
                                    type="checkbox"
                                    className="cursor-pointer"
                                />
                                </section>
                                <section>
                                <label>IVA 5%: </label>
                                <input
                                    checked={isTax === 5}
                                    onChange={() => setTax(5)}
                                    type="checkbox"
                                    className="cursor-pointer"
                                />
                                </section>
                                <section>
                                <label>IVA 19%: </label>
                                <input
                                    checked={isTax === 19}
                                    onChange={() => setTax(19)}
                                    type="checkbox"
                                    className="cursor-pointer"
                                />
                                </section>
                            </div>
                            <button disabled={isLoading} type="submit" className={`bg-amber-200 text-[#841A1A]  flex text-nowrap items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-semibold`}>
                                {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <p>Procesando...</p>
                                </div>
                                ) : (
                                <>
                                    <Save /> Guardar Producto
                                </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </>
    )
}