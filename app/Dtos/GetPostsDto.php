<?php

declare(strict_types=1);

namespace App\Dtos;

use App\Constants\PostFilter;
use App\Constants\PostOrder;
use Illuminate\Http\Request;

final class GetPostsDto
{
    // As of v1.22.0, pint does not support assymetric visibility.
    // public private(set) string $searchTerm;
    // public private(set) string $order;
    // public private(set) string $filter;
    // public private(set) int $pageNumber;

    public string $searchTerm;
    public string $order;
    public string $filter;
    public int $pageNumber;

    public function __construct(Request $request)
    {
        $this->searchTerm = (string) $request->input('search');
        $this->order = (string) $request->input('order', PostOrder::RECENT);
        $this->filter = (string) $request->input('filter', PostFilter::PUBLISHED);
        $this->pageNumber = (int) $request->input('page', 1);
    }
}
