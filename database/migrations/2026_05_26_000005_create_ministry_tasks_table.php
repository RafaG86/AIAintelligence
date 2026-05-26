<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ministry_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('minister_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'failed'])->default('pending')->index();
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium')->index();
            $table->date('due_date')->index();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ministry_tasks');
    }
};
