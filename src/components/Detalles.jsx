import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from '../config/api';
import Encabezado from "./Encabezado";
import ModalCalificar from "./calificaciones/ModalCalificar";
import Estrellas from "./common/Estrellas";

function Detalles() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trabajo, setTrabajo] = useState(null);
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [mostrarFormPostulacion, setMostrarFormPostulacion] = useState(false);

    // Estados para calificaciones
    const [modalCalificarOpen, setModalCalificarOpen] = useState(false);
    const [miCalificacion, setMiCalificacion] = useState(null);
    const [usuarioAReceptar, setUsuarioAReceptar] = useState(null);

    useEffect(() => {
        cargarUsuario();
        cargarTrabajo();
        cargarPostulaciones();
    }, [id]);

    useEffect(() => {
        if (usuario && trabajo) {
            verificarSiYaCalifico();
            determinarUsuarioAReceptar();
        }
    }, [usuario, trabajo, postulaciones]);

    const cargarUsuario = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/usuarios/perfil`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsuario(data.usuario);
        } catch (error) {
            console.error("Error cargando usuario:", error);
        }
    };

    const cargarTrabajo = async () => {
        setLoading(true);
        try {
            const respuesta = await fetch(`${API_URL}/api/trabajos/${id}`);
            const data = await respuesta.json();
            if (data.trabajo) {
                setTrabajo(data.trabajo);
            }
        } catch (error) {
            console.error("Error al cargar trabajo:", error);
        } finally {
            setLoading(false);
        }
    };

    const cargarPostulaciones = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const respuesta = await fetch(
                `${API_URL}/api/postulaciones?id_trabajo=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await respuesta.json();
            if (data.postulaciones) {
                setPostulaciones(data.postulaciones);
            }
        } catch (error) {
            console.error("Error al cargar postulaciones:", error);
        }
    };

    const determinarUsuarioAReceptar = () => {
        if (!usuario || !trabajo) return;

        // Si soy el empleador, busco al trabajador aceptado via postulaciones
        if (usuario.id_usuario === trabajo.id_empleador) {
            const postulacionAceptada = postulaciones.find(p => p.estado === 'aceptada');
            if (postulacionAceptada) {
                setUsuarioAReceptar(postulacionAceptada.trabajador);
            }
        }
        // Si soy un trabajador aceptado, el receptor es el empleador
        else {
            const soyTrabajadorAceptado = postulaciones.some(
                p => p.id_trabajador === usuario.id_usuario && p.estado === 'aceptada'
            );
            if (soyTrabajadorAceptado) {
                setUsuarioAReceptar(trabajo.empleador); // Asumiendo que trabajo incluye datos del empleador
            }
        }
    };

    const verificarSiYaCalifico = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/calificaciones/verificar?id_trabajo=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.yaCalifico) {
                setMiCalificacion(data.calificacion);
            }
        } catch (error) {
            console.error("Error verificando calificación:", error);
        }
    };

    const handleCalificar = async (datos) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/calificaciones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_trabajo: id,
                    id_usuario_receptor: usuarioAReceptar.id_usuario,
                    puntuacion: datos.puntuacion,
                    comentario: datos.comentario
                }),
            });

            if (res.ok) {
                alert("✅ Calificación enviada exitosamente");
                verificarSiYaCalifico();
            } else {
                const data = await res.json();
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error al calificar:", error);
            alert("Error de conexión");
        }
    };

    const handlePostular = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Debes iniciar sesión para postularte");
            navigate("/auth");
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL}/api/postulaciones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_trabajo: parseInt(id),
                    mensaje: mensaje,
                }),
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert("✅ Postulación enviada exitosamente");
                setMensaje("");
                setMostrarFormPostulacion(false);
                cargarPostulaciones();
            } else {
                alert(`❌ Error: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error("Error al postular:", error);
            alert("❌ Error de conexión con el servidor");
        }
    };

    const handleGestionarPostulacion = async (idPostulacion, accion) => {
        if (!window.confirm(`¿Estás seguro de ${accion} esta postulación?`)) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/postulaciones/${idPostulacion}/${accion}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert(`✅ Postulación ${accion === 'aceptar' ? 'aceptada' : 'rechazada'} correctamente`);
                cargarPostulaciones();
                cargarTrabajo();
            } else {
                const data = await res.json();
                alert(`❌ Error: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error(`Error al ${accion} postulacion:`, error);
        }
    };

    const formatearPrecio = (monto) => {
        if (!monto) return "A convenir";
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(monto);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "No especificada";
        return new Date(fecha).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">Cargando detalles...</p>
                </div>
            </div>
        );
    }

    if (!trabajo) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">Trabajo no encontrado</p>
                    <button
                        onClick={() => navigate("/servicios")}
                        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                        Volver a Servicios
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Encabezado />

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <button
                    onClick={() => navigate("/servicios")}
                    className="mb-6 text-orange-600 hover:text-orange-700 flex items-center gap-2"
                >
                    ← Volver a Servicios
                </button>

                {/* Información Principal */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                                {trabajo.categoria?.nombre || "Sin categoría"}
                            </span>
                            <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full capitalize">
                                {trabajo.estado}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{trabajo.titulo}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Tipo de pago:</p>
                            <p className="font-semibold text-gray-900 capitalize">
                                {trabajo.tipo_pago === "dinero"
                                    ? formatearPrecio(trabajo.monto_pago)
                                    : "Trueque"}
                            </p>
                            {trabajo.tipo_pago === "trueque" && trabajo.descripcion_trueque && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {trabajo.descripcion_trueque}
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Ubicación:</p>
                            <p className="font-semibold text-gray-900">📍 {trabajo.ubicacion}</p>
                        </div>

                        {trabajo.fecha_estimada && (
                            <div>
                                <p className="text-sm text-gray-500">Fecha estimada:</p>
                                <p className="font-semibold text-gray-900">
                                    {formatearFecha(trabajo.fecha_estimada)}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-gray-500">Publicado por:</p>
                            <p className="font-semibold text-gray-900">
                                {trabajo.empleador?.nombre} {trabajo.empleador?.apellido}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Descripción</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{trabajo.descripcion}</p>
                    </div>

                    {/* LÓGICA DE BOTONES DE ACCIÓN (Postular / Calificar) */}

                    {/* Caso 1: Trabajo Completado -> Mostrar Calificación */}
                    {trabajo.estado === 'completado' && usuarioAReceptar && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Calificación del Servicio</h3>
                            {miCalificacion ? (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Ya calificaste este servicio:</p>
                                    <Estrellas puntuacion={miCalificacion.puntuacion} />
                                    {miCalificacion.comentario && (
                                        <p className="text-gray-700 mt-2 italic">"{miCalificacion.comentario}"</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-600 mb-4">El trabajo ha finalizado. Por favor califica a <strong>{usuarioAReceptar.nombre}</strong>.</p>
                                    <button
                                        onClick={() => setModalCalificarOpen(true)}
                                        className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors"
                                    >
                                        ★ Calificar Usuario
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Caso 2: Trabajo Publicado -> Postularse */}
                    {trabajo.estado === 'publicado' && (!usuario || usuario.id_usuario !== trabajo.id_empleador) && (
                        <button
                            onClick={() => {
                                const token = localStorage.getItem("token");
                                if (!token) {
                                    alert("Debes iniciar sesión para postularte");
                                    navigate("/auth");
                                } else {
                                    setMostrarFormPostulacion(!mostrarFormPostulacion);
                                }
                            }}
                            className="w-full md:w-auto px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                        >
                            {mostrarFormPostulacion ? "Cancelar Postulación" : "Postularme"}
                            {mostrarFormPostulacion ? "Cancelar Postulación" : "Postularme"}
                        </button>
                    )}

                    {/* Caso 3: Trabajo en Progreso (Empleador) -> Finalizar */}
                    {trabajo.estado === 'en_progreso' && usuario && usuario.id_usuario === trabajo.id_empleador && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
                            <h3 className="text-lg font-semibold text-orange-900 mb-2">Trabajo en Curso</h3>
                            <p className="text-orange-700 mb-4">
                                Has aceptado a un trabajador. Cuando el trabajo termine, márcalo como finalizado para poder calificarlo.
                            </p>
                            <button
                                onClick={async () => {
                                    if (!window.confirm("¿Confirmas que el trabajo ha sido completado?")) return;
                                    const token = localStorage.getItem("token");
                                    try {
                                        const res = await fetch(`{API_URL}/api/trabajos/${trabajo.id_trabajo}`, {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${token}`
                                            },
                                            body: JSON.stringify({ estado: 'completado' })
                                        });
                                        if (res.ok) {
                                            alert("¡Trabajo marcado como completado!");
                                            cargarTrabajo();
                                            // Recargar para que aparezca el form de calificar
                                        } else {
                                            alert("Error al finalizar el trabajo");
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        alert("Error de conexión");
                                    }
                                }}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                            >
                                ✅ Marcar como Finalizado
                            </button>
                        </div>
                    )}

                    {mostrarFormPostulacion && (
                        <form onSubmit={handlePostular} className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mensaje (opcional)
                            </label>
                            <textarea
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600 mb-3"
                                rows="4"
                                placeholder="Escribe un mensaje para el empleador..."
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                            >
                                Enviar Postulación
                            </button>
                        </form>
                    )}
                </div>

                {/* Postulaciones */}
                {postulaciones.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Postulaciones ({postulaciones.length})
                        </h2>
                        <div className="space-y-4">
                            {postulaciones.map((post) => (
                                <div
                                    key={post.id_postulacion}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {post.trabajador?.nombre} {post.trabajador?.apellido}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(post.fecha_postulacion).toLocaleDateString(
                                                    "es-CO"
                                                )}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${post.estado === "aceptada"
                                                ? "bg-green-100 text-green-800"
                                                : post.estado === "rechazada"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {post.estado}
                                        </span>
                                    </div>
                                    {post.mensaje && (
                                        <p className="text-gray-700 mt-2">{post.mensaje}</p>
                                    )}

                                    {/* Botones para el Empleador */}
                                    {usuario && trabajo && usuario.id_usuario === trabajo.id_empleador && post.estado === 'pendiente' && (
                                        <div className="mt-4 flex gap-3">
                                            <button
                                                onClick={() => handleGestionarPostulacion(post.id_postulacion, 'aceptar')}
                                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                            >
                                                ✅ Aceptar
                                            </button>
                                            <button
                                                onClick={() => handleGestionarPostulacion(post.id_postulacion, 'rechazar')}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                            >
                                                ❌ Rechazar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ModalCalificar
                isOpen={modalCalificarOpen}
                onClose={() => setModalCalificarOpen(false)}
                onSubmit={handleCalificar}
                usuarioReceptor={usuarioAReceptar}
            />
        </div>
    );
}

export default Detalles;
