import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ menuItems, expanded }) {
  const location = useLocation();

  return (
    <div className="flex flex-col w-full">
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.to;

        return (
          <Link
            key={index}
            to={item.to}
            className={`relative flex items-center p-3 rounded-xl transition-all duration-300 
              group cursor-pointer select-none
              ${isActive ? "bg-amber-200 text-[#841A1A]" : "hover:bg-[#8a3737] text-amber-100"} 
              ${!expanded ? "justify-center" : "w-full"}
            `}
          >
            {/* Ícono */}
            <div className={`${expanded ? "mr-3" : ""} flex`}>
              {item.icon}
            </div>

            {/* Texto con animación */}
            {expanded && (
              <div
                key="text"
                className="flex-1text-left w-46 min-w-0"
              >
                <span className="font-semibold block truncate">
                  {item.name}
                </span>
                {item.description && (
                  <span className="text-xs    block truncate">
                    {item.description}
                  </span>
                )}
              </div>
            )}

            {/* Indicador activo */}
            {isActive && expanded && (
              <div
                className="absolute right-3 w-2 h-2  bg-[#841A1A] rounded-full shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
