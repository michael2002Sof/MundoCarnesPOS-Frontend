
export function useDecodeScale (product, weight, wh, isModeDatafono)  {
    if (!product) return null;
    if (!wh) return null

    const quantity = Math.trunc(weight * 100) /100

    const tax_rate = Number(product.tax) / 100
    const divisor = 1 + tax_rate

    const isTax0 = Number(product.tax) === 0;
    const hasTax5 = Number(product.tax) === 5;
    const hasTax19 = Number(product.tax) === 19;

    let base_price
    if (isModeDatafono) {
        base_price = Number(product.price2)  // precio con iva incluido
    } else {
        base_price = Number(product.price1)  // precio con iva incluido
    }

    let tax5 = 0;
    let tax19 = 0;

    const price = Number((base_price / divisor).toFixed(2))
    const subtotalRaw = price * quantity
    const tax_value = Number((subtotalRaw * tax_rate).toFixed(2));

    if (hasTax5) tax5 = tax_value
    if (hasTax19) tax19 = tax_value

    const subtotal = Number((subtotalRaw).toFixed(2))
    const total = Number((subtotal + tax_value).toFixed(2))

    console.log(`Precio con IVA:`, base_price, `Precio sin IVA:`, price, `Subtotal:`, subtotal, `IVA:`, tax_value, `Total:`, total, `Cantidad:`, quantity)  


    

    return {
        id: product.id,
        code: product.code,
        description: product.name,
        base_price,
        quantity,
        discount: 0,
        taxes: [ { id: product.tax_id} ],
        name: product.name,
        price,
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
export function useDecodeNormal (product, wh, isModeDatafono) {

    if (!product) return null;
    if (!wh) return null
    const quantity = 1

    const tax_rate = Number(product.tax) / 100
    const divisor = 1 + tax_rate

    const isTax0 = Number(product.tax) === 0;
    const hasTax5 = Number(product.tax) === 5;
    const hasTax19 = Number(product.tax) === 19;

    let base_price
    if (isModeDatafono) {
        base_price = Number(product.price2)  // precio con iva incluido
    } else {
        base_price = Number(product.price1)  // precio con iva incluido
    }

    let tax5 = 0;
    let tax19 = 0;

    const price = Number((base_price / divisor).toFixed(2))
    const subtotalRaw = price * quantity
    const tax_value = Number((subtotalRaw * tax_rate).toFixed(2));

    if (hasTax5) tax5 = tax_value
    if (hasTax19) tax19 = tax_value

    const subtotal = Number((subtotalRaw).toFixed(2))
    const total = Number((subtotal + tax_value).toFixed(2))
  
    subtotal = Number((subtotal).toFixed(2))
    console.log(`Precio con IVA:`, base_price, `Precio sin IVA:`, price, `Subtotal:`, subtotal, `IVA:`, tax_value, `Total:`, total )     

    return {
        id: product.id,
        code: product.code,
        description: product.name,
        base_price,
        quantity: 1,
        discount: 0,
        price,
        warehouse: wh,
        taxes: [ { id: product.tax_id } ],
        name: product.name,
        subtotal,
        tax0: isTax0,
        tax5,
        tax19,
        total,
        has_stock: product.has_stock,
        dian: product.dian,
        isScale: false
    };
};