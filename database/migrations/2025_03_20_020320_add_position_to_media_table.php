<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up() {
        Schema::table('media', function (Blueprint $table) {
            $table->integer('position')->default(0)->after('type');
        });
    }

    public function down() {
        Schema::table('media', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }
};
