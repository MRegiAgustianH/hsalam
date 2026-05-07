<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('setoran_hafalan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->foreignId('surah_id')->constrained('surah')->cascadeOnDelete();
            $table->integer('ayat_mulai');
            $table->integer('ayat_selesai');
            $table->date('tanggal');
            $table->enum('nilai', ['mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbul', 'perlu_perbaikan']);
            $table->text('catatan')->nullable();
            $table->foreignId('guru_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setoran_hafalan');
    }
};
