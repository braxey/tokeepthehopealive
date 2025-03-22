<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function create()
    {
        if (Auth::id() !== 1) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized');
        }

        return Inertia::render('posts/create');
    }

    public function store(Request $request)
    {
        if (Auth::id() !== 1) {
            return back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|array|min:1',
            'body.*.section_title' => 'nullable|string|max:255',
            'body.*.section_text' => 'nullable|string',
            'summary' => 'required|string',
            'preview_image' => 'nullable|file|mimes:jpg,png,gif|max:10240',
            'preview_caption' => 'nullable|string|max:255',
            'media.*' => 'nullable|file|mimes:jpg,png,gif,mp4,webm|max:10240',
            'media_positions' => 'nullable|array',
            'media_positions.*' => 'integer',
            'media_captions' => 'nullable|array',
            'media_captions.*' => 'string|nullable|max:255',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'body' => $request->body,
            'summary' => $request->summary,
            'user_id' => Auth::id(),
            'preview_image' => $request->hasFile('preview_image') ? $request->file('preview_image')->store('posts', 'public') : null,
            'preview_caption' => $request->input('preview_caption'),
        ]);

        if ($request->hasFile('media')) {
            $positions = $request->input('media_positions', []);
            $captions = $request->input('media_captions', []);
            foreach ($request->file('media') as $index => $file) {
                $path = $file->store('posts', 'public');
                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';
                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => $positions[$index] ?? $index,
                    'caption' => $captions[$index] ?? null,
                ]);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Post created!');
    }

    public function show(Post $post)
    {
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
