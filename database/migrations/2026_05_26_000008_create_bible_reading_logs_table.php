<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bible_reading_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->string('book_name', 100);
            $table->integer('chapter_number')->unsigned();
            $table->timestamp('read_at')->nullable()->useCurrent();

            $table->unique(['member_id', 'book_name', 'chapter_number'], 'uq_member_book_chapter');
            $table->index(['member_id', 'book_name'], 'idx_reading_member_book');
            $table->index(['member_id', 'read_at'], 'idx_reading_member_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bible_reading_logs');
    }
};
