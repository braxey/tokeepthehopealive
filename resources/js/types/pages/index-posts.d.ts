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
};

export type PostIndexSearchBarProps = {
    search: string;
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
