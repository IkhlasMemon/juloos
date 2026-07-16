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
        Schema::create('event_volunteer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('volunteer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('squad_id')->constrained()->restrictOnDelete();
            $table->foreignId('masjid_id')->constrained()->restrictOnDelete();
            $table->foreignId('volunteer_type_id')->constrained()->restrictOnDelete();
            $table->dateTime('registered_at')->useCurrent();
            $table->enum('attendance_status', ['registered', 'attended', 'no_show'])->default('registered');
            $table->timestamps();
            $table->unique(['event_id', 'volunteer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_volunteer');
    }
};
