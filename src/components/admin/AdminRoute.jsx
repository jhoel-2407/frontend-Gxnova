import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const usuarioStored = localStorage.getItem('usuario');

    if (!usuarioStored) {
        return <Navigate to="/auth" replace />;
    }

    const usuario = JSON.parse(usuarioStored);

    // Verificar si tiene el rol de Administrador
    const esAdmin = usuario.rolesAsignados?.some(r => r.rol.nombre === 'Administrador');

    if (!esAdmin) {
        // Si está logueado pero no es admin, lo mandamos al inicio (o a una página de 403)
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
