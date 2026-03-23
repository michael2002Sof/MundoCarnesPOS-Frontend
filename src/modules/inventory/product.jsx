import { Loader, Save } from "lucide-react"
import { ModulesHeader } from "../../components/shared/headers"
import useProductSiigo from "../../hooks/siigo/useProduct"
import { useEffect, useState } from "react"

export default function Product () {
    const { loading, create, fetchProduts } = useProductSiigo()
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [products, setProducts] = useState([])

    const handleSubmit = async () => {
        await create()
    }

    useEffect(() => {
        const fetch = async () => {
            const res = await  fetchProduts({page, name: search})

            if (!res) return

            setProducts(res.data)
            setPages(res.totalPages)
            setTotal(res.total)
            console.log(res)
        }
        fetch()
    }, [page, search])

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

            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded-lg w-full max-w-sm mb-4"
            />

            <div className="overflow-x-auto w-full">
                <table className="w-full">
                    <thead className="bg-[#841A1A] text-amber-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-nowrap">Codigo</th>
                            <th className="px-4 py-3 text-left text-nowrap">Producto</th>
                            <th className="px-4 py-3 text-left text-nowrap">Precio 1</th>
                            <th className="px-4 py-3 text-left text-nowrap">Precio 2</th>
                            <th className="px-4 py-3 text-left text-nowrap">Unidad</th>
                            <th className="px-4 py-3 text-left text-nowrap">IVA</th>
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
                            products?.map((wh) => (
                                <tr key={wh.id} className="border-b border-gray-200">
                                    <td className="p-4">{wh.code}</td>
                                    <td className="p-4">{wh.name}</td>
                                    <td className="p-4">{wh.price1}</td>
                                    <td className="p-4">{wh.price2}</td>
                                    <td className="p-4">{wh.unit}</td>
                                    <td className="p-4">{Number(wh.tax)} %</td>
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