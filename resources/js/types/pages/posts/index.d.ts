import { PostFilter, PostOrder } from '@/constants/posts';
import { Post } from '@/types/models';

export type OtherPosts = {
    posts: Post[];
    current_page: number;
    has_more: boolean;
};

export type PostIndexProps = {
    featured: Post | null;
    otherPosts: OtherPosts;
    search: string;
    order?: PostOrder;
    filter?: PostFilter;
};

export type PostOrder = PostOrder.RECENT | PostOrder.POPULAR | PostOrder.OLDEST;
export type PostFilter = PostFilter.PUBLISHED | PostFilter.ARCHIVED | PostFilter.ALL;

export type PostQuery = {
    search: string;
    order: PostOrder;
    filter: PostFilter;
};

export type PostIndexSearchBarProps = {
    query: PostQuery;
    showSearchBar: boolean;
    setShowSearchBar: (show: boolean) => void;
};

export type PostIndexOrderProps = {
    query: PostQuery;
};

export type PostIndexFilterProps = {
    query: PostQuery;
};

export type PostIndexOrderTab = {
    title: string;
    value: PostOrder;
};

export type PostIndexFilterTab = {
    title: string;
    value: PostFilter;
};

export type PostIndexFeaturedPostProps = {
    featured: Post;
};

export type PostIndexOtherPostsProps = {
    posts: Post[];
};

export type PostIndexLoadMoreButtonProps = {
    handleLoadMore: () => void;
};
