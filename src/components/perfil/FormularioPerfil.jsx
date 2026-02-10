import React, { useState } from "react";
import API_URL from '../../config/api';

function FormularioPerfil({ usuario, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo: usuario.correo || "",
        telefono: usuario.telefono || "",
        foto_perfil: null,
    });
    const [preview, setPreview] = useState(usuario.foto_perfil || "");

    const handleActualizar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('apellido', formData.apellido);
        data.append('correo', formData.correo);
        data.append('telefono', formData.telefono);
        if (formData.foto_perfil) {
            data.append('foto_perfil', formData.foto_perfil);
        }

        try {
            const respuesta = await fetch(
                `${API_URL}/api/usuarios/${usuario.id_usuario}`,
                {
                    method: "PUT",
                    headers: {
                        // "Content-Type": "multipart/form-data", // Fetch sets this automatically with FormData
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                }
            );

            const result = await respuesta.json();

            if (respuesta.ok) {
                alert("✅ Perfil actualizado exitosamente");
                onSuccess();
            } else {
                alert(`❌ Error: ${result.error || result.message}`);
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("❌ Error de conexión con el servidor");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, foto_perfil: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleActualizar} className="space-y-4">
            {/* Preview de la foto */}
            <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24">
                    <img
                        src={preview || "https://via.placeholder.com/150"}
                        alt="Preview"
                        className="w-full h-full rounded-full object-cover border-2 border-orange-200"
                    />
                    <label htmlFor="file-upload" className="absolute bottom-0 right-0 bg-orange-600 text-white p-1 rounded-full cursor-pointer hover:bg-orange-700 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                    </label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) =>
                            setFormData({ ...formData, nombre: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-indigo-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido
                    </label>
                    <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) =>
                            setFormData({ ...formData, apellido: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-indigo-600"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo
                </label>
                <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) =>
                        setFormData({ ...formData, correo: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                </label>
                <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                    Guardar Cambios
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}

export default FormularioPerfil;
