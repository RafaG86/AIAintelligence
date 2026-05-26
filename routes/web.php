<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\AdminDashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas Web - AIAIntelligence
|--------------------------------------------------------------------------
*/

// 1. Rutas Públicas (Storefront & Demos)
Route::get('/', [StorefrontController::class, 'index'])->name('storefront.index');
Route::get('/api/demo/run', [StorefrontController::class, 'getDemoSteps'])->name('storefront.demo.run');

// 2. Ruta de Redirección Central del Dashboard
Route::get('/dashboard', function () {
    $user = Auth::user();
    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('client.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// 3. Rutas Protegidas - Clientes de Automatización
Route::middleware(['auth', 'verified'])->prefix('client')->group(function () {
    Route::get('/dashboard', [ClientDashboardController::class, 'index'])->name('client.dashboard');
    Route::put('/contracts/{id}/config', [ClientDashboardController::class, 'updateConfig'])->name('client.contracts.config');
    Route::post('/contracts/{id}/run', [ClientDashboardController::class, 'runSimulatedPipeline'])->name('client.contracts.run');
    Route::post('/logs/{log_id}/complete', [ClientDashboardController::class, 'completeLog'])->name('client.logs.complete');
    
    // Tickets de Soporte
    Route::get('/tickets', [SupportTicketController::class, 'index'])->name('tickets.index');
    Route::post('/tickets', [SupportTicketController::class, 'store'])->name('tickets.store');
    Route::get('/tickets/{id}', [SupportTicketController::class, 'show'])->name('tickets.show');
    Route::post('/tickets/{id}/reply', [SupportTicketController::class, 'reply'])->name('tickets.reply');
});

// 4. Rutas Protegidas - Super Administrador (AIAIntelligence Admin)
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    
    // CRUD Catálogo de Servicios
    Route::get('/services', [AdminDashboardController::class, 'servicesIndex'])->name('admin.services.index');
    Route::post('/services', [AdminDashboardController::class, 'servicesStore'])->name('admin.services.store');
    Route::put('/services/{id}', [AdminDashboardController::class, 'servicesUpdate'])->name('admin.services.update');
    Route::delete('/services/{id}', [AdminDashboardController::class, 'servicesDestroy'])->name('admin.services.destroy');
    
    // Gestión de Licencias e Integraciones de Clientes
    Route::get('/contracts', [AdminDashboardController::class, 'contractsIndex'])->name('admin.contracts.index');
    Route::post('/contracts', [AdminDashboardController::class, 'contractsStore'])->name('admin.contracts.store');
    Route::put('/contracts/{id}', [AdminDashboardController::class, 'contractsUpdate'])->name('admin.contracts.update');
    
    // Helpdesk de Soporte
    Route::get('/tickets', [AdminDashboardController::class, 'ticketsIndex'])->name('admin.tickets.index');
    Route::get('/tickets/{id}', [AdminDashboardController::class, 'ticketsShow'])->name('admin.tickets.show');
    Route::post('/tickets/{id}/reply', [AdminDashboardController::class, 'ticketsReply'])->name('admin.tickets.reply');
});

// 5. Rutas de Compra (Checkout Simulator)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout/{service_id}', [StorefrontController::class, 'checkout'])->name('checkout.show');
    Route::post('/checkout/{service_id}/process', [StorefrontController::class, 'processCheckout'])->name('checkout.process');
    
    // Perfil de Usuario estándar de Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
