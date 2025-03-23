<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index() {
        return response()->json();
    }

    public function store(Request $request) {
        if (Auth::id() !== 1) {
            return back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'media.*' => 'nullable|file|mimes:jpg,png,gif,mp4,webm|max:10240',
            'media_positions' => 'nullable|array',
            'media_positions.*' => 'integer',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'body' => $request->body,
            'user_id' => Auth::id(),
        ]);

        if ($request->hasFile('media')) {
            $positions = $request->input('media_positions', []);
            foreach ($request->file('media') as $index => $file) {
                $path = $file->store('posts', 'public');
                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';
                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => $positions[$index] ?? $index, // Default to order if no position
                ]);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Post created!');
    }

    public function search(Request $request) {
        $query = $request->input('query');

        $posts = Post::with('votes', 'media')
            ->where('title', 'like', "%{$query}%")
            ->orWhere('body', 'like', "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->paginate(9);

        $posts->getCollection()->transform(function ($post) {
            $post->vote_count = $post->voteCount();
            $post->preview_image = $post->media->firstWhere('type', 'image')?->url ?? null;
            return $post->only(['id', 'title', 'preview_image', 'vote_count']);
        });

        return response()->json($posts);
    }
}
