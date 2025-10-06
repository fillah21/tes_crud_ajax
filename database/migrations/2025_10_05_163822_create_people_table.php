<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 50);
            $table->date('tgl_lahir')->nullable();
            $table->string('agama')->nullable();
            $table->string('provinsi')->nullable();
            $table->string('kabupaten')->nullable();
            $table->string('desa')->nullable();
            $table->string('hobi')->nullable(); // simpan array jadi string
            $table->string('status')->nullable();
            $table->string('image')->nullable(); // simpan path gambar
            $table->text('files')->nullable();   // simpan path multi file JSON
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};
