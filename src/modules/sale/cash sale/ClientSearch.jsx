import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import {GetAllCustomers} from "../../../hooks/customer"



export default function ClientSearch({isSelectedClient, setSelectedClient}) {
  const {customers} = GetAllCustomers() //Todos los clientes de la empresa
  const [searchTerm, setSearchTerm] = useState(""); // lo que escribe el usuario


  // Filtra los clientes a medida que se escribe el documento
  const filteredClients = useMemo(() => {
    if (!searchTerm) return [];
    return customers?.filter((c) =>
      c.cc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setSearchTerm(client.cc); // muestra el documento en el input
  };

   return (
    <div className="space-y-2 relative w-full ">
      <label className="block text-sm">
        Buscar cliente por documento
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedClient(null);
            }}
            className="w-full p-2 rounded bg-[#6E1515]  placeholder-amber-100 outline-none"
            placeholder="Documento"
          />
          <Search className="absolute right-2 top-2.5 text-gray-300 w-4 h-4" />
        </div>
      </div>

      {/* Lista de sugerencias */}
      {filteredClients.length > 0 && !isSelectedClient && (
        <ul className="absolute z-10 w-full bg-[#3a0f0f] border border-[#6E1515] rounded shadow-lg max-h-48 overflow-y-auto">
          {filteredClients.map((client) => (
            <li
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className="p-2 cursor-pointer hover:bg-[#8B1E1E] text-white"
            >
              <div className="font-semibold">{client.name}</div>
              <div className="text-sm text-gray-300">CC: {client.cc}</div>
              <div className="text-xs text-gray-400">{client.email}</div>
            </li>
          ))}
        </ul>
      )}

      {/* Mostrar cliente seleccionado */}
      {isSelectedClient && (
        <div className="p-3 mt-2 bg-[#6E1515] rounded text-white text-sm space-y-1">
          <div>
            <span className="font-semibold">Cliente:</span>{" "}
            {isSelectedClient.name}
          </div>
          <div>
            <span className="font-semibold">Documento:</span>{" "}
            {isSelectedClient.cc}
          </div>
          <div>
            <span className="font-semibold">Dirección:</span>{" "}
            {isSelectedClient.address}
          </div>
        </div>
      )}
    </div>
  );
}