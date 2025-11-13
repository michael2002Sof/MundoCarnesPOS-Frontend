import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, RefreshCw, Mail } from "lucide-react";

import axiosInstance from "../api/axiosintance";
import DecodeToken from "../api/decode";
import { ModulesHeader } from "../components/shared/headers";
import handleInputChange from "../utils/handleInputChange";
import {AllAccounts} from "../hooks/account";


export default function Account() {
  const token = DecodeToken();
  const [isAction, setAction] = useState("View Accounts");
  const {accounts, FetchAccounts} = AllAccounts()  //hook con todas la cuentas de la empresa
  const [isLoading, setLoading] = useState(false);

  const isInitialDataAccount = {
    id: null,
    company: token.company,
    email: "",
    api_key: "",
    provider: "siigo",
  }

  const [isAccount, setAccount] = useState(isInitialDataAccount);

  useEffect(() => {
    FetchAccounts();
  }, []);

  // 💾 Registrar o actualizar cuenta
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      if (isAccount.id) {
        await axiosInstance.put(`/posinnovate/app/account/update`, isAccount);
        toast.success("Cuenta actualizada correctamente");
      } else {
        await axiosInstance.post(`/posinnovate/app/account/register`, isAccount);
        toast.success("Cuenta registrada correctamente");
      }
      setAccount({ id: null, company: token.company, email: "", api_key: "" });
      setAction("View Accounts");
      FetchAccounts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Editar cuenta
  const handleEdit = (acc) => {
    setAccount(acc);
    setAction("Account Input");
  };

  // 🗑️ Eliminar cuenta
  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar esta cuenta?")) return;
    try {
      await axiosInstance.delete(`/posinnovate/app/account/delete/${id}`);
      toast.success("Cuenta eliminada");
      FetchAccounts();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  // 🔄 Sincronizar productos desde Siigo
  const handleSync = async (company) => {
    setLoading(true);
    toast.loading("Sincronizando con Siigo...");
    try {
      const res = await axiosInstance.post(`/posinnovate/app/account/siigo/sync/products`, {company});
      toast.success(res.message || "Sincronización completada");
      console.log(res)
      FetchAccounts();
    } catch (err) {
      toast.error("Error al sincronizar con Siigo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ModulesHeader
        module="Sincronización de Cuenta"
        description="Configura y sincroniza la información de tu cuenta empresarial."
      />

      <section className="container mx-auto max-w-5xl mt-6">
        {/* Tabs */}
        <div className="border-b mb-4 text-[#841A1A] flex gap-4">
          <button
            onClick={() => setAction("View Accounts")}
            className={`px-4 py-2 cursor-pointer transition ${
              isAction === "View Accounts" && "border-b-4 border-[#841A1A] font-semibold"
            }`}
          >
            Cuentas Sincronizadas
          </button>
          <button
            onClick={() => setAction("Account Input")}
            className={`px-4 py-2 cursor-pointer transition ${
              isAction === "Account Input" && "border-b-4 border-[#841A1A] font-semibold"
            }`}
          >
            {isAccount.id ? "Editar Cuenta" : "Registrar Cuenta"}
          </button>
        </div>

        {/* ---- Ver cuentas ---- */}
        {isAction === "View Accounts" && (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-sm">
              <thead className="bg-[#841A1A] text-amber-100">
                <tr>
                  <th className="p-2 text-left">Proveedor</th>
                  <th className="p-2 text-left">Correo</th>
                  <th className="p-2 text-left">Estado</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-600">
                      No hay cuentas registradas
                    </td>
                  </tr>
                ) : (
                  accounts.map((acc) => (
                    <tr key={acc.id} className="border-b hover:bg-amber-200">
                      <td className="p-2 capitalize">{acc.provider}</td>
                      <td className="p-2">{acc.email}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            acc.status === "synchronized"
                              ? "bg-green-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {acc.status === "synchronized" ? "Sincronizado" : "No sincronizado"}
                        </span>
                      </td>
                      <td className="p-2 text-center flex justify-center gap-3">
                        {acc.provider === "siigo" && (
                          <button
                            disabled={isLoading}
                            onClick={() => handleSync(acc.company)}
                            className={`bg-[#841A1A] hover:bg-[#6a1515] text-amber-100 p-2 rounded`}
                            title="Sincronizar"
                          >
                          <RefreshCw size={16}  className={` ${isLoading && "animate-spin"}`}/>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(acc)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(acc.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ---- Registrar cuenta ---- */}
        {isAction === "Account Input" && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#841A1A] text-amber-100 rounded-xl p-6 shadow flex flex-col gap-4"
          >
            <h2 className="text-lg font-bold">
              {isAccount.id ? "Editar Cuenta Siigo" : "Registrar Cuenta Siigo"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { icon: Mail, name: "email", label: "Correo Usuario de Cuenta", type: "text" },
                    { icon: Mail, name: "api_key", label: "API Key", type: "text" },
                    { icon: Mail, name: "provider", label: "Tipo de Cuenta", type: "select", options: ["Siigo", "Wompi"]},
                ].map((field) => (
                    <section key={field.name}>
                        <label className="block text-sm font-semibold mb-1">{field.label}</label>   
                        {field.type === "select" ? (
                            <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                <field.icon className="ml-3" />
                                <select name={field.name} onChange={(e) => handleInputChange(setAccount, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
                                <option value="">Seleccionar</option>
                                {field.options.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                                </select>
                            </div>
                        ) :(
                            <div className="flex items-center bg-[#6E1515] text-amber-100 rounded-lg">
                                <field.icon className="ml-3" />
                                <input value={isAccount[field.name]} autoFocus={field.autoFocus} type={field.type} onChange={(e) => handleInputChange(setAccount, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg"/>
                            </div>
                        )}
                    </section>
                ))}
            </div>
            <div className="w-full justify-end gap-2 items-center flex">
                {isAccount.id && (
                    <button onClick={() => setAccount(isInitialDataAccount)}  className="bg-amber-200 hover:bg-amber-200/80 cursor-pointer text-[#841A1A] py-2 px-4 rounded-lg font-semibold mt-2">
                       X Cancelar

                    </button>
                )}
                <button
                type="submit"
                disabled={isLoading}
                className="bg-amber-200 hover:bg-amber-200/80 cursor-pointer text-[#841A1A] py-2 px-4 rounded-lg font-semibold mt-2"
                >
                {isLoading ? "Guardando..." : isAccount.id ? "Actualizar Cuenta" : "Registrar Cuenta"}
                </button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}
