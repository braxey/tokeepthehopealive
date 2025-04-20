<?php

declare(strict_types=1);

namespace App\Dtos;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

final class MediaDto
{
    private int $userId;
    private int $nowTimestamp;
    private string $uuid;
    private string $extension;
    private string $path;

    public function __construct(private UploadedFile $file, private string $storageDirectory)
    {
        $this->userId = Auth::id();
        $this->nowTimestamp = now()->getTimestamp();
        $this->uuid = uuidv4();
        $this->extension = $file->getClientOriginalExtension();
        $this->path = "{$this->storageDirectory}/{$this->userId}-{$this->nowTimestamp}-{$this->uuid}.{$this->extension}";
    }

    /**
     * Return the storage path.
     */
    public function getPath(): string
    {
        return $this->path;
    }

    /**
     * Return the uploaded file.
     */
    public function getFile(): UploadedFile
    {
        return $this->file;
    }
}
