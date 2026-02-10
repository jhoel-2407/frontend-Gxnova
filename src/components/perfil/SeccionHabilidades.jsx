import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';

function SeccionHabilidades({ usuarioId }) {
    const [habilidades, setHabilidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false); // [NEW] Loading state
    const [mostrarFormHabilidad, setMostrarFormHabilidad] = useState(false);
    const [nuevaHabilidad, setNuevaHabilidad] = useState({
        id_categoria: "",
        descripcion: "",
        tarifa_hora: "",
    });

    useEffect(() => {
        if (usuarioId) {
            cargarCategorias();
            cargarHabilidades();
        }
    }, [usuarioId]);

    const cargarCategorias = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categorias`);
            const data = await res.json();
            if (res.ok) setCategorias(data.categorias || []);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    };

    const cargarHabilidades = async () => {
        if (!usuarioId) return;
        try {
            const res = await fetch(`${API_URL}/api/habilidades/usuario/${usuarioId}`);
            const data = await res.json();
            if (res.ok) {
                setHabilidades(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error cargando habilidades:", error);
        } finally {
            setLoading(false); // [NEW] End loading
        }
    };

    const handleCrearHabilidad = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!nuevaHabilidad.id_categoria || !nuevaHabilidad.descripcion || !nuevaHabilidad.tarifa_hora) {
            alert("Por favor completa todos los campos de la habilidad.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/habilidades`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(nuevaHabilidad),
            });
            const data = await res.json();
            if (res.ok) {
                alert("✅ Habilidad agregada");
                setNuevaHabilidad({ id_categoria: "", descripcion: "", tarifa_hora: "" });
                setMostrarFormHabilidad(false);
                cargarHabilidades();
            } else {
                alert(`❌ Error: ${data.message || "No se pudo agregar"}`);
            }
        } catch (error) {
            console.error("Error creando habilidad:", error);
        }
    };

    const handleEliminarHabilidad = async (id_habilidad) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta habilidad?")) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/api/habilidades/${id_habilidad}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                cargarHabilidades();
            } else {
                alert("❌ Error al eliminar");
            }
        } catch (error) {
            console.error("Error eliminando habilidad:", error);
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Mis Habilidades</h3>
                <button
                    onClick={() => setMostrarFormHabilidad(!mostrarFormHabilidad)}
                    className="text-sm text-orange-600 hover:text-orange-800 font-semibold"
                >
                    {mostrarFormHabilidad ? "- Cancelar" : "+ Agregar Habilidad"}
                </button>
            </div>

            {/* Formulario para agregar habilidad */}
            {mostrarFormHabilidad && (
                <form onSubmit={handleCrearHabilidad} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Categoría</label>
                            <select
                                value={nuevaHabilidad.id_categoria}
                                onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, id_categoria: e.target.value })}
                                className="w-full rounded border-gray-300 text-sm"
                                required
                            >
                                <option value="">Selecciona...</option>
                                {categorias.map(cat => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción</label>
                            <input
                                type="text"
                                value={nuevaHabilidad.descripcion}
                                onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, descripcion: e.target.value })}
                                className="w-full rounded border-gray-300 text-sm"
                                placeholder="Ej: Instalación de cableado"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Tarifa/Hora</label>
                            <input
                                type="number"
                                value={nuevaHabilidad.tarifa_hora}
                                onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, tarifa_hora: e.target.value })}
                                className="w-full rounded border-gray-300 text-sm"
                                placeholder="Ej: 50000"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded text-sm font-semibold hover:bg-orange-700">
                        Guardar Habilidad
                    </button>
                </form>
            )}

            {/* Lista de Habilidades */}
            {loading ? (
                <p className="text-center text-gray-500 py-4">Cargando habilidades...</p>
            ) : habilidades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {habilidades.map((hab) => (
                        <div key={hab.id_habilidad} className="p-4 border border-gray-200 rounded-lg flex justify-between items-start bg-gray-50">
                            <div>
                                <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                                    {hab.categoria.nombre}
                                </span>
                                <p className="text-sm font-medium text-gray-900">{hab.descripcion}</p>
                                <p className="text-xs text-gray-500 mt-1">Tarifa: ${hab.tarifa_hora}/hr</p>
                            </div>
                            <button
                                onClick={() => handleEliminarHabilidad(hab.id_habilidad)}
                                className="text-red-500 hover:text-red-700 text-xs font-semibold"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-sm py-4">No tienes habilidades registradas aún.</p>
            )}
        </div>
    );
}

export default SeccionHabilidades;
