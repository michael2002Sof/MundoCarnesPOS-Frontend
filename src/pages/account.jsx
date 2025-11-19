import { useState, useEffect } from "react";
import { Pencil, Trash2, RefreshCw, Mail, Loader } from "lucide-react";

import { ModulesHeader } from "../components/shared/headers";
import handleInputChange from "../utils/useHandleInputChange";
import useAccount from "../hooks/account";
import {formatDateTime} from "../utils/formatData"


export default function Account() {
  const [isAction, setAction] = useState("View Accounts");
  const {account, isLoading, POST_Account, PUT_Account} = useAccount()  //hook con todas la cuentas de la empresa
  console.log(account)

  const isInitialDataAccount = {
    id: null,
    email: "",
    api_key: "",
    provider: "Siigo",
  }

  const [isAccount, setAccount] = useState(isInitialDataAccount);

  // Registrar o actualizar cuenta
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAccount.id) {
      PUT_Account(isAccount)
    } else {
      await POST_Account(isAccount)
    }

    setAccount(isInitialDataAccount);
    setAction("View Accounts");
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
                  <th className="p-2 text-left">Creada en</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="p-4 w-full flex items-center justify-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        Cargando Cuenta de Siigo...
                      </div>
                    </td>
                </tr>
                ) : (
                  account.map((acc) => (
                    <tr key={acc.id} className="border-b hover:bg-amber-200">
                      <td className="p-2 capitalize">{acc.provider}</td>
                      <td className="p-2">{acc.email}</td>
                      <td className="p-2">{formatDateTime(acc.created_at)}</td>
                      <td className="p-2 text-center flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setAccount(acc),
                            setAction("Account Input")
                          }}
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
                              <select name={field.name} value={isAccount.provider} onChange={(e) => handleInputChange(setAccount, field.name, e.target.value)} required className="w-full p-2 bg-transparent focus:outline-none  rounded-r-lg">
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
