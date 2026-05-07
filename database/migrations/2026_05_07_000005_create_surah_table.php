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
        Schema::create('surah', function (Blueprint $table) {
            $table->id();
            $table->integer('nomor')->unique();
            $table->string('nama'); // Arabic name
            $table->string('nama_latin'); // Latin name
            $table->integer('jumlah_ayat');
            $table->integer('juz')->default(30);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surah');
    }
};
