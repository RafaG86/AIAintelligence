<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('etl_execution_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('service_contracts')->onDelete('cascade');
            $table->string('pipeline_name')->index()->comment('Identificador del flujo en n8n');
            $table->string('trigger_source', 100)->comment('n8n_webhook, manual, cron');
            $table->enum('status', ['success', 'failed', 'running'])->default('running')->index();
            $table->integer('processed_records')->unsigned()->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable()->useCurrent()->index();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('etl_execution_logs');
    }
};
