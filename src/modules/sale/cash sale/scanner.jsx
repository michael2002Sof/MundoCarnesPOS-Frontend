import { useState } from "react";
import { Search, Loader } from "lucide-react";

export function Scanner({
    label,
    showLabel = false,
    loadingProduct,
    value,
    onChange,
    onSelect,
    searchAction,
    results = [],
    display = (item) => item.name,
    placeholder = "Buscar...",
    minLength = 4,
    className
}) {
    const [show, setShow] = useState(false)

    const handleChange = (e) => {
        const val = e.target.value
        onChange(val)

        if (val.length >= minLength) {
            searchAction(val)
            setShow(true)
        } else {
            setShow(false)
        }
    }

    return (
        <div className={`relative ${className}`}>
            {showLabel && (
                <div className="flex gap-1 items-center mb-1">
                    <Search size={16}/>
                    <label>{label}</label>
                </div>
            )}

            <input
                value={value}
                className="flex-1 p-2 w-full focus:outline-none rounded-lg bg-[#6E1515]"
                placeholder={placeholder}
                onChange={handleChange}
                disabled={loadingProduct}
                autoFocus
            />

            {show && (
                <div className="absolute bg-white text-black rounded-lg mt-1 border border-inverse-muted/60 w-full shadow-md z-20 max-h-60 overflow-y-auto">

                    {/* Estado cargando */}
                    {loadingProduct && (
                        <div className="flex items-center gap-2 px-3 py-2 text-gray-500">
                            <Loader className="animate-spin" size={16}/>
                            Buscando coincidencias...
                        </div>
                    )}

                    {/* Resultados */}
                    {!loadingProduct && results.length > 0 && results.map((item) => (
                        <div
                            key={item.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onSelect(item)
                                setShow(false)
                            }}
                        >
                            {display(item)}
                        </div>
                    ))}

                    {/* Sin resultados */}
                    {!loadingProduct && results.length === 0 && (
                        <div className="px-3 py-2 text-gray-400">
                            No se encontraron coincidencias
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}