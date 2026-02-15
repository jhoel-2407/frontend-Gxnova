import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t-4 border-orange-600 text-white mt-16">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sobre GXNova */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">GXNova</h3>
                        <p className="text-gray-400 text-sm">
                            Plataforma freelance colombiana que conecta talento con oportunidades.
                        </p>
                    </div>

                    {/* Enlaces Rápidos */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contactanos</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button
                                    onClick={() => navigate("/servicios")}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    gxnova@gmail.com
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/crear-trabajo")}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Whatsapp
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/auth")}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    30566-3232-123
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Para Empleadores */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Para Empleadores</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Publicar proyectos</li>
                            <li>Encontrar talento</li>
                            <li>Gestionar acuerdos</li>
                            <li>Calificar trabajadores</li>
                        </ul>
                    </div>

                    {/* Para Trabajadores */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Para Trabajadores</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Buscar proyectos</li>
                            <li>Postularse a trabajos</li>
                            <li>Gestionar acuerdos</li>
                            <li>Construir tu perfil</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} GXNova - Todos los derechos reservados
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

