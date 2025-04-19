<?php

declare(strict_types=1);

namespace App\Constants;

use ReflectionClass;

abstract class AbstractBaseConstant
{
    final public static function all(): array
    {
        $reflect = new ReflectionClass(static::class);
        return array_values($reflect->getConstants());
    }

    final public static function allSerialized(): string
    {
        return implode(',', self::all());
    }
}
