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
};

export type PostOrder = 'popular' | 'recent' | 'oldest';

export type PostIndexFilterProps = {
    search: string;
    order: PostOrder;
};

export type PostIndexSearchBarProps = {
    search: string;
    order: PostOrder;
    showSearchBar: boolean;
    setShowSearchBar: (show: boolean) => void;
};

export type PostIndexOrderProps = {
    search: string;
    order: PostOrder;
};

export type PostIndexOrderTab = {
    title: string;
    value: PostOrder;
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
