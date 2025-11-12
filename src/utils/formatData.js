// Función para formatear fechas MySQL a formato local bonito
export function formatDateTime (dateTime) {
  if (!dateTime) return "DD/MM/AA - HH:MM";
  const date = new Date(dateTime);
  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Formatea valores DECIMAL (ej: precios, montos)
export function formatDecimal(value, currency = false) {
  if (value === null || value === undefined || isNaN(value))
    return currency ? "$0" : "0 KG";

  const number = Number(value);

  if (currency) {
    // Mostrar moneda sin decimales
    return number.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } else {
    // Detectar si tiene decimales o si es menor a 1
    const hasDecimals = number % 1 !== 0 || Math.abs(number) < 1;

    return (
      number.toLocaleString("es-CO", {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: hasDecimals ? 2 : 0,
      }) + " KG"
    );
  }
}

