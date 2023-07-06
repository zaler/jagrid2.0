<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDatesToIndexEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('index_events', function (Blueprint $table) {
            $table->string('type')->nullable();
            $table->date('date')->nullable();
            $table->smallInteger('year')->nullable();
            $table->smallInteger('month')->nullable();
            $table->smallInteger('week')->nullable();
            $table->smallInteger('day')->nullable();
            $table->boolean('is_temporary')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('index_events', function (Blueprint $table) {
            //
        });
    }
}
