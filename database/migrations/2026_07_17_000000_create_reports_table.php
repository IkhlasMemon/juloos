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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('purpose_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('event_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('squad_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('masjid_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('volunteer_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
