import React, { useState, useEffect } from "react";
import API_URL from '../config/api';
import { useNavigate } from "react-router-dom";
import Encabezado from "./Encabezado";
import DatosPersonales from "./perfil/DatosPersonales";
import FormularioPerfil from "./perfil/FormularioPerfil";
import SeccionHabilidades from "./perfil/SeccionHabilidades";
import MisPublicaciones from "./perfil/MisPublicaciones";

function Perfil() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
            return;
        }

        setLoading(true);
        try {
            const respuesta = await fetch(`${API_URL}/api/usuarios/perfil`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (respuesta.status === 401) {
                localStorage.removeItem("token");
                navigate("/auth");
                return;
            }

            const data = await respuesta.json();
            if (data.usuario) {
                setUsuario(data.usuario);
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">No se pudo cargar el perfil</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Encabezado />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

                <div className="bg-white rounded-lg shadow-md p-6">
                    {!editando ? (
                        <>
                            <DatosPersonales
                                usuario={usuario}
                                onEdit={() => setEditando(true)}
                                onRefresh={cargarPerfil}
                            />

                            {/* SECCIÓN DE HABILIDADES (Solo si tiene rol Trabajador) */}
                            {usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador") && (
                                <SeccionHabilidades usuarioId={usuario.id_usuario} />
                            )}

                            {/* SECCIÓN DE MIS PUBLICACIONES (Solo si tiene rol Empleador) */}
                            {usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") && (
                                <MisPublicaciones usuarioId={usuario.id_usuario} />
                            )}
                        </>

                    ) : (
                        <FormularioPerfil
                            usuario={usuario}
                            onCancel={() => setEditando(false)}
                            onSuccess={() => {
                                setEditando(false);
                                cargarPerfil();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Perfil;
