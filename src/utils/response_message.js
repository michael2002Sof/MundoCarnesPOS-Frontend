// utils/usePersistentResponse.js
export default function usePersistentResponse(res, key = "responseMessage") {
  if (!res) return;

  // Validamos que tenga datos
  const response = {
    success: res.success ?? false,
    message: res.message ?? "Ocurrió un error inesperado.",
  };

  // Guardamos en localStorage
  localStorage.setItem(key, JSON.stringify(response));

  // Lanza evento para avisar al Layout
  window.dispatchEvent(new CustomEvent("responseMessageUpdated"));
}
