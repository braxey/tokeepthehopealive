<?php

namespace App\Http\Controllers;

class DashboardController extends Controller
{
    public function index() {
        return to_route('posts.index');
    }
}
