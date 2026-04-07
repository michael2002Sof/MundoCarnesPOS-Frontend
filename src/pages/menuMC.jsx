import { Clock, MapPin, MessageCircle } from "lucide-react";

export default function MenuCarnes() {
  const data = {
    empresa: "COMERCIALIZADORA MUNDO CARNES SAS",
    ubicacion: "Cenabastos, Galpón Azul Local P1-27, Cúcuta",
    horario: "Martes a Domingo, 3:00 AM - 12:00 PM",
    contacto: "311 7236541",
    categorias: [
      {
        titulo: "CORTES DE RES",
        productos: [
          { n: "CARNE DE ASAR", p: "30.000" }, { n: "CHATA", p: "39.000" },
          { n: "AGUJA", p: "41.000" }, { n: "CARNE DE GUISAR", p: "27.000" },
          { n: "COSTILLA DE RES", p: "22.000" }, { n: "PUNTA ANCA", p: "39.000" },
          { n: "HUESO COGOTE", p: "11.000" }, { n: "HUESO ROJO", p: "7.000" },
          { n: "COLA DE RES", p: "23.000" }, { n: "LOMO ANCHO MADURADO", p: "41.000" },
          { n: "UBRE", p: "15.000" }, { n: "CARNE SALADA", p: "30.000" },
          { n: "OSOBUCO", p: "30.000" }, { n: "CARNE CAPON", p: "33.000" },
          { n: "PINCHOS", p: "35.000" }, { n: "TOMAHAWK", p: "48.000" },
          { n: "FAJITAS MADURADAS", p: "35.000" }, { n: "ASADO DE TIRA", p: "25.000" },
          { n: "MILANESA", p: "32.000" }, { n: "CARNE HAMBURGUESA", p: "5.000" },
          { n: "CARNE CHATA PREMIUN", p: "50.000" }, { n: "CARNE PUNTA PREMIUN", p: "50.000" },
          { n: "TUETANO", p: "2.000" }
        ]
      },
      {
        titulo: "ASADURA DE RES",
        productos: [
          { n: "PATA DE RES MEDIANA", p: "14.000" }, { n: "TRIPA", p: "6.000" },
          { n: "CALLO", p: "14.000" }, { n: "BOFE", p: "8.000" },
          { n: "CHINCHULLA", p: "13.000" }, { n: "LENGUA CON AGALLAS", p: "23.000" },
          { n: "CARNE DE PICOS", p: "11.000" }, { n: "HIGADO", p: "19.000" },
          { n: "ASADURA", p: "14.000" }, { n: "ENTRAÑA", p: "21.000" },
          { n: "PATAS DE RES GRANDE", p: "16.000" }, { n: "LENGUA SIN AGALLAS", p: "29.000" },
          { n: "PATA DE RES PEQUEÑA", p: "10.000" }
        ]
      },
      {
        titulo: "PESCADO",
        productos: [
          { n: "TRUCHA", p: "24.900" }, { n: "FILETE DE TILAPIA", p: "18.800" },
          { n: "ALMEJA CONCHA", p: "8.700" }, { n: "MEJILLONES NEGROS X KILO", p: "19.100" },
          { n: "FILETE DE SALMON 4-6", p: "81.200" }, { n: "BASA KILIADA", p: "12.500" },
          { n: "CAMARON PRECOCIDO", p: "60.000" }, { n: "ANILLOS DE CALAMAR", p: "38.250" },
          { n: "TENTACULO ECONOMICO", p: "20.000" }, { n: "CACHAMA", p: "13.000" },
          { n: "MOJARRA", p: "17.000" }, { n: "BAGRE", p: "35.000" },
          { n: "CABEZA DE BAGRE", p: "15.000" }, { n: "DORADA", p: "16.000" },
          { n: "BAGRE MATO", p: "18.000" }, { n: "LANGOSTINO", p: "20.000" }
        ]
      },
      {
        titulo: "POLLO",
        productos: [
          { n: "POLLO ENTERO", p: "12.000" }, { n: "PERNIL DE POLLO", p: "11.500" },
          { n: "PECHUGA DE POLLO", p: "13.500" }, { n: "ALAS DE POLLO", p: "12.300" },
          { n: "RABADILLA DE POLLO", p: "6.000" }, { n: "BOMBOM DE POLLO", p: "12.700" },
          { n: "CONTRAMUSLO DE POLLO", p: "12.700" }, { n: "MENUDENCIA DE POLLO", p: "1.000" },
          { n: "PATAS DE POLLO", p: "6.000" }, { n: "CORAZON DE POLLO", p: "10.500" },
          { n: "HIGADOS DE POLLO", p: "7.000" }, { n: "MOLLEJAS DE POLLO", p: "11.000" },
          { n: "BANDEJA DE MOLLEJAS", p: "5.000" }
        ]
      },
      {
        titulo: "CERDO",
        productos: [
          { n: "LOMO DE CERDO", p: "21.000" }, { n: "PULPA DE CERDO", p: "18.000" },
          { n: "COSTILLA DE CERDO", p: "18.000" }, { n: "ESPINAZO", p: "4.000" },
          { n: "PEZUÑA", p: "10.000" }, { n: "TOCINO", p: "10.000" },
          { n: "GARRA", p: "4.000" }, { n: "CABEZA DE CERDO", p: "2.500" },
          { n: "EMPELLA", p: "12.000" }, { n: "PAPADA", p: "16.000" },
          { n: "PANCETA", p: "22.000" }, { n: "CHULETA AHUMADA", p: "20.000" },
          { n: "CHULETA DE CERDO", p: "18.000" }, { n: "CH DE RES", p: "19.000" },
          { n: "CH DE CERDO", p: "21.000" }, { n: "LOMO AHUMADO", p: "21.000" },
          { n: "MRC DE CERDO", p: "14.000" }, { n: "CARETA AHUMADA", p: "15.000" },
          { n: "PANCETA AHUMADA", p: "32.000" }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black flex justify-center p-2">
      
      <div className="w-full h-fit max-w-7xl bg-gradient-to-br from-[#5A0F1C] to-[#2A080E] border-4 border-[#B8962E] rounded-lg p-4">

        {/* HEADER COMPACTO */}
        <header className="text-center mb-4">
          <img src="/logo.svg" className="mx-auto mb-2" width={120} />

          <h1 className="text-[#D4AF37] text-xl md:text-3xl font-black uppercase leading-tight">
            {data.empresa}
          </h1>

          <h2 className="bg-[#B8962E] text-black text-sm font-bold px-6 py-1 inline-block mt-2">
            CARTA DE PRECIOS
          </h2>

          {/* INFO COMPACTA */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[16px] font-semibold">
            
            <div className="flex items-center gap-2 justify-center">
              <MapPin size={16} className="text-[#B8962E]" />
              <span className="text-[#D4AF37]">{data.ubicacion}</span>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <Clock size={16} className="text-[#B8962E] " />
              <span className="text-[#D4AF37]">{data.horario}</span>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <MessageCircle size={16} className="text-[#B8962E] " />
              <span className="text-[#D4AF37]">{data.contacto}</span>
            </div>

          </div>
        </header>

        {/* GRID OPTIMIZADO */}
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {data.categorias.map((cat, idx) => (
            <section
              key={idx}
              className="break-inside-avoid bg-black/30 border border-[#B8962E]/40 rounded-lg p-2"
            >
              <h3 className="text-[#D4AF37]  font-bold text-center mb-2 uppercase">
                {cat.titulo}
              </h3>

              <div className="space-y-1">
                {cat.productos.map((prod, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-[15px] border-b border-[#B8962E]/20"
                  >
                    <span className="text-white">{prod.n}</span>
                    <span className="text-[#D4AF37] font-bold">
                      ${prod.p}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="mt-4 text-center text-[16px]">
          <p className="text-[#D4AF37] italic">
            ¡Gracias por su preferencia!
          </p>
        </footer>

      </div>
    </div>
  );
}