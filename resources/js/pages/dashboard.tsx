import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type Media = {
    id: number;
    path: string;
    type: string;
    url: string;
    position: number;
};

type Post = {
    id: number;
    title: string;
    body: string;
    vote_count: number;
    preview_image: string | null;
    first_paragraph?: string;
    media: Media[];
};

type Props = PageProps & {
    canPost: boolean;
    featured: Post | null;
    posts: {
        data: Post[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
};

export default function Dashboard({ featured, posts: initialPosts }: Props) {
    const [allPosts, setAllPosts] = useState<Post[]>(initialPosts.data);
    const [currentPage, setCurrentPage] = useState(initialPosts.current_page);
    const [lastPage, setLastPage] = useState(initialPosts.last_page);
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        if (currentPage >= lastPage || loading) return;

        setLoading(true);
        const response = await fetch(`/more-posts?page=${currentPage + 1}`, {
            headers: {
                Accept: 'application/json',
            },
        });
        const data = await response.json();
        const newPosts = data.data;

        setAllPosts((prev) => [...prev, ...newPosts]);
        setCurrentPage(data.current_page);
        setLastPage(data.last_page);
        setLoading(false);
    };

    return (
        <AppLayout>
            <Head title="dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Featured Post */}
                {featured && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border">
                        {featured.preview_image ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src={featured.preview_image}
                                    alt={featured.title}
                                    className="h-auto min-h-full w-auto min-w-full object-cover"
                                    style={{ objectPosition: 'center' }}
                                />
                            </div>
                        ) : (
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-end p-6">
                            <div className="border-sidebar-border/70 dark:border-sidebar-border ml-6 flex min-h-[300px] w-full max-w-xs flex-col justify-between rounded-xl border bg-white p-6 shadow-lg dark:bg-neutral-800">
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{featured.title}</h2>
                                    <p className="mt-2 text-neutral-700 dark:text-neutral-300">{featured.first_paragraph}</p>
                                </div>
                                <Link
                                    href={`/posts/${featured.id}`}
                                    className="mt-4 inline-block self-start text-blue-500 hover:underline dark:text-blue-400"
                                >
                                    read more
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Posts */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {allPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/posts/${post.id}`}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col justify-end overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
                        >
                            <div className="relative flex aspect-video items-center justify-center">
                                {post.preview_image ? (
                                    <img
                                        src={post.preview_image}
                                        alt={post.title}
                                        className="min-h-full min-w-full object-cover"
                                        style={{ objectPosition: 'center' }}
                                    />
                                ) : (
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                )}
                            </div>
                            <div className="flex-grow-0 bg-white p-4 dark:bg-neutral-800">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{post.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More */}
                {currentPage < lastPage && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="rounded-xl bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? 'loading...' : 'load more'}
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
