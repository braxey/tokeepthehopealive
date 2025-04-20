<?php

declare(strict_types=1);

namespace App\Services;

use App\Constants\MediaType;
use App\Dtos\MediaDto;
use App\Models\Media;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;

final class MediaService
{
    /**
     * Return the media URL given the path.
     */
    public function getUrl(string $path): string
    {
        return Storage::url($path);
    }

    /**
     * Store a media file on the disk.
     */
    public function storeFile(MediaDto $dto): void
    {
        app()->isLocal()
          ? $dto->getFile()->storePubliclyAs($dto->getPath())
          : $dto->getFile()->storeAs($dto->getPath(), ['CacheControl' => 'max-age=31536000, public']);
    }

    /**
     * Delete a media file off the disk.
     */
    public function deleteFile(string $path): void
    {
        if (Storage::exists($path)) {
            Storage::delete($path);
        }
    }

    /**
     * Store an additional media file and create the media record.
     */
    public function storeAdditionalMedia(MediaDto $dto): Media
    {
        $this->storeFile($dto);
        return $this->createMediaRecord($dto);
    }

    /**
     * Link recently uploaded media to the post.
     * Delete media disassociated from the post.
     */
    public function syncMediaForPost(Post $post): void
    {
        $this->linkAdditionalMedia($post);
        $this->purgeDeletedMedia($post);
    }

    /**
     * Delete all media associated with a post.
     */
    public function deleteForPost(Post $post): void
    {
        // Delete preview image
        Storage::delete($post->preview_image);

        // Delete media
        $post->media->each(function (Media $media) {
            Storage::delete($media->path);
            $media->delete();
        });
    }

    /**
     * Link recently uploaded media associated to the post.
     * Delete media recently disassociated from the post.
     */
    private function linkAdditionalMedia(Post $post): void
    {
        // Grab the IDs of the recently uploaded media.
        $uploadedMediaIds = session('uploaded_media_ids', []);

        // Get the recently uploaded media.
        $uploadedMedia = Media::query()->whereIn('id', $uploadedMediaIds)->get();

        // Filter out uploaded media not related to the new post.
        // Needed because media may be uploaded that does not make it into the published post.
        $mediaUploadedForPost = $uploadedMedia->filter(function (Media $media) use ($post) {
            return str_contains($post->body, $media->path);
        });

        // Link the media to the post.
        $mediaUploadedForPost->each(function (Media $media) use ($post) {
            $media->update([
                'mediable_id' => $post->id
            ]);
        });

        // Clear out the IDs of recently uploaded media.
        session()->forget('uploaded_media_ids');

        // Delete any uploaded media that are not associated with a post.
        $this->garbageCollection();
    }

    /**
     * Discover and delete media for a post that was recently deleted.
     */
    private function purgeDeletedMedia(Post $post): void
    {
        $post->media->each(function (Media $media) use ($post) {
            if (!str_contains($post->body, $media->path)) {
                if (Storage::exists($media->path)) {
                    Storage::delete($media->path);
                }
                $media->delete();
            }
        });
    }

    /**
     * Delete all media records (and files) that are not associated with an existing post.
     */
    private function garbageCollection(): void
    {
        Media::query()->where('mediable_id', 0)->each(function (Media $media) {
            if (Storage::exists($media->path)) {
                Storage::delete($media->path);
            }
            $media->delete();
        });
    }

    /**
     * Create the media record for an additional media.
     * Save the inserted medium's ID to sync with the post later.
     */
    private function createMediaRecord(MediaDto $dto): Media
    {
        // Create the media record (to be linked to the post later).
        $media = Media::create([
          'mediable_type' => Post::class,
          'mediable_id' => 0,
          'path' => $dto->getPath(),
          'type' => MediaType::IMAGE,
        ]);

        // Save the uploaded media ID to be linked to the post when the post is created/updated.
        $uploadedMediaIds = session('uploaded_media_ids', []);
        $uploadedMediaIds[] = $media->id;
        session(['uploaded_media_ids' => $uploadedMediaIds]);

        return $media;
    }
}
