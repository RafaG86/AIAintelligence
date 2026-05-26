<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->enum('status', ['enrolled', 'completed', 'failed', 'dropped'])->default('enrolled')->index();
            $table->integer('grade')->unsigned()->nullable()->comment('Puntuación final del examen o discipulado (0-100)');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['member_id', 'course_id'], 'uq_member_course');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_enrollments');
    }
};
