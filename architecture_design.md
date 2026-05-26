# AIAIntelligence OS - Especificación de Arquitectura de Software
## Autor: Arquitecto de Software Senior y Especialista en Cloud

Este documento describe la arquitectura de software, la organización del repositorio y el diseño del sistema de control de acceso para **AIAIntelligence**, la plataforma integral de servicios de automatización de procesos e Inteligencia Artificial.

---

## 1. Patrón Arquitectónico e Integración Tecnológica

Para **AIAIntelligence**, se implementa un **Monolito Híbrido** utilizando **Laravel 11** en el backend y **React 18 (TypeScript) + Tailwind CSS** en el frontend, acoplados de forma transparente mediante **Inertia.js**. 

### Flujo de Datos y Componentes del Sistema

El siguiente diagrama detalla cómo fluyen las peticiones de los usuarios, cómo se integran los servicios de IA y automatización (n8n, Python) y cómo se procesan las tareas asíncronas mediante colas (Redis):

```mermaid
graph TD
    %% Clientes y Usuarios
    User([Usuario / Navegador]) -->|HTTPS (React + Inertia)| Nginx[Nginx Proxy Inverso]
    
    %% Servidor Web y App
    Nginx -->|Proxy Pass| PHP[PHP 8.3 FPM / Laravel 11]
    
    %% Controladores y Lógica
    subgraph Laravel Application [Backend: Laravel 11 Core]
        Auth[Módulo de Seguridad & RBAC] --> AuthCtrl[Controllers / Inertia Responses]
        AuthCtrl --> Modules[Estructura Modular]
        
        subgraph Modulos [Módulos del Dominio]
            AutomationMod[Módulo Core: Servicios Automatización / IA]
            ChurchMod[Módulo Ekklesia: Gestión Iglesias / Carrera Bíblica]
        end
        
        Modules --> AutomationMod
        Modules --> ChurchMod
    end
    
    %% Cache y Colas
    PHP -->|Cache / Sessions / Queues| Redis[(Redis Broker)]
    Redis -->|Laravel Queue Workers| QueueWorker[Procesadores de Colas]
    
    %% Base de Datos
    PHP -->|Eloquent ORM| MySQL[(MySQL 8.0 DB)]
    QueueWorker -->|Updates| MySQL
    
    %% Integración con n8n y Python
    subgraph Automatizacion e IA [Entorno de Automatización]
        n8n[Servidor n8n] -->|Webhooks / API HTTPS| PHP
        PHP -->|HTTP Request / Webhook Trigger| n8n
        n8n -->|Executes| Python[Contenedor Python ETL / Pandas]
        Python -->|Cleaned Data| MySQL
    end

    classDef primary fill:#4F46E5,stroke:#312E81,stroke-width:2px,color:#fff;
    classDef secondary fill:#0EA5E9,stroke:#0369A1,stroke-width:2px,color:#fff;
    classDef database fill:#10B981,stroke:#065F46,stroke-width:2px,color:#fff;
    classDef external fill:#F59E0B,stroke:#B45309,stroke-width:2px,color:#fff;
    
    class User,Nginx,PHP,QueueWorker primary;
    class Auth,AuthCtrl,Modules,AutomationMod,ChurchMod secondary;
    class MySQL,Redis database;
    class n8n,Python external;
```

---

## 2. Estructura de Directorios del Proyecto

El repositorio está estructurado bajo las mejores prácticas de Laravel 11 e Inertia.js, optimizado para el comercio electrónico y soporte de soluciones de Inteligencia Artificial dentro de la marca **AIAIntelligence**:

```text
aiaintelligence/
├── app/                        # Backend: Directorio principal de Laravel
├── app/Http/Controllers/       # Controladores (Storefront, ClientDashboard, SupportTicket)
├── app/Models/                 # Modelos Core (User, Service, ServiceContract, SupportTicket, TicketReply, etc.)
├── bootstrap/                  # Configuración de inicialización de la app
├── config/                     # Archivos de configuración (app, db, redis, mail, etc.)
├── database/                   # Migraciones y factorías de la base de datos
│   ├── factories/              # Generadores de datos falsos para tests
│   ├── migrations/             # Migraciones del Core y Módulos
│   └── seeders/                # Sembradores de datos iniciales y roles
├── docker/                     # Configuraciones de contenedores por servicio
│   ├── nginx/                  # Archivo de configuración de Nginx (default.conf)
│   └── php/                    # Configuraciones custom de PHP (local.ini)
├── python/                     # Scripts y entornos de Inteligencia Artificial & ETL
│   ├── etl_scripts/            # Scripts de limpieza de datos con Pandas
│   ├── requirements.txt        # Dependencias de Python
│   └── venv/                   # Entorno virtual local (ignorado en git)
├── resources/                  # Frontend: Vistas y assets
│   ├── css/                    # Hoja de estilos principal (Tailwind)
│   │   └── app.css
│   ├── js/                     # Componentes e interfaces de React + Inertia
│   │   ├── Components/         # Componentes UI reutilizables (Buttons, Modals)
│   │   ├── Layouts/            # Diseños de página base (DashboardLayout, ChurchLayout)
│   │   ├── Pages/              # Vistas de React representadas por Inertia
│   │   │   ├── Auth/           # Login, Registro, Recuperar Contraseña
│   │   │   ├── Automation/     # Panel de Automatizaciones, Agentes y ETL
│   │   │   └── Ekklesia/       # Registro de Miembros, Carrera Bíblica, Tareas
│   │   └── app.tsx             # Inicializador de React + Inertia + TypeScript
│   └── views/                  # Plantilla Blade raíz (app.blade.php)
├── routes/                     # Rutas de la aplicación
│   ├── api.php                 # Rutas API públicas e integraciones (n8n Webhooks)
│   ├── web.php                 # Rutas de interfaz web protegidas
│   └── console.php             # Rutas de comandos de consola
├── storage/                    # Logs, sesiones, subidas y cachés locales
├── tests/                      # Pruebas automatizadas (Unitarias y de Integración)
├── .env.example                # Plantilla de variables de entorno
├── docker-compose.yml          # Orquestador local de servicios Docker
├── Dockerfile                  # Configuración de compilación de la imagen de producción
├── package.json                # Dependencias de Node.js y compilador Vite
├── postcss.config.js           # Configuración de PostCSS para Tailwind
├── tailwind.config.js          # Configuración del Design System de Tailwind CSS
├── tsconfig.json               # Configuración de TypeScript
└── vite.config.js              # Configuración de Vite para compilar assets React
```

