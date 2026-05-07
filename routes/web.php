<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\SetoranHafalanController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\TahunAjaranController;
use App\Http\Controllers\TargetHafalanController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin only routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('tahun-ajaran', TahunAjaranController::class)->except(['create', 'edit', 'show']);
        Route::resource('kelas', KelasController::class)->except(['create', 'edit', 'show']);
        Route::resource('siswa', SiswaController::class)->except(['create', 'edit', 'show']);
        Route::resource('guru', GuruController::class)->except(['create', 'edit', 'show']);
    });

    // Admin & Guru routes
    Route::middleware('role:admin,guru')->group(function () {
        Route::resource('target-hafalan', TargetHafalanController::class)->except(['create', 'edit', 'show']);
        Route::get('setoran', [SetoranHafalanController::class, 'index'])->name('setoran.index');
        Route::post('setoran', [SetoranHafalanController::class, 'store'])->name('setoran.store');
        Route::get('setoran/{siswa}', [SetoranHafalanController::class, 'show'])->name('setoran.show');
        Route::put('setoran/{setoran}', [SetoranHafalanController::class, 'update'])->name('setoran.update');
        Route::delete('setoran/{setoran}', [SetoranHafalanController::class, 'destroy'])->name('setoran.destroy');
    });
});

require __DIR__.'/settings.php';
