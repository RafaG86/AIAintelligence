<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique()->index();
            $table->string('name');
            $table->text('syllabus')->nullable();
            $table->integer('credits_points')->unsigned()->default(10)->comment('Puntos acumulables en la Carrera Bíblica');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
