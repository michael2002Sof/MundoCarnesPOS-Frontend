import { useMemo } from "react";
import DecodeToken from "../api/decode";
import useRole from "../hooks/user/useRole";

export default function useFilteredAuthorization(items, type = "modules") {
  const token = DecodeToken();
  const { allRoles } = useRole();
  const userRol = token.rol;

  const filtered = useMemo(() => {

    // Admin: tiene todo EXCEPTO Punto de Venta
    if (userRol === "admin") return items.filter(item => item.name != "Punto de Venta");

    // Roles normales
    const rol = allRoles?.find(r => r.id === userRol);

    const key = type === "modules" ? "modules" : "permissions";
    const userAccess = rol?.[key] || [];
    
    return items.filter(item => userAccess.includes(item.name));
  }, [allRoles, userRol, items, type]);

  return filtered;
}
