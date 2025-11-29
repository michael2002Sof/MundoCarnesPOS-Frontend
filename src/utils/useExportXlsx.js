import * as XLSX from "xlsx";
// Importamos 'saveAs' directamente, no la librería completa
import { saveAs } from "file-saver"; 

/**
 * Procesa el array de facturas (invoices) para crear una estructura de datos
 * plana y adecuada para una hoja de cálculo. Cada fila representa una factura.
 * @param {Array<Object>} invoices - El array de objetos de factura.
 * @returns {Array<Array<any>>} Un array de arrays con los datos listos para XLSX.
 */
const flattenInvoices = (invoices) => {
  const data = [];

  // Cabeceras de la tabla de Excel (Misma estructura que solicitaste)
  data.push([
    "Código Factura",
    "Fecha",
    "Cliente",
    "Vendedor",
    "Subtotal",
    "IVA 0%",
    "IVA 5%",
    "IVA 19%",
    "Total",
    "Método Pago Efectivo",
    "Método Pago Transferencia",
    "Total Pagado",
  ]);

  // Llenar las filas con los datos de las facturas
  invoices.forEach((invoice) => {
    data.push([
      invoice.code,
      invoice.created_at,
      invoice.client || "N/A",
      invoice.vendedor || "N/A",
      // Asegurando que los valores numéricos sean tratados como números
      invoice.subtotal || 0, 
      invoice.tax0 || 0,
      invoice.tax5 || 0,
      invoice.tax19 || 0,
      invoice.total || 0,
      invoice.receipt_cash || 0,
      invoice.receipt_transfer || 0,
      invoice.total_payment || 0,
    ]);
  });

  return data;
};

/**
 * Exporta el array de facturas a un archivo .xlsx descargable con estilos y anchos de columna.
 * @param {Array<Object>} invoices - El array de objetos de factura a exportar.
 * @param {string} fileName - El nombre base del archivo.
 */
export const exportToExcel = (invoices, fileName = "Reporte_Facturas") => {
  if (!invoices || invoices.length === 0) {
    console.warn("No hay facturas para exportar.");
    return;
  }

  try {
    // 1. Preparar los datos
    const dataToExport = flattenInvoices(invoices);

    // 2. Crear el libro de trabajo (Workbook) y la hoja (Worksheet)
    const ws = XLSX.utils.aoa_to_sheet(dataToExport); // 'aoa' = array of arrays
    const wb = XLSX.utils.book_new();
    
    // =======================================================================
    // 3. APLICAR ESTILOS AL ENCABEZADO (COLOR Y NEGRITA)
    // =======================================================================
    const headerStyle = { 
        fill: { 
            fgColor: { rgb: "841A1A" } // Color de fondo Rojo Oscuro
        },
        font: {
            color: { rgb: "FFFFFF" }, // Color de texto Blanco
            bold: true
        }
    };
    
    // Obtener el rango de la hoja, típicamente A1:O1 para el encabezado
    const range = XLSX.utils.decode_range(ws['!ref']);

    for (let C = range.s.c; C <= range.e.c; ++C) {
        // Obtener la dirección de la celda de la fila 1 (encabezado)
        const cell_address = XLSX.utils.encode_cell({c: C, r: 0});
        
        // Asegurar que la celda existe antes de aplicar el estilo
        if (ws[cell_address]) {
            ws[cell_address].s = headerStyle;
        }
    }

    // =======================================================================
    // 4. APLICAR ANCHOS DE COLUMNA (AJUSTE AUTOMÁTICO)
    // =======================================================================
    const max_widths = dataToExport[0].map((header, i) => {
        // Encontrar la longitud máxima del texto en cada columna (incluyendo el encabezado)
        const column_data_widths = dataToExport.map(row => 
            String(row[i] || '').length
        );
        return Math.max(...column_data_widths, String(header).length);
    });

    // Asignar los anchos de columna al objeto '!cols' del worksheet
    ws['!cols'] = max_widths.map(w => ({
        // wch: width character. Añadimos un pequeño padding (2 caracteres)
        wch: w + 2
    }));

    // 5. Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Facturas");

    // 6. Escribir el archivo binario
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true
    });

    // 7. Guardar el archivo usando file-saver
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    
    // Añade la fecha al nombre del archivo para evitar conflictos
    const dateSuffix = new Date().toISOString().slice(0, 10);
    saveAs(data, `${fileName}_${dateSuffix}.xlsx`);

  } catch (error) {
    console.error("Error al exportar a Excel:", error);
  }
};