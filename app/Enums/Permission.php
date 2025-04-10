<?php

namespace App\Enums;

enum Permission: int
{
    case None = 0;
    case Admin = 1;
    case CanPost = 2;
    case Admin_CanPost = 3;

    public function isAdmin(): bool
    {
        return $this->value & self::Admin->value;
    }

    public function canPost(): bool
    {
        return $this->value & self::CanPost->value;
    }
}
