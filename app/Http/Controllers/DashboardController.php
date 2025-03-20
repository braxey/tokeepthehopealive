<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {
        $featured = Post::with('votes', 'media')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($featured) {
            $featured->vote_count = $featured->voteCount();
            $featured->preview_image = $featured->preview_image ? asset('storage/' . $featured->preview_image) : ($featured->media->firstWhere('type', 'image')?->url ?? null);
            $featured->first_paragraph = $this->getFirstParagraph($featured->body);
            $featured->media = $featured->media->map(function ($media) {
                $media->url = asset('storage/' . $media->path);
                return $media;
            });
        }

        $posts = $this->getPaginatedPosts($featured?->id);

        return Inertia::render('dashboard', [
            'featured' => $featured,
            'posts' => $posts,
            'canPost' => Auth::check() && Auth::id() === 1,
        ]);
    }

    public function morePosts(Request $request) {
        $featuredId = Post::orderBy('created_at', 'desc')->first()->id;
        $posts = $this->getPaginatedPosts($featuredId);

        return response()->json($posts);
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

    private function getPaginatedPosts($featuredId = null) {
        $posts = Post::with('votes', 'media')
            ->where('id', '!=', $featuredId)
            ->orderBy('created_at', 'desc')
            ->paginate(9);

        $posts->getCollection()->transform(function ($post) {
            $post->vote_count = $post->voteCount();
            $post->preview_image = $post->preview_image ? asset('storage/' . $post->preview_image) : ($post->media->firstWhere('type', 'image')?->url ?? null);
            return $post->only(['id', 'title', 'preview_image', 'vote_count']);
        });

        return $posts;
    }

    private function getFirstParagraph($body) {
        $paragraphs = explode("\n\n", trim($body));
        return $paragraphs[0] ?? $body;
    }
}
