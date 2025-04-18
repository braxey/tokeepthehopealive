import FeaturedPost from '@/components/posts/index-posts/featured-post';
import { PostFilters } from '@/components/posts/index-posts/filters';
import LoadMoreButton from '@/components/posts/index-posts/load-more-button';
import { NoPosts } from '@/components/posts/index-posts/no-posts';
import OtherPosts from '@/components/posts/index-posts/other-posts';
import AppLayout from '@/layouts/app-layout';
import { Post } from '@/types/models';
import { PostIndexProps } from '@/types/pages/posts';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PostIndex({ featured, otherPosts, search, order }: PostIndexProps) {
    const [posts, setPosts] = useState<Post[]>(otherPosts.posts);
    const [currentPage, setCurrentPage] = useState<number>(otherPosts.current_page);
    const [hasMore, setHasMore] = useState<boolean>(otherPosts.has_more);

    function deduplicatePosts(posts: Post[]): Post[] {
        const seenIds = new Set<number>();
        return posts.filter((post) => {
            if (seenIds.has(post.id)) return false;
            seenIds.add(post.id);
            return true;
        });
    }

    const handleLoadMore = () => {
        const pageNumber = currentPage + 1;
        const params = new URLSearchParams({ page: String(pageNumber), search: search });

        fetch(`${route('posts.load-more')}?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(String(response.status));
                }
                return response.json();
            })
            .then((data) => {
                setPosts((prev) => deduplicatePosts([...prev, ...data.posts]));
                setCurrentPage(data.current_page);
                setHasMore(data.has_more);
            })
            .catch(() => {
                router.reload();
            });
    };

    return (
        <AppLayout>
            <Head title="Testimonies" />
            <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-6 p-6">
                <PostFilters search={search || ''} order={order || 'recent'} />

                {featured ? (
                    <>
                        {/* Featured Post */}
                        <FeaturedPost featured={featured} />

                        {/* Other Posts */}
                        <OtherPosts posts={posts} />

                        {/* Load More */}
                        {hasMore && <LoadMoreButton handleLoadMore={handleLoadMore} />}
                    </>
                ) : (
                    <NoPosts />
                )}
            </div>
        </AppLayout>
    );
}
