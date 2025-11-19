
export function useDecodeScale (productSiigo, weight, wh)  {

    const product = productSiigo

    if (!product) return null;

    // ✔ Impuestos desde Siigo
    const taxObject = product.taxes[0].percentage; // porcentaje del iva que tiene aplicado el precio
    const isTax0 = taxObject === 0;
    const hasTax5 = taxObject === 5;
    const hasTax19 = taxObject === 19;
    const base_price = product.prices[0].price_list[0].value // precio con iva incluido

    let tax5 = 0;
    let tax19 = 0;

    const to2 = (n) => Math.floor(n * 100) / 100;
    console.log("Peso", to2(weight))

    const total = base_price * to2(weight)
    let subtotal = total

    // ✔ Si tiene IVA 5%
    if (hasTax5) {
    subtotal = total / 1.05;
    tax5 = subtotal * 0.05;
    }

    // ✔ Si tiene IVA 19%
    if (hasTax19) {
    subtotal = total / 1.19;
    tax19 = subtotal * 0.19;
    }


    return {
    code: product.code,
    description: product.description,
    quantity: to2(weight),
    discount: 0,
    taxes: [ { id: product.taxes[0].id } ],
    name: product.name,
    price: base_price,
    subtotal: subtotal,
    warehouse: wh?.id,
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
    subtotal = total / 1.05;
    tax5 = subtotal * 0.05;
    }

    // ✔ Si tiene IVA 19%
    if (hasTax19) {
    subtotal = total / 1.19;
    tax19 = subtotal * 0.19;
    }
    const to2 = (n) => Math.floor(n * 100) / 100;

  

    return {
        code: product.code,
        description: product.description,
        quantity: 1,
        discount: 0,
        price: base_price,
        warehouse: wh?.id,
        taxes: [ { id: product.taxes[0].id } ],
        name: product.name,
        subtotal: to2(subtotal),
        tax0: isTax0,
        tax5: to2(tax5),
        tax19 : to2(tax19),
        total,
        isScale: false
    };
};