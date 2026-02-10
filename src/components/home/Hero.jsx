import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-16">
            <div className="container mx-auto px-4 max-w-5xl text-center space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-orange-600 font-semibold">
                    Plataforma freelance colombiana
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Encuentra talento especializado o proyectos a tu medida
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Conecta con profesionales y empresas verificadas, gestiona acuerdos y
                    pagos de forma segura y haz crecer tu red de contactos.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        className="px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                        onClick={() => navigate("/auth")}
                    >
                        Empezar ahora
                    </button>
                    <button
                        className="px-6 py-3 rounded-xl border border-orange-200 text-orange-700 font-semibold hover:bg-white transition-all"
                        onClick={() => navigate("/servicios")}
                    >
                        Ver servicios publicados
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Hero;
