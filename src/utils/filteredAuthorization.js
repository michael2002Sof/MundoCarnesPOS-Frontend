import { useMemo } from "react";
import DecodeToken from "../api/decode";
import { GetAllRoles } from "../hooks/user";

export default function useFilteredAuthorization(items, type = "modules") {
  const token = DecodeToken();
  const { roles } = GetAllRoles();
  const userRol = token.rol;

  const filtered = useMemo(() => {
    if (userRol === "admin") return items;
    const rol = roles?.find(r => r.id === userRol);
    const key = type === "modules" ? "modules" : "permissions";
    const userAccess = rol?.[key] || [];
    return items.filter(item => userAccess.includes(item.name));
  }, [roles, userRol, items, type]);

  return filtered;
}
