<?php

declare(strict_types=1);

use Ramsey\Uuid\Uuid;

if (! function_exists('uuidv4')) {
    function uuidv4(): string
    {
        return Uuid::uuid4()->toString();
    }
}
