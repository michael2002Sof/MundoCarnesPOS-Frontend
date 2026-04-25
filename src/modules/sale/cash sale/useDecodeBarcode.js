
export function useDecodeScale (productSiigo, weight, wh, isModeDatafono)  {

    const product = productSiigo

    if (!product) return null;
    if (!wh) return null

    // ✔ Impuestos desde Siigo
    const taxObject = Number(product.tax); // porcentaje del iva que tiene aplicado el precio
    const isTax0 = taxObject === 0;
    const hasTax5 = taxObject === 5;
    const hasTax19 = taxObject === 19;
    let base_price
    if (isModeDatafono) {
        base_price = Number(product.price2)  // precio con iva incluido
    } else {
        base_price = Number(product.price1)  // precio con iva incluido
    }

    let tax5 = 0;
    let tax19 = 0;

    const total = base_price * Math.trunc(weight * 100) /100;  // total con iva incluido
    let subtotal = total

    let price = base_price

    // ✔ Si tiene IVA 5%
    if (hasTax5) {
    subtotal = Number( (total / 0.05).toFixed(2) )
    price = base_price / 1.05
    tax5 = Number( (subtotal * 0.05).toFixed(2) )
    }

    // ✔ Si tiene IVA 19%
    if (hasTax19) {
    subtotal = Number( (total / 1.19).toFixed(2) )
    price = base_price / 1.19
    tax19 = Number((Math.round(subtotal * 0.19 * 100) / 100).toFixed(2))
    }


    return {
        id: product.id,
        code: product.code,
        description: product.name,
        base_price,
        quantity: Math.trunc(weight * 100) /100,
        discount: 0,
        taxes: [ { id: product.tax_id} ],
        name: product.name,
        price: Math.trunc(price * 100) / 100,
        subtotal,
        warehouse: wh,
        tax0: isTax0,
        tax5,
        tax19,
        total,
        has_stock: product.has_stock,
        dian: product.dian,
        isScale: true,
    };
};


 // Decodificar normal
export function useDecodeNormal (productSiigo, wh, isModeDatafono) {

    const product = productSiigo

    if (!product) return null;
    if (!wh) return null

    const taxObject = Number(product.tax); // Impuesto que incluye base_price
    const isTax0 = taxObject === 0;
    const hasTax5 = taxObject === 5;
    const hasTax19 = taxObject === 19;
    let base_price
    if (isModeDatafono) {
        base_price = Number(product.price2) // precio con iva incluido
    } else {
        base_price = Number(product.price1) // precio con iva incluido
    }
    //console.log("Precio del producto en siigo con iva", base_price)
    
    const total = base_price;
    let subtotal = total

    let tax5 = 0;
    let tax19 = 0;

    // ✔ Si tiene IVA 5%
    if (hasTax5) {
        const rawSubtotal = total / 1.05
        const rawTax = rawSubtotal * 0.05

        subtotal = Number((rawSubtotal).toFixed(2))
        tax5 = Number((rawTax).toFixed(2))
    }

    // ✔ Si tiene IVA 19%
    if (hasTax19) {
        subtotal = Number((total / 1.19).toFixed(2))
        const rawSubtotal = Math.trunc(subtotal * 100) / 100
        tax19 = Number((rawSubtotal * 0.19).toFixed(2))
    }

  

    return {
        id: product.id,
        code: product.code,
        description: product.name,
        base_price,
        quantity: 1,
        discount: 0,
        price: Math.trunc(subtotal * 100) / 100,
        warehouse: wh,
        taxes: [ { id: product.tax_id } ],
        name: product.name,
        subtotal: Math.trunc(subtotal * 100) / 100,
        tax0: isTax0,
        tax5,
        tax19,
        total,
        has_stock: product.has_stock,
        dian: product.dian,
        isScale: false
    };
};