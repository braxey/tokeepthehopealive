<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class StaticController extends Controller
{
    /**
     * Show welcome page.
     */
    public function welcome(): InertiaResponse
    {
        return Inertia::render('welcome');
    }

    /**
     * Show privacy policy.
     */
    public function privacyPolicy(): InertiaResponse
    {
        return Inertia::render('legal/privacy');
    }

    /**
     * Show terms of service.
     */
    public function termsOfService(): InertiaResponse
    {
        return Inertia::render('legal/terms');
    }
}
