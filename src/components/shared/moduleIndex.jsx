import {ModulesHeader} from "./headers"

import { Link } from "react-router-dom"
import useFilteredAuthorization from "../../utils/useFilteredAuthorization"

export default function ModuleIndex ({items = [], title}) {

    const filteredItems = useFilteredAuthorization(items, "permissions") // Obtener permisos del usuario

    return (
        <>
            <ModulesHeader module={title} description={""}/>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredItems.map((mod, index) => (
                    <Link
                        key={index}
                        to={mod.to}
                        className={`bg-[#841A1A] text-amber-100 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 group`}
                    >
                        <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg  group-hover:scale-110 transition-transform duration-200`}>
                            {mod.icon}
                        </div>
                        <h3 className="ml-4 text-lg font-semibold  transition-colors">
                            {mod.name}
                        </h3>
                        </div>
                        <p className=" text-sm leading-relaxed">
                        {mod.description}
                        </p>
                    </Link>
                ))}
            </section>
        </>
    )
}