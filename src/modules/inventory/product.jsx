import { Loader, Minus, Plus, Save } from "lucide-react"
import { ModulesHeader } from "../../components/shared/headers"
import useProductSiigo from "../../hooks/siigo/useProduct"
import { useEffect, useState } from "react"

export default function Product () {
    const { loading, create, fetchProduts, update } = useProductSiigo()
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [products, setProducts] = useState([])
    const [openRow, setOpenRow] = useState(null)

    const handleSubmit = async () => {
        await create()
    }

    useEffect(() => {
        const fetch = async () => {
            const res = await  fetchProduts({page, name: search, category})

            if (!res) return

            setProducts(res.data)
            setPages(res.totalPages)
            setTotal(res.total)
        }
        fetch()
    }, [page, search, category])
    
    const handleToggleDian = async (product) => {
        const newValue = product.dian ? 0 : 1

        await update({
            id: product.id,
            dian: newValue
        })

        // 🔥 refrescar lista
        const res = await fetchProduts({ page, name: search })
        if (!res) return

        setProducts(res.data)
    }

    console.log(products)

    return (
        <>
            <ModulesHeader
                module={"Producto Siigo"}
                description={"Registra desde siigo y mantelos actualizados"}
            />
            <button
                disabled={loading}
                onClick={handleSubmit}
                className="bg-amber-200 text-[#841A1A] flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-semibold"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        <p>Procesando...</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        <p>Sincronizar con siigo</p>
                    </div>
                )}
            </button>
            
            <div className="flex items-center gap-4 w-full">
            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded-lg w-full max-w-md mb-4"
            />
            <input
                type="text"
                placeholder="Filtrar por categoria..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 rounded-lg w-full max-w-md mb-4"
            />
            </div>

            <div className="overflow-x-auto w-full">
                <table className="w-full">
                    <thead className="bg-[#841A1A] text-amber-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-nowrap">Codigo</th>
                            <th className="px-4 py-3 text-left text-nowrap">Producto</th>
                            <th className="px-4 py-3 text-left text-nowrap">Categoria</th>
                            <th className="px-4 py-3 text-left text-nowrap">Precio 1</th>
                            <th className="px-4 py-3 text-left text-nowrap">Precio 2</th>
                            <th className="px-4 py-3 text-left text-nowrap">Unidad</th>
                            <th className="px-4 py-3 text-left text-nowrap">IVA</th>
                            <th className="px-4 py-3 text-left text-nowrap">DIAN</th>
                            <th className="px-4 py-3 text-left text-nowrap">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10}>
                                    <div className="p-4 w-full flex items-center justify-center gap-2">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Cargando productos...
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products?.map((p) => (
                                <tr key={p.id} className="border-b border-gray-200 text-nowrap">
                                    <td className="p-4">{p.code}</td>
                                    <td className="p-4">{p.name}</td>
                                    <td className="p-4">{p.category}</td>
                                    <td className="p-4">{p.price1}</td>
                                    <td className="p-4">{p.price2}</td>
                                    <td className="p-4">{p.unit}</td>
                                    <td className="p-4">{Number(p.tax)} %</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleDian(p)}
                                            className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                                                p.dian
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {p.dian ? "SI" : "NO"}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        {p.has_stock && (
                                            <div>
                                                {p.warehouses?.length > 0 ? (
                                                    <table className="w-full text-sm">
                                                        <tbody>
                                                            {p.warehouses.map((w, i) => (
                                                                <tr key={i}>
                                                                    <td className="p-2">{w.name}</td>
                                                                    <td className="p-2 font-semibold">
                                                                        {w.stock}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-gray-500">
                                                        No hay stock registrado
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                >
                    Anterior
                </button>

                <span>Página {page} de {pages}</span>

                <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                >
                    Siguiente
                </button>
            </div>
        </>
    )
}