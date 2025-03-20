<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller {
    public function create() {
        if (Auth::id() !== 1) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized');
        }

        return Inertia::render('posts/create');
    }

    public function store(Request $request) {
        if (Auth::id() !== 1) {
            return back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'preview_image' => 'nullable|file|mimes:jpg,png,gif|max:10240', // Separate preview image
            'media.*' => 'nullable|file|mimes:jpg,png,gif,mp4,webm|max:10240',
            'media_positions' => 'nullable|array',
            'media_positions.*' => 'integer',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'body' => $request->body,
            'user_id' => Auth::id(),
            'preview_image' => $request->hasFile('preview_image') ? $request->file('preview_image')->store('posts', 'public') : null,
        ]);

        if ($request->hasFile('media')) {
            $positions = $request->input('media_positions', []);
            foreach ($request->file('media') as $index => $file) {
                $path = $file->store('posts', 'public');
                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';
                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => $positions[$index] ?? $index,
                ]);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Post created!');
    }

    public function show(Post $post) {
        $post->load('votes', 'media');
        $post->vote_count = $post->voteCount();
        $post->media = $post->media->sortBy('position')->map(function ($media) {
            $media->url = asset('storage/' . $media->path);
            return $media;
        });
        $post->preview_image = $post->preview_image ? asset('storage/' . $post->preview_image) : null;
    
        return Inertia::render('posts/show', [
            'post' => $post,
        ]);
    }
}
