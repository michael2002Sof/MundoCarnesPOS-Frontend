import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import useCustomerSiigo from "../../../hooks/siigo/useCustomer";

const LOCAL_DEFAULT_CUSTOMER = {
  person_type: "Person",
  id_type: "13",
  identification: "222222222222",
  branch_office: 0,
  name: ["Consumidor", "Final"],
  address: {
    address: "Sin Dirección",
    city: {},
    postal_code: null,
  },
  phones: [],
  contacts: [
    {
      first_name: "Consumidor",
      last_name: "Final",
      email: null,
      phone: {},
    },
  ],
};


export default function ClientSearch({ setCustomer }) {
  const { GET_CustomerSiigoByIdentification } = useCustomerSiigo();

  const [searchTerm, setSearchTerm] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [isSelectedClient, setSelectedClient] = useState(null);

  const CONSUMIDOR_FINAL_DOCUMENT = "222222222222";

  // Convertir cliente Siigo a tu estructura (con null por defecto)
  const mapCustomer = (client) => {
    const city = client?.address?.city || {};

    return {
      person_type: client.person_type || 'Person',
      id_type: client.id_type?.code || "13",
      identification: client.identification || "222222222222",
      branch_office: client.branch_office || 0,
      name: client.name || [ "Consumidor", "Final" ],
      address: {
        address: client.address?.address || "Sin Dirección",
        city: {
          country_code: city.country_code || null,
          country_name: city.country_name || null,
          state_code: city.state_code || null,
          state_name: city.state_name || null,
          city_code: city.city_code || null,
          city_name: city.city_name || null,
        },
        postal_code: client.address?.postal_code || null,
      },
      phones: [
        {
          indicative: client.phones?.[0]?.indicative || null,
          number: client.phones?.[0]?.number || null,
          extension: client.phones?.[0]?.extension || null,
        },
      ],
      contacts: [
        {
          first_name: client.contacts?.[0]?.first_name || "Consumidor",
          last_name: client.contacts?.[0]?.last_name || "Final",
          email: client.contacts?.[0]?.email || null,
          phone: {
            indicative: client.contacts?.[0]?.phone?.indicative || null,
            number: client.contacts?.[0]?.phone?.number || null,
            extension: client.contacts?.[0]?.phone?.extension || null,
          },
        },
      ],
    };
  };

  const loadDefaultCustomer = async () => {
    try {
      const result = await GET_CustomerSiigoByIdentification(CONSUMIDOR_FINAL_DOCUMENT);

      if (result && result.length > 0) {
        const cf = mapCustomer(result[0]);
        setCustomer(cf);
        setSelectedClient(result[0]);
        setSearchTerm(CONSUMIDOR_FINAL_DOCUMENT);
      } else {
        throw new Error("No encontrado en Siigo");
      }
    } catch (error) {
      console.warn("Siigo no disponible, usando cliente local");

      setCustomer(LOCAL_DEFAULT_CUSTOMER);
      setSelectedClient(LOCAL_DEFAULT_CUSTOMER);
      setSearchTerm(CONSUMIDOR_FINAL_DOCUMENT);

      toast("Modo contingencia activado", { icon: "⚠️" });
    }
  };


  useEffect(() => {
    if (!setCustomer) {
      loadDefaultCustomer();
    }
  }, [setCustomer]);





  // Búsqueda manual con Enter
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const result = await GET_CustomerSiigoByIdentification(searchTerm.trim());

      if (!result || result.length === 0) {
        toast.error("Cliente no registrado en Siigo");
        await loadDefaultCustomer();
        setCustomerList([]);
        return;
      }

      setCustomerList(result);

    } catch (error) {
      console.warn("Error consultando Siigo");

      toast.error("Error conectando con Siigo");
      await loadDefaultCustomer();
      setCustomerList([]);
    }
  };


  // Seleccionar cliente
  const handleSelectClient = (client) => {
    setCustomer(mapCustomer(client));
    setSelectedClient(client);
    setSearchTerm(client.identification);
    setCustomerList([]); // Ocultar lista
  };

  return (
    <div className="space-y-2 relative w-full ">
      <label className="block text-sm">Buscar cliente por documento</label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedClient(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="w-full p-2 rounded bg-[#6E1515] placeholder-amber-100 outline-none"
            placeholder="Documento"
          />
          <Search className="absolute right-2 top-2.5 text-gray-300 w-4 h-4" />
        </div>
      </div>

      {/* Lista de sugerencias */}
      {customerList.length > 0 && !isSelectedClient && (
        <ul className="absolute z-10 w-full bg-[#3a0f0f] border border-[#6E1515] rounded shadow-lg max-h-48 overflow-y-auto">
          {customerList.map((client) => (
            <li
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className="p-2 cursor-pointer hover:bg-[#8B1E1E] text-white"
            >
              <div className="font-semibold">{client.name.join(" ")}</div>
              <div className="text-sm text-gray-300">CC: {client.identification}</div>
              <div className="text-xs text-gray-400">{client.address?.address}</div>
            </li>
          ))}
        </ul>
      )}

      {/* Cliente seleccionado */}
      {isSelectedClient && (
        <div className="p-3 mt-2 bg-[#6E1515] rounded text-white text-sm space-y-1">
          <div>
            <span className="font-semibold">Cliente:</span>{" "}
            {isSelectedClient.name.join(" ")}
          </div>
          <div>
            <span className="font-semibold">Dirección:</span>{" "}
            {isSelectedClient.address?.address || "N/A"}
          </div>
        </div>
      )}
    </div>
  );
}
