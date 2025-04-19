<?php

declare(strict_types=1);

namespace App\Constants;

final class PostOrder extends AbstractBaseConstant
{
    public const string RECENT = "recent";
    public const string POPULAR = "popular";
    public const string OLDEST = "oldest";
}
