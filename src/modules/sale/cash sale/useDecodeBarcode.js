
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

    const total = base_price * Math.trunc(weight * 100) /100;  // total con iva incluido
    let subtotal = total

    let price = base_price

    // ✔ Si tiene IVA 5%
    if (hasTax5) {
    subtotal = Number((total / 1.05).toFixed(2))
    price = base_price / 1.05
    tax5 = (subtotal * 0.05).toFixed(2)
    }

    // ✔ Si tiene IVA 19%
    if (hasTax19) {
    subtotal = Number((total / 1.19).toFixed(2))
    price = base_price / 1.19
    tax19 = (subtotal * 0.19).toFixed(2)
    }


    return {
    code: product.code,
    description: product.name,
    base_price,
    quantity: Math.trunc(weight * 100) /100,
    discount: 0,
    taxes: [ { id: product.taxes[0].id } ],
    name: product.name,
    price: Math.trunc(price * 100) / 100,
    subtotal,
    warehouse: wh,
    tax0: isTax0,
    tax5: Math.trunc(tax5 * 100) / 100,
    tax19 : Math.trunc(tax19 * 100) / 100,
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
    //console.log("Precio del producto en siigo con iva", base_price)
    
    const total = base_price;
    let subtotal = total

    let tax5 = 0;
    let tax19 = 0;

    // ✔ Si tiene IVA 5%
    if (hasTax5) {
    subtotal = Number((total / 0.05).toFixed(2))
    tax5 = (subtotal * 0.05).toFixed(2)
    }

    // ✔ Si tiene IVA 19%
    if (hasTax19) {
    subtotal = Number((total / 1.19).toFixed(2))
    tax19 = (subtotal * 0.19).toFixed(2)
    }

  

    return {
        code: product.code,
        description: product.name,
        base_price,
        quantity: 1,
        discount: 0,
        price: Math.trunc(subtotal * 100) / 100,
        warehouse: wh,
        taxes: [ { id: product.taxes[0].id } ],
        name: product.name,
        subtotal,
        tax0: isTax0,
        tax5: Math.trunc(tax5 * 100) / 100,
        tax19 : Math.trunc(tax19 * 100) / 100,
        total,
        isScale: false
    };
};