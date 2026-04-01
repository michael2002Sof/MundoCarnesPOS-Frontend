import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Save } from "lucide-react"

import { ModulesHeader } from "../../components/shared/headers"
import useWarehouse from "../../hooks/inventory/useWarehouse"
import useProductSiigo from "../../hooks/siigo/useProduct"
import axiosInstance from "../../api/axiosintance"

export default function Stock () {
    const {warehouses, GET_WarehouseSiigo} = useWarehouse()
    const {fetchProduts} = useProductSiigo()

    const [products, setProducts] = useState([])

    const [productSearch, setProductSearch] = useState("")
    const [selectedProduct, setSelectedProduct] = useState(null)

    const [warehouse, setWarehouseSelected] = useState("")
    const [stock, setStock] = useState("")

    useEffect(() => {
        GET_WarehouseSiigo()
    }, [])


    useEffect(() => {
        if (productSearch.length < 2) return

        const fetch = async () => {
            const res = await fetchProduts({ name: productSearch, page: 1, limit: 5 })
            if (!res) return

            setProducts(res.data)
        }

        fetch()
    }, [productSearch])


    const handleSubmitStock = async (e) => {
        e.preventDefault()

        if (!selectedProduct) return toast.error("Selecciona un producto")
        if (!warehouse) return toast.error("Selecciona una bodega")
        if (!stock) return toast.error("Ingresa el stock")

        const data = {
            product: selectedProduct.id,
            warehouse,
            stock: Number(stock)
        }

        console.log("ENVIANDO:", data)

        // aquí llamas tu endpoint
        try {
            const res = await axiosInstance.post('/posinnovate/siigo/stock', data)
            toast.success(res.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <ModulesHeader
                module={"Stock de Productos"}
                description={"Registra stock de productos en tus bodegas de siigo"}
            />

        
            

    
          
            {/* ===============================================================
                FORMULARIO CREAR / EDITAR BODEGA
            =============================================================== */}
            <form onSubmit={handleSubmitStock} className="mt-6 space-y-4 w-full">
                <div className="flex items-center justify-between gap-4">
                    {/* PRODUCTO */}
                    <div className="w-full">
                        <label className="block font-semibold mb-1">Producto</label>
                        <section className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value)
                                    setSelectedProduct(null)
                                }}
                                className="border p-2 rounded-lg w-full"
                            />

                            {/* RESULTADOS */}
                            {products.length > 0 && !selectedProduct && (
                                <div className="absolute bg-white border w-full mt-1 rounded-lg shadow z-10">
                                    {products.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setSelectedProduct(p)
                                                setProductSearch(p.name)
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {p.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* BODEGA */}
                    <section className="w-full">
                        <label className="block font-semibold mb-1">Bodega</label>
                        <select
                            value={warehouse}
                            onChange={(e) => setWarehouseSelected(e.target.value)}
                            className="border p-2 rounded-lg w-full max-w-md"
                        >
                            <option value="">Seleccionar...</option>
                            {warehouses?.map(w => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    </section>

                    {/* STOCK */}
                    <section className="w-full">
                        <label className="block font-semibold mb-1">Stock</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="border p-2 rounded-lg w-full max-w-md"
                        />
                    </section>
                </div>
                <div className="w-full flex justify-end">
                    <button
                        type="submit"
                        className="bg-amber-200 text-[#841A1A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                    >
                        <Save size={16} />
                        Guardar Stock
                    </button>
                </div>
            </form>
        </>
    )
}