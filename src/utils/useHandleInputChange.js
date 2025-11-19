export default function useHandleInputChange(setState, field, value) {
    setState(prev => {
        const newState = structuredClone(prev);

        const keys = field.split(".");
        let obj = newState;

        // Navegar o crear las claves intermedias
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];

            // Si es índice numérico → array
            const index = Number(key);

            if (!isNaN(index)) {
                if (!Array.isArray(obj)) return prev;   // Seguridad
                if (!obj[index]) obj[index] = {};       // Crear si no existe
                obj = obj[index];
            } else {
                if (!obj[key]) obj[key] = {};           // Crear objeto si no existe
                obj = obj[key];
            }
        }

        // Última clave (asignación)
        const lastKey = keys[keys.length - 1];
        const lastIndex = Number(lastKey);

        if (!isNaN(lastIndex) && Array.isArray(obj)) {
            obj[lastIndex] = value; // para items.0.price
        } else {
            obj[lastKey] = value;   // para customer.name
        }

        return newState;
    });
}
