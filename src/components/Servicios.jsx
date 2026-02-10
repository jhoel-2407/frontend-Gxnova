import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Encabezado from "./Encabezado";
import Footer from "./Footer";
import MapaTrabajos from "./servicios/MapaTrabajos";
import { Map, List } from "lucide-react";
import API_URL from '../config/api';

function Servicios() {
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("publicado");
    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    const [filtroUbicacion, setFiltroUbicacion] = useState("");
    const [vistaMapa, setVistaMapa] = useState(false); // Nuevo estado

    useEffect(() => {
        cargarCategorias();

        // Obtener parámetros de la URL
        const params = new URLSearchParams(window.location.search);
        const categoriaParam = params.get("id_categoria");
        if (categoriaParam) {
            setFiltroCategoria(categoriaParam);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            cargarTrabajos();
        }, 500); // Debounce de 500ms para no saturar con cada tecla
        return () => clearTimeout(timer);
    }, [filtroCategoria, filtroEstado, filtroBusqueda, filtroUbicacion]);

    const cargarCategorias = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/api/categorias`);
            const data = await respuesta.json();
            if (data.categorias) {
                setCategorias(data.categorias);
            }
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    const cargarTrabajos = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/api/trabajos?estado=${filtroEstado}`;
            if (filtroCategoria) {
                url += `&id_categoria=${filtroCategoria}`;
            }
            if (filtroBusqueda) {
                url += `&busqueda=${encodeURIComponent(filtroBusqueda)}`;
            }
            if (filtroUbicacion) {
                url += `&ubicacion=${encodeURIComponent(filtroUbicacion)}`;
            }

            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.trabajos) {
                setTrabajos(data.trabajos);
            }
        } catch (error) {
            console.error("Error al cargar trabajos:", error);
        } finally {
            setLoading(false);
        }
    };

    const verDetalles = (id) => {
        navigate(`/detalles/${id}`);
    };

    const formatearPrecio = (monto) => {
        if (!monto) return "A convenir";
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(monto);
    };

    return (
        <div>
            <Encabezado />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Servicios Publicados</h1>

                    {/* Botón Toggle Mapa/Lista */}
                    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <button
                            onClick={() => setVistaMapa(false)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${!vistaMapa ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <List size={20} /> Lista
                        </button>
                        <button
                            onClick={() => setVistaMapa(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${vistaMapa ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Map size={20} /> Mapa
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Buscador Texto */}
                        <div className="md:col-span-4 lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar
                            </label>
                            <input
                                type="text"
                                placeholder="¿Qué estás buscando? (Ej: Plomero, Diseño...)"
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                            />
                        </div>

                        {/* Buscador Ubicación */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ubicación
                            </label>
                            <input
                                type="text"
                                placeholder="Ciudad o Dirección"
                                value={filtroUbicacion}
                                onChange={(e) => setFiltroUbicacion(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                            />
                        </div>

                        {/* Filtro Categoría */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría
                            </label>
                            <select
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                            >
                                <option value="">Todas</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contenido condicional: Mapa o Lista */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Cargando servicios...</p>
                    </div>
                ) : vistaMapa ? (
                    // VISTA MAPA
                    <MapaTrabajos trabajos={trabajos} />
                ) : trabajos.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No hay servicios disponibles</p>
                    </div>
                ) : (
                    // VISTA LISTA
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trabajos.map((trabajo) => (
                            <div
                                key={trabajo.id_trabajo}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                                onClick={() => verDetalles(trabajo.id_trabajo)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                                        {trabajo.categoria?.nombre || "Sin categoría"}
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full capitalize">
                                        {trabajo.estado}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {trabajo.titulo}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {trabajo.descripcion}
                                </p>

                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Tipo de pago:</p>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {trabajo.tipo_pago === "dinero"
                                                ? formatearPrecio(trabajo.monto_pago)
                                                : "Trueque"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <span>📍 {trabajo.ubicacion}</span>
                                </div>

                                <div className="flex items-center text-sm text-gray-500">
                                    <span>
                                        Por: {trabajo.empleador?.nombre} {trabajo.empleador?.apellido}
                                    </span>
                                </div>

                                <button
                                    className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        verDetalles(trabajo.id_trabajo);
                                    }}
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Servicios;
