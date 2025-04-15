<?php

declare(strict_types=1);

namespace App\Dtos;

use App\Constants\MediaType;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

final class MediaDto
{
    private int $userId;
    private int $nowTimestamp;
    private string $uuid;
    private string $extension;
    private string $type;
    private string $path;

    public function __construct(private UploadedFile $file, private string $storageDirectory)
    {
        $this->userId = Auth::id();
        $this->nowTimestamp = now()->getTimestamp();
        $this->uuid = uuidv4();
        $this->extension = $file->getClientOriginalExtension();
        $this->type = str_contains($file->getMimeType(), 'video') ? MediaType::VIDEO : MediaType::IMAGE;
        $this->path = "{$this->storageDirectory}/{$this->type}-{$this->userId}-{$this->nowTimestamp}-{$this->uuid}.{$this->extension}";
    }

    /**
     * Return the storage path.
     */
    public function getPath(): string
    {
        return $this->path;
    }

    /**
     * Return the media type (image or video).
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * Return the uploaded file.
     */
    public function getFile(): UploadedFile
    {
        return $this->file;
    }
}
