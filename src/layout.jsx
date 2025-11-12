import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import {AppHeader} from "./components/shared/headers"
import Sidebar from "./components/shared/sidebar";
import Modules from "./config/modules"
import useFilteredAuthorization from "./utils/filteredAuthorization";

export default function AppLayout() {
    
    const filteredModules = useFilteredAuthorization(Modules, "modules") // Obtener modulos del usuario
    const headerRef = useRef()
    const [response, setResponse] = useState(null);
    const [contentHeight, setContentHeight] = useState("100vh");
    const [expanded, setExpanded] = useState(false);

    const onToggleSidebar = () => setExpanded(prev => !prev);

    useEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) {
            const headerHeight = headerRef.current.offsetHeight;
            setContentHeight(`calc(100vh - ${headerHeight}px)`);
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    useEffect(() => {
        const handleMessage = () => {
            const stored = localStorage.getItem("responseMessage");
            if (stored) {
            const parsed = JSON.parse(stored);
            setResponse(parsed);
            setTimeout(() => {
                setResponse(null);
                localStorage.removeItem("responseMessage");
            }, 2000);
            }
        };

        handleMessage();
        window.addEventListener("responseMessageUpdated", handleMessage);
        window.addEventListener("storage", handleMessage);

        return () => {
            window.removeEventListener("responseMessageUpdated", handleMessage);
            window.removeEventListener("storage", handleMessage);
        };
    }, []);

 
    return (
        <div className={`bg-amber-100  h-screen flex flex-col`}>
            <header ref={headerRef} className={`bg-[#841A1A] text-amber-100`}>
                <AppHeader modules={filteredModules}  onToggleSidebar={onToggleSidebar}/>
            </header>
           <main className="flex flex-1">
                {/* Sidebar */}
                <div
                    style={{ height: contentHeight }}
                    className={`bg-[#841A1A] text-amber-100 overflow-y-auto hidden lg:flex p-3 flex-col items-center space-y-2 min-h-full transition-all duration-300 ${
                    expanded ? "w-64" : "w-16"
                    }`}
                >
                    <Sidebar menuItems={filteredModules} expanded={expanded} />
                </div>

                {/* Contenido */}
                <div className="relative flex-1 w-full p-4 sm:p-8 bg-amber-100  space-y-6 flex flex-col items-center overflow-hidden">
                    {response && (
                    <div className="fixed top-20 right-4 border-l-2 z-50 px-6 py-3 rounded-lg shadow-md font-medium bg-[#841A1A] text-amber-100">
                        {response.message}
                    </div>
                    )}
                    <Outlet />
                </div>
            </main>
        </div>
    )

}