<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->text('title');
            $table->text('description')->nullable();
            $table->string('url')->unique();
            $table->dateTime('start');
            $table->dateTime('end')->nullable();
            $table->boolean('allDay')->default(0);
            $table->foreignId('event_type_id')->constrained()->onDelete('cascade');
            $table->text('objective')->nullable();
            $table->text('copy')->nullable();
            $table->text('copy_image')->nullable();
            $table->text('instructions')->nullable();
            $table->foreignId('event_status_id')->default(1)->constrained()->onDelete('cascade');
            $table->boolean('isIndex')->default(false);
            $table->text('indexes')->nullable();
            $table->boolean('isExternalEvent')->default(false);
            $table->integer('external_event_id')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
