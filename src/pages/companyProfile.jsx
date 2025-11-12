"use client"
import { useEffect, useState } from "react"
import CompanyData from "../hooks/company"
import {ModulesHeader} from "../components/shared/headers"

export default function CompanyProfile() {
  const { company, FetchCompany, UpdateCompany } = CompanyData()
  const [isEditing, setIsEditing] = useState(false)
  const [editedCompany, setEditedCompany] = useState({})

  // 🧠 Cargar empresa al montar
  useEffect(() => {
    FetchCompany()
  }, [])

  // 🔄 Actualizar editable cuando se cargue la empresa
  useEffect(() => {
    if (company) setEditedCompany(company)
  }, [company])

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => {
    setIsEditing(false)
    setEditedCompany(company)
  }

  const handleSave = async () => {
    const success = await UpdateCompany(editedCompany)
    if (success) setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditedCompany((prev) => ({ ...prev, [field]: value }))
  }

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CO"

  if (!company)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando información de la empresa...
      </div>
    )

  const displayCompany = isEditing ? editedCompany : company

  return (
    <>
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <ModulesHeader
            module={"Perfil de Empresa"}
            description={"Administra la información de tu empresa"}
          />

          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                 Editar
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                   Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                   Guardar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-[#841A1A] text-amber-100 mx-auto max-w-5xl  container shadow rounded-lg p-6 flex flex-col items-start gap-6">
            <img
            src={"/logo.svg"}
            width={120}
            />
            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                {isEditing ? (
                    <input
                    type="text"
                    value={editedCompany.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nombre de la empresa"
                    className="border-b border-gray-300 focus:border-blue-500 outline-none text-2xl font-bold py-1 w-full"
                    />
                ) : (
                    <h2 className="text-3xl font-bold">{displayCompany.name}</h2>
                )}

                <span
                    className={`px-3 py-1 text-sm rounded-full ${
                    displayCompany.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                    {displayCompany.status === "active" ? "Activa" : "Inactiva"}
                </span>
                </div>

                {isEditing ? (
                <input
                    type="text"
                    value={editedCompany.slogan || ""}
                    onChange={(e) => handleInputChange("slogan", e.target.value)}
                    placeholder="Slogan de la empresa"
                    className="border-b border-gray-300 focus:border-blue-500 outline-none text-gray-600 w-full"
                />
                ) : (
                <p className="text-gray-500">
                    {displayCompany.slogan || "Sin slogan registrado"}
                </p>
                )}
            </div>

              {/* Información legal */}
            <div className=" p-6">
            <h3 className="text-lg font-semibold  mb-4">
                Información Legal
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="text-sm ">NIT</label>
                {isEditing ? (
                    <input
                    type="text"
                    value={editedCompany.nit || ""}
                    onChange={(e) => handleInputChange("nit", e.target.value)}
                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                    />
                ) : (
                    <p className=" font-medium">{displayCompany.nit}</p>
                )}
                </div>

                <div>
                <label className="text-sm ">Tipo</label>
                {isEditing ? (
                    <input
                    type="text"
                    value={editedCompany.type || ""}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                    />
                ) : (
                    <p className="text-gray-700 font-medium">
                    {displayCompany.type || "No especificado"}
                    </p>
                )}
                </div>
            </div>
            </div>
        </div>

    

        {/* Contacto */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacto</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Teléfono</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCompany.cell || ""}
                  onChange={(e) => handleInputChange("cell", e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                />
              ) : (
                <p className="text-gray-700 font-medium">{displayCompany.cell}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500">Correo</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedCompany.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                />
              ) : (
                <p className="text-gray-700 font-medium">
                  {displayCompany.email || "No registrado"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ubicación</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Dirección</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCompany.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                />
              ) : (
                <p className="text-gray-700 font-medium">{displayCompany.address}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500">Ciudad</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCompany.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                />
              ) : (
                <p className="text-gray-700 font-medium">{displayCompany.city}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500">Departamento</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCompany.department || ""}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                />
              ) : (
                <p className="text-gray-700 font-medium">{displayCompany.department}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500">País</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCompany.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                />
              ) : (
                <p className="text-gray-700 font-medium">{displayCompany.country}</p>
              )}
            </div>
          </div>
        </div>
    </>
  )
}
