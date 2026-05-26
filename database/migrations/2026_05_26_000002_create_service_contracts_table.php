<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services')->onDelete('restrict');
            $table->enum('status', ['active', 'paused', 'terminated'])->default('active')->index();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->json('config_metadata')->nullable()->comment('Parámetros de conexión de n8n, credenciales cifradas, etc.');
            $table->timestamps();

            $table->index(['start_date', 'end_date'], 'idx_contracts_dates');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_contracts');
    }
};