---

## 3. Matriz de Seguridad y Roles (RBAC - Role-Based Access Control)

Para garantizar la máxima seguridad en **AIAIntelligence**, implementaremos un esquema de **Roles y Permisos** con asignación estricta a nivel de Base de Datos y validación en Middleware. El sistema cuenta con 2 roles principales:

| Rol | Descripción del Acceso | Alcance en AIAIntelligence |
| :--- | :--- | :--- |
| **Super Administrador** | Acceso total e ilimitado al backend global y catálogo. | Gestionar el catálogo de soluciones IA, contratos de clientes, responder tickets de soporte y ver métricas globales. |
| **Cliente** | Representa al cliente de la empresa de automatización. | Acceso exclusivo al **Portal de Clientes**: Ver y configurar sus automatizaciones, disparar ejecuciones simuladas de consola, ver logs de ETL, y enviar tickets de soporte técnico. |

### Implementación Técnica del Middleware de Control de Roles

A nivel de código Laravel, las peticiones HTTP se filtran mediante un middleware de control de rol:

```php
// app/Http/Middleware/CheckRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Si es SuperAdmin, tiene paso libre por defecto
        if ($request->user()->isAdmin()) {
            return $next($request);
        }

        foreach ($roles as $role) {
            if ($request->user()->role === $role) {
                return $next($request);
            }
        }

        abort(403, 'No posees los privilegios requeridos para acceder a esta sección.');
    }
}
```

En las rutas (`routes/web.php`), los endpoints se protegen de manera limpia:

```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Grupo para Clientes de Automatización
    Route::middleware(['role:cliente'])->prefix('client')->group(function () {
        Route::get('/dashboard', [ClientDashboardController::class, 'index'])->name('client.dashboard');
        Route::post('/contracts/{id}/run', [ClientDashboardController::class, 'runSimulatedPipeline']);
        Route::put('/contracts/{id}/config', [ClientDashboardController::class, 'updateConfig']);
        Route::resource('tickets', SupportTicketController::class);
    });

    // Grupo para Super Administradores
    Route::middleware(['role:super-admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::resource('services', AdminServiceController::class);
        Route::resource('contracts', AdminContractController::class);
        Route::get('/tickets', [AdminDashboardController::class, 'ticketsIndex'])->name('admin.tickets.index');
        Route::get('/tickets/{id}', [AdminDashboardController::class, 'ticketsShow'])->name('admin.tickets.show');
        Route::post('/tickets/{id}/reply', [AdminDashboardController::class, 'ticketsReply'])->name('admin.tickets.reply');
    });
});
```

---

## 4. Revisión de Código y Posibles Mejoras (Investigación de Optimización)

Destacamos las siguientes **oportunidades de mejora y optimización** clave para la arquitectura de **AIAIntelligence**:

1. **Capa de Abstracción de IA con FastAPI:** En lugar de invocar scripts locales de Python de forma síncrona en Laravel (lo que puede bloquear peticiones si el modelo de IA tarda en responder), es óptimo exponer los agentes de IA y los scripts de Pandas/ETL mediante una API asíncrona construida con **FastAPI** en su propio contenedor Docker. Laravel o n8n se comunicarán con FastAPI mediante peticiones HTTP asíncronas seguras, mejorando la disponibilidad del servidor.
2. **Cola de Tareas con Redis:** Implementar colas de Redis para el procesamiento asíncrono en segundo plano (por ejemplo, para el procesamiento de logs de pipelines de larga duración y el envío de notificaciones por email de soporte resuelto), reduciendo sustancialmente los tiempos de respuesta del portal.
3. **Carga Ansiosa en Relaciones Eloquent:** Asegurar la carga de relaciones mediante `with()` en el backend al renderizar chats de soporte y logs históricos para evitar el problema de consultas $N+1$, garantizando una experiencia de usuario rápida y fluida.
