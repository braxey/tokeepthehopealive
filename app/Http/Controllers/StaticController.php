<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class StaticController extends Controller
{
    public function welcome() {
        return Inertia::render('welcome');
    }

    public function privacyPolicy() {
        return Inertia::render('legal/privacy');
    }

    public function termsOfService() {
        return Inertia::render('legal/terms');
    }
}
