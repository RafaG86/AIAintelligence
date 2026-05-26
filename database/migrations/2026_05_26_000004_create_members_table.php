<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained('users')->onDelete('set null');
            $table->string('first_name', 150);
            $table->string('last_name', 150);
            $table->string('phone', 50)->nullable();
            $table->date('birth_date')->nullable();
            $table->date('baptism_date')->nullable();
            $table->enum('spiritual_status', [
                'nuevo_convertido', 'en_discipulado', 'bautizado', 'lider', 'pastor', 'inactivo'
            ])->default('nuevo_convertido')->index();
            $table->foreignId('mentor_id')->nullable()->constrained('members')->onDelete('set null');
            $table->timestamps();

            $table->unique(['first_name', 'last_name', 'phone'], 'uq_member_name_phone');
            $table->index(['last_name', 'first_name'], 'idx_members_names');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
