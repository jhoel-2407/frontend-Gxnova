import React from "react";

function RegisterForm({
    handleRegister,
    nombre,
    setNombre,
    apellido,
    setApellido,
    emailRegister,
    setEmailRegister,
    passwordRegister,
    setPasswordRegister,
    confirmPassword,
    setConfirmPassword,
    telefono,
    setTelefono,
    rolNombre,
    setRolNombre,
    showRegisterPassword,
    setShowRegisterPassword,
    PRIMARY_COLOR,
    HOVER_COLOR
}) {
    return (
        <form className="space-y-4" onSubmit={handleRegister}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Crear cuenta</h2>
                <p className="text-sm text-gray-500">
                    Únete a GXNOVA y comienza tu experiencia
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Nombre"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="apellido" className="text-sm font-medium text-gray-700">Apellido</label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Pérez"
                        required
                    />
                </div>
            </div>

            {/* Teléfono y Rol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="telefono" className="text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Ej: 300 123 4567"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="rol" className="text-sm font-medium text-gray-700">¿Qué buscas?</label>
                    <select
                        id="rol"
                        name="rol"
                        value={rolNombre}
                        onChange={(e) => setRolNombre(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                    >
                        <option value="Trabajador">Quiero Trabajar</option>
                        <option value="Empleador">Quiero Contratar</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="correo" className="text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={emailRegister}
                    onChange={(e) => setEmailRegister(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                    placeholder="tu@email.com"
                    required
                />
            </div>

            {/* Input Contraseña */}
            <div className="space-y-1 pt-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                    <input
                        type={showRegisterPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={passwordRegister}
                        onChange={(e) => setPasswordRegister(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowRegisterPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="h-5 w-5">{showRegisterPassword ? "🙈" : "👁"}</span>
                    </button>
                </div>
            </div>

            {/* Input Confirmar Contraseña */}
            <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar contraseña
                </label>
                <div className="relative">
                    <input
                        type={showRegisterPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Repite la contraseña"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className={`group relative flex w-full justify-center rounded-md bg-${PRIMARY_COLOR} px-4 py-2 text-sm font-medium text-white hover:bg-${HOVER_COLOR} focus:outline-none focus:ring-2 focus:ring-${PRIMARY_COLOR}/50 transition duration-150`}
            >
                Crear cuenta
            </button>
        </form>
    );
}

export default RegisterForm;
