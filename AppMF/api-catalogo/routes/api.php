<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CatalogoController;
use App\Http\Middleware\EnsureTokenIsValid;

// Rutas públicas de autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/recuperar-password', [AuthController::class, 'solicitarRecuperacion']);
Route::post('/restablecer-password', [AuthController::class, 'restablecerPassword']);

// Rutas protegidas por Bearer Token
Route::middleware([EnsureTokenIsValid::class])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/productos', [CatalogoController::class, 'index']);
    Route::get('/productos/{id}', [CatalogoController::class, 'show']);
    Route::post('/solicitudes', [CatalogoController::class, 'crearSolicitud']);
    Route::get('/solicitudes', [CatalogoController::class, 'misSolicitudes']);
    Route::delete('/solicitudes/{id}', [CatalogoController::class, 'cancelarSolicitud']);
    Route::get('/admin/clientes', [CatalogoController::class, 'listarClientes']);
    Route::patch('/solicitudes/{id}/estado', [CatalogoController::class, 'cambiarEstado']);
});