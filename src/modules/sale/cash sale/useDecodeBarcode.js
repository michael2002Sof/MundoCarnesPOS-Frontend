
export function useDecodeScale (productSiigo, weight, wh)  {

    const product = productSiigo

    if (!product) return null;
    if (!wh) return null

    // ✔ Impuestos desde Siigo
    const taxObject = product.taxes[0].percentage; // porcentaje del iva que tiene aplicado el precio
    const isTax0 = taxObject === 0;
    const hasTax5 = taxObject === 5;
    const hasTax19 = taxObject === 19;
    const base_price = product.prices[0].price_list[0].value // precio con iva incluido

    let tax5 = 0;
    let tax19 = 0;

     // ✔ Ajuste de cantidad mínima para unidad variable
    const realWeight = weight < 0.01 ? 1 : weight;  // si < 0.01, asumir 1 unidad

    const total = base_price * parseFloat(realWeight.toFixed(2));  // total con iva incluido
    let subtotal = total

    let price = base_price

    // ✔ Si tiene IVA 5%
    if (hasTax5) {
    subtotal = total / 1.05
    price = base_price / 1.05
    tax5 = Math.round(subtotal * 0.05)
    }

    // ✔ Si tiene IVA 19%
    if (hasTax19) {
    subtotal = total / 1.19
    price = base_price / 1.19
    tax19 = Math.round(subtotal * 0.19)
    }


    return {
    code: product.code,
    description: product.name,
    quantity: parseFloat(realWeight.toFixed(2)),
    discount: 0,
    taxes: [ { id: product.taxes[0].id } ],
    name: product.name,
    price: Number(price.toFixed(2))  ,
    subtotal: Math.round(subtotal),
    warehouse: wh,
    tax0: isTax0,
    tax5,
    tax19,
    total: total,
    isScale: true,
    };
};


 // Decodificar normal
export function useDecodeNormal (productSiigo, wh) {

    const product = productSiigo

    if (!product) return null;
    if (!wh) return null

    const taxObject = product.taxes[0].percentage; // Impuesto que incluye base_price
    const isTax0 = taxObject === 0;
    const hasTax5 = taxObject === 5;
    const hasTax19 = taxObject === 19;

    const base_price = product.prices[0].price_list[0].value  // Precio unit con iva
    
    const total = base_price;
    let subtotal = total

    let tax5 = 0;
    let tax19 = 0;

    // ✔ Si tiene IVA 5%
    if (hasTax5) {
    subtotal = total / 1.05
    tax5 = subtotal * 0.05
    }

    // ✔ Si tiene IVA 19%
    if (hasTax19) {
    subtotal = total / 1.19
    tax19 = subtotal * 0.19
    }

  

    return {
        code: product.code,
        description: product.name,
        quantity: 1,
        discount: 0,
        price: Number(subtotal.toFixed(2))  ,
        warehouse: wh,
        taxes: [ { id: product.taxes[0].id } ],
        name: product.name,
        subtotal: Math.round(subtotal),
        tax0: isTax0,
        tax5: Math.round(tax5),
        tax19 : Math.round(tax19),
        total,
        isScale: false
    };
};