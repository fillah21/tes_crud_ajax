<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PersonController;
use Illuminate\Support\Facades\Http;

Route::get('/', function () {
    return redirect('/dashboard');
});

// Routing halaman
Route::get('/dashboard', [PageController::class, 'dashboard']);
Route::get('/crud', [PageController::class, 'crud']);
Route::get('/login', [PageController::class, 'login']);
Route::get('/register', [PageController::class, 'register']);

// Register & Login (POST)
Route::post('/register', [AuthController::class, 'register'])->name('register.post');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [PageController::class, 'dashboard']);
    Route::get('/crud', [PageController::class, 'crud']);

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/people', [PersonController::class, 'index']);
    Route::get('/people/{id}', [PersonController::class, 'show']);
    Route::post('/people/{id}', [PersonController::class, 'update']);
    Route::delete('/people/{id}', [PersonController::class, 'destroy']);
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [PageController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');

    Route::get('/register', [PageController::class, 'register'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
});

Route::post('/people', [PersonController::class, 'store']);

// Ambil provinsi
Route::get('/api/provinces', function() {
    $res = Http::get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
    return $res->json();
});

// Ambil kabupaten berdasarkan id provinsi
Route::get('/api/regencies/{id}', function($id) {
    $res = Http::get("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/$id.json");
    return $res->json();
});

// Ambil kecamatan berdasarkan id kabupaten
Route::get('/api/districts/{id}', function($id) {
    $res = Http::get("https://www.emsifa.com/api-wilayah-indonesia/api/districts/$id.json");
    return $res->json();
});
