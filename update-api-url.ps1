# Script para actualizar las URLs de la API en todos los componentes
$files = @(
    "src\components\admin\AdminAnalytics.jsx",
    "src\components\admin\AdminCategorias.jsx",
    "src\components\admin\AdminConfig.jsx",
    "src\components\admin\AdminDashboard.jsx",
    "src\components\admin\AdminReportes.jsx",
    "src\components\admin\AdminRoles.jsx",
    "src\components\admin\AdminTrabajos.jsx",
    "src\components\admin\AdminUsuarios.jsx",
    "src\components\admin\AdminVerificacion.jsx",
    "src\components\perfil\DatosPersonales.jsx",
    "src\components\perfil\FormularioPerfil.jsx",
    "src\components\perfil\MisPublicaciones.jsx",
    "src\components\perfil\SeccionHabilidades.jsx",
    "src\components\Auth.jsx",
    "src\components\CrearTrabajo.jsx",
    "src\components\Detalles.jsx",
    "src\components\Encabezado.jsx",
    "src\components\Home.jsx",
    "src\components\Notificaciones.jsx",
    "src\components\Perfil.jsx",
    "src\components\Servicios.jsx"
)

foreach ($file in $files) {
    Write-Host "Procesando: $file" -ForegroundColor Cyan
    
    # Leer el contenido del archivo
    $content = Get-Content $file -Raw -Encoding UTF8
    
    # Verificar si ya tiene el import
    $hasImport = $content -match "import API_URL from"
    
    # Agregar el import si no existe
    if (-not $hasImport) {
        # Determinar la ruta relativa correcta
        $depth = ($file -split "\\").Count - 2  # Restar 2 por "src" y el archivo mismo
        $relativePath = "../" * $depth + "config/api"
        
        # Buscar la última línea de import
        $lines = $content -split "`r?`n"
        $lastImportIndex = -1
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "^import ") {
                $lastImportIndex = $i
            }
        }
        
        if ($lastImportIndex -ge 0) {
            # Insertar después del último import
            $lines = $lines[0..$lastImportIndex] + "import API_URL from '$relativePath';" + $lines[($lastImportIndex + 1)..($lines.Count - 1)]
            $content = $lines -join "`r`n"
        }
    }
    
    # Reemplazar todas las ocurrencias de localhost
    $content = $content -replace 'http://localhost:3000', '${API_URL}'
    $content = $content -replace '"http://localhost:3000', '`${API_URL}'
    $content = $content -replace "'http://localhost:3000", '`${API_URL}'
    
    # Guardar el archivo
    Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
    Write-Host "✓ Actualizado: $file" -ForegroundColor Green
}

Write-Host "`n✅ Todos los archivos han sido actualizados!" -ForegroundColor Green
Write-Host "Ahora todos los componentes usan la API de producción: https://backend-gxnova-production.up.railway.app" -ForegroundColor Yellow
