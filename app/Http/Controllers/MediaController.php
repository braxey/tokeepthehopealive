<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Constants\MediaDirectory;
use App\Dtos\MediaDto;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MediaController extends Controller
{
    /**
     * Upload media for a post.
     */
    public function upload(Request $request, MediaService $mediaService): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpeg,jpg,webp,png,gif,mp4,webm', 'max:10240'],
        ]);

        $file = $request->file('file');
        $dto = new MediaDto(file: $file, storageDirectory: MediaDirectory::ADDITIONAL);
        $media = $mediaService->storeAdditionalMedia($dto);

        return response()->json([
            'url' => $mediaService->getUrl($media->path),
        ]);
    }
}
