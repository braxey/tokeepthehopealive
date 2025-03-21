<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up() {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('preview_caption')->nullable()->after('preview_image');
        });
    }

    public function down() {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('preview_caption');
        });
    }
};
