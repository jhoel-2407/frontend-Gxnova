import React, { useState, useEffect } from "react";
import { Search, Bell, MessageSquare, Plus, Menu } from "lucide-react";
import logoGxnova from "../assets/gxnova-logo.png";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import SearchBar from "./layout/SearchBar";
import UserMenu from "./layout/UserMenu";
import MobileMenu from "./layout/MobileMenu";
import API_URL from '../config/api';

function Encabezado() {
    const navigate = useNavigate();
    const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);
    const [usuario, setUsuario] = useState(null);
    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
    const [mostrarMenuMovil, setMostrarMenuMovil] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            cargarNotificacionesNoLeidas();
            cargarUsuario();
        }
    }, []);

    const cargarNotificacionesNoLeidas = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const respuesta = await fetch(`${API_URL}/api/notificaciones/no-leidas`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                setCantidadNotificaciones(data.cantidad || 0);
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    };

    const cargarUsuario = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const respuesta = await fetch(`${API_URL}/api/usuarios/perfil`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                setUsuario(data.usuario);
            }
        } catch (error) {
            console.error("Error al cargar usuario:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUsuario(null);
        setCantidadNotificaciones(0);
        setMostrarMenuUsuario(false);
        navigate("/");
    };

    const handleBuscar = (e) => {
        e.preventDefault();
        if (busqueda.trim()) {
            navigate(`/servicios?busqueda=${encodeURIComponent(busqueda.trim())}`);
            setBusqueda("");
        }
    };

    const ghostButtonClasses = "p-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50";
    const defaultButtonClasses = "h-9 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50";
    const inputClasses = "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50";
    const badgeClasses = "absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs p-0 flex items-center justify-center font-bold";

    const estaLogueado = !!localStorage.getItem("token");

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex h-16 items-center justify-between gap-4">

                    {/* Logo y marca */}
                    <div className="flex items-center gap-8">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            <img
                                src={logoGxnova}
                                alt="GXNOVA"
                                className="h-16 w-auto object-contain"
                            />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                                    GXNOVA
                                </span>
                            </div>
                        </div>

                        <Navbar estaLogueado={estaLogueado} ghostButtonClasses={ghostButtonClasses} />
                    </div>

                    <SearchBar
                        busqueda={busqueda}
                        setBusqueda={setBusqueda}
                        handleBuscar={handleBuscar}
                        inputClasses={inputClasses}
                    />

                    {/* Acciones del usuario */}
                    <div className="flex items-center gap-2">

                        {/* Botón de búsqueda móvil */}
                        <button
                            className={`md:hidden ${ghostButtonClasses}`}
                            aria-label="Buscar"
                            onClick={() => setMostrarMenuMovil(!mostrarMenuMovil)}
                        >
                            <Search className="w-4 h-4" />
                        </button>

                        {estaLogueado ? (
                            <>
                                {/* Publicar proyecto */}
                                <button
                                    className={`gap-2 ${defaultButtonClasses} hidden sm:flex`}
                                    id="boton-publicar-proyecto"
                                    onClick={() => navigate("/crear-trabajo")}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden lg:inline">Publicar Proyecto</span>
                                    <span className="lg:hidden">Publicar</span>
                                </button>

                                {/* Notificaciones */}
                                <button
                                    className={`relative ${ghostButtonClasses}`}
                                    aria-label="Notificaciones"
                                    onClick={() => navigate("/notificaciones")}
                                >
                                    <Bell className="w-5 h-5" />
                                    {cantidadNotificaciones > 0 && (
                                        <span
                                            className={`${badgeClasses} bg-red-600 animate-pulse`}
                                            aria-label={`${cantidadNotificaciones} notificaciones nuevas`}
                                        >
                                            {cantidadNotificaciones > 99 ? '99+' : cantidadNotificaciones}
                                        </span>
                                    )}
                                </button>

                                {/* Mensajes */}
                                <button
                                    className={`relative ${ghostButtonClasses}`}
                                    aria-label="Mensajes"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </button>

                                <UserMenu
                                    usuario={usuario}
                                    cantidadNotificaciones={cantidadNotificaciones}
                                    mostrarMenuUsuario={mostrarMenuUsuario}
                                    setMostrarMenuUsuario={setMostrarMenuUsuario}
                                    handleLogout={handleLogout}
                                    ghostButtonClasses={ghostButtonClasses}
                                />
                            </>
                        ) : (
                            <>
                                {/* Botón Login cuando no está autenticado */}
                                <button
                                    className={`${defaultButtonClasses} hidden sm:flex`}
                                    onClick={() => navigate("/auth")}
                                >
                                    Iniciar Sesión
                                </button>
                            </>
                        )}

                        {/* Menú móvil */}
                        <button
                            className={`lg:hidden ${ghostButtonClasses}`}
                            aria-label="Menú de navegación"
                            onClick={() => setMostrarMenuMovil(!mostrarMenuMovil)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <MobileMenu
                    mostrarMenuMovil={mostrarMenuMovil}
                    setMostrarMenuMovil={setMostrarMenuMovil}
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                    handleBuscar={handleBuscar}
                    estaLogueado={estaLogueado}
                    cantidadNotificaciones={cantidadNotificaciones}
                    handleLogout={handleLogout}
                    inputClasses={inputClasses}
                />
            </div>

            {/* Overlay para cerrar menú al hacer click fuera */}
            {mostrarMenuUsuario && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMostrarMenuUsuario(false)}
                ></div>
            )}
        </header>
    );
}

export default Encabezado;

