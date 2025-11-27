import { useState, useEffect } from "react"
import { Bell, LogOut, Menu, X, ArrowLeft, HandCoins, UserCircle  } from "lucide-react"
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DecodeToken from "../../api/decode";

export function ModulesHeader({module, description}) {
  return (
    <div className=" w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-nowrap">{module}</h1>
      <p className="text-sm sm:text-base">{description}</p>
    </div>
  )
}



export function AppHeader({ onToggleSidebar, modules = [] }) {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const token = DecodeToken()

  // Verificación de sesión
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // Cerrar sesión
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* HEADER */}
      <nav className="bg-[#841A1A] text-amber-100 flex justify-between items-center px-4 py-2 shadow-md relative z-50">
        {/* LOGO + Nombre */}
        <section className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex cursor-pointer items-center justify-center"
            title="Expandir menú"
          >
            <img src="/logo.svg" alt="Logo" className="w-[90px]" />
          </button>
          <h1 className="text-4xl font-bold tracking-wide">Mundo Carnes SAS</h1>
        </section>

        {/* Acciones en desktop */}
        <section className="hidden lg:flex items-center gap-3">
          {token?.rol === 'admin' && 
            <>
              {/* Notificaciones */}
              <button className="relative p-2 cursor-pointer rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#841A1A]" />
              </button>
              {/* Usuario */}
              <button onClick={() => navigate("/profile")} className="p-2 rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition-all">
                <UserCircle size={18} />
              </button>
              {/* Cuenta Siigo */}
              <button onClick={() => navigate("/account-sync")} className="p-2 rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition-all">
                <HandCoins size={18} />
              </button>
            </>
          }
          {/* Cerrar sesión */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-2 rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <LogOut size={18} className="text-red-300" />
            <span className="font-medium">Salir</span>
          </button>
        </section>

        {/* Botón menú mobile */}
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow-xl rounded-b-2xl absolute top-[60px] left-0 w-full z-40 border-b border-amber-100"
          >
            <ul className="flex flex-col py-3">
              {modules.map((mod, i) => (
                <Link
                  key={i}
                  to={mod.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-amber-50 flex items-center gap-3 border-b last:border-none transition-all"
                >
                  {mod.icon}
                  <div className="flex flex-col">
                    <span className="font-semibold">{mod.title}</span>
                    {mod.description && (
                      <span className="text-xs text-gray-500 truncate">
                        {mod.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}

              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full px-6 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all"
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIRMACIÓN */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-[#841A1A] text-amber-100 rounded-2xl shadow-2xl w-100 p-6  text-center"
            >
              <h2 className="text-lg font-semibold mb-2">
                ¿Cerrar sesión?
              </h2>
              <p className="text-sm mb-5">
                Tu sesión se cerrará y deberás iniciar nuevamente.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-lg flex gap-2 bg-amber-200 text-nowrap transition cursor-pointer text-[#841A1A]"
                >
                    <ArrowLeft/>
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg flex gap-2 items-center text-nowrap bg-amber-200 cursor-pointer text-[#6b1414] transition"
                >
                    <LogOut/>
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}