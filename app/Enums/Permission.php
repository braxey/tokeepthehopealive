<?php

declare(strict_types=1);

namespace App\Enums;

enum Permission: int
{
    case None = 0;
    case Admin = 1;
    case CanPost = 2;
    case Admin_CanPost = 3;

    public function isAdmin(): bool
    {
        return (bool)($this->value & self::Admin->value);
    }

    public function canPost(): bool
    {
        return (bool)($this->value & self::CanPost->value);
    }
}
