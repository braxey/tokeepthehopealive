<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class StaticController extends Controller
{
    /**
     * Show welcome page.
     * @return InertiaResponse
     */
    public function welcome(): InertiaResponse
    {
        return Inertia::render('welcome');
    }

    /**
     * Show privacy policy.
     * @return InertiaResponse
     */
    public function privacyPolicy(): InertiaResponse
    {
        return Inertia::render('legal/privacy');
    }

    /**
     * Show terms of service.
     * @return InertiaResponse
     */
    public function termsOfService(): InertiaResponse
    {
        return Inertia::render('legal/terms');
    }
}
