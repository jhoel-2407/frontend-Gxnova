// Script de prueba para diagnosticar problemas con la API de Railway
// Ejecutar en la consola del navegador (F12)

const API_URL = 'https://backend-gxnova-production.up.railway.app';

console.log('🔍 Iniciando diagnóstico de API...\n');

// Test 1: Endpoint raíz
console.log('Test 1: Probando endpoint raíz (/)');
fetch(`${API_URL}/`)
    .then(res => {
        console.log('✅ Status:', res.status);
        return res.text();
    })
    .then(text => {
        console.log('📄 Respuesta:', text.substring(0, 200));
        try {
            const json = JSON.parse(text);
            console.log('✅ Es JSON válido:', json);
        } catch {
            console.log('❌ No es JSON, es HTML o texto plano');
        }
    })
    .catch(err => console.error('❌ Error:', err));

// Test 2: Endpoint de notificaciones (sin auth)
setTimeout(() => {
    console.log('\nTest 2: Probando /api/notificaciones/no-leidas (sin token)');
    fetch(`${API_URL}/api/notificaciones/no-leidas`)
        .then(res => {
            console.log('Status:', res.status);
            return res.text();
        })
        .then(text => {
            console.log('Respuesta:', text.substring(0, 200));
        })
        .catch(err => console.error('Error:', err));
}, 2000);

// Test 3: Con token (si existe)
setTimeout(() => {
    const token = localStorage.getItem('token');
    if (token) {
        console.log('\nTest 3: Probando con token de autenticación');
        fetch(`${API_URL}/api/notificaciones/no-leidas`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log('Status:', res.status);
                return res.text();
            })
            .then(text => {
                console.log('Respuesta:', text.substring(0, 200));
                try {
                    const json = JSON.parse(text);
                    console.log('✅ JSON:', json);
                } catch {
                    console.log('❌ No es JSON');
                }
            })
            .catch(err => console.error('Error:', err));
    } else {
        console.log('\nTest 3: Saltado (no hay token en localStorage)');
    }
}, 4000);

console.log('\n⏳ Ejecutando tests... espera 5 segundos para ver todos los resultados');
