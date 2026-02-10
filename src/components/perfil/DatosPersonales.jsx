import React, { useEffect, useState } from "react";
import API_URL from '../../config/api';
import Estrellas from "../common/Estrellas";

function DatosPersonales({ usuario, onEdit, onRefresh }) {
    const [promedio, setPromedio] = useState({ promedio: 0, cantidad: 0 });

    useEffect(() => {
        if (usuario?.id_usuario) {
            cargarPromedio();
        }
    }, [usuario]);

    const cargarPromedio = async () => {
        try {
            const res = await fetch(`${API_URL}/api/calificaciones/usuario/${usuario.id_usuario}/promedio`);
            const data = await res.json();
            if (res.ok) {
                setPromedio(data);
            }
        } catch (error) {
            console.error("Error al cargar promedio:", error);
        }
    };

    const handleActivarRol = async (nuevoRol) => {
        if (!window.confirm(`¿Quieres activar el perfil de ${nuevoRol}?`)) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/usuarios/agregar-rol`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rol: nuevoRol })
            });

            if (res.ok) {
                alert(`✅ Ahora tienes el perfil de ${nuevoRol}`);
                onRefresh();
            } else {
                const data = await res.json();
                alert(`❌ Error: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error("Error activando rol:", error);
            alert("❌ Error de conexión");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <img
                        src={usuario.foto_perfil || "https://via.placeholder.com/150"}
                        alt="Foto de perfil"
                        className="w-20 h-20 rounded-full object-cover border-2 border-orange-100"
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {usuario.nombre} {usuario.apellido}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Estrellas puntuacion={promedio.promedio} />
                            <span className="text-sm text-gray-500">
                                ({promedio.cantidad} reseñas)
                            </span>
                        </div>
                        <p className="text-gray-500">{usuario.correo}</p>
                    </div>
                </div>
                <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                    Editar
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="text-gray-900">
                        {usuario.telefono || "No especificado"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${usuario.estado === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                    >
                        {usuario.estado}
                    </span>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Roles</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {usuario.rolesAsignados?.map((rolAsignado) => (
                            <span
                                key={rolAsignado.rol.id_rol}
                                className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full"
                            >
                                {rolAsignado.rol.nombre}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Fecha de registro</p>
                    <p className="text-gray-900">
                        {new Date(usuario.fecha_registro).toLocaleDateString("es-CO")}
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    {!usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") && (
                        <button
                            onClick={() => handleActivarRol("Empleador")}
                            className="w-full mb-2 px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 font-semibold"
                        >
                            💼 Activar modo Empleador
                        </button>
                    )}
                    {!usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador") && (
                        <button
                            onClick={() => handleActivarRol("Trabajador")}
                            className="w-full px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 font-semibold"
                        >
                            🛠️ Activar modo Trabajador
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DatosPersonales;
