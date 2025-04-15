<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

final class MediaController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpeg,png,gif,mp4,webm', 'max:2048'],
        ]);

        $file = $request->file('file');
        [$userId, $now, $uuid] = [Auth::id(), now()->getTimestamp(), uuidv4()];
        $extension = $file->getClientOriginalExtension();
        $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';

        $path = "media/{$type}-{$userId}-{$now}-{$uuid}.{$extension}";
        app()->isLocal()
            ? $file->storePubliclyAs($path)
            : $file->storeAs($path, ['CacheControl' => 'max-age=31536000, public']);

        $media = Media::create([
            'mediable_type' => 'App\Models\Post',
            'mediable_id' => 0,
            'path' => $path,
            'type' => $type,
        ]);

        // Save the uploaded media ID to be linked to the post when the post is created/updated.
        $uploadedMediaIds = session('uploaded_media_ids', []);
        $uploadedMediaIds[] = $media->id;
        session(['uploaded_media_ids' => $uploadedMediaIds]);

        logger()->debug(Storage::url($path));

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }
}
