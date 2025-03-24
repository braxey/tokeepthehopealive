import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Post } from '@/types/models';
import { Head, Link } from '@inertiajs/react';

type PostIndexProps = {
    featured: Post | null;
    nextPageUrl: string | null;
    posts: Post[];
};

export default function Posts({ featured, nextPageUrl, posts }: PostIndexProps) {
    return (
        <AppLayout>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Featured Post */}
                {featured && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex h-[50vh] flex-col overflow-hidden rounded-xl border">
                        {/* Desktop Layout */}
                        <div className="hidden h-full md:flex md:flex-row">
                            <div className="relative h-full md:w-2/3">
                                {featured.preview_image ? (
                                    <img
                                        src={featured.preview_image}
                                        alt={featured.title}
                                        className="h-full w-full object-cover"
                                        style={{ objectPosition: 'center' }}
                                    />
                                ) : (
                                    <PlaceholderPattern className="absolute inset-0 h-full w-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                )}
                            </div>
                            <div className="flex h-full flex-col overflow-hidden bg-white p-5 text-neutral-900 md:w-1/3 dark:bg-neutral-800 dark:text-neutral-100">
                                <h2 className="shrink-0 text-2xl font-bold">{featured.title}</h2>
                                <p className="text-ellipses mt-4 line-clamp-12 flex-1">{featured.summary}</p>
                                <Link
                                    href={`/posts/${featured.id}`}
                                    className="mt-4 block flex h-12 w-full shrink-0 items-center rounded-md bg-neutral-100 px-4 py-2 text-center text-blue-500 hover:text-blue-600 dark:bg-neutral-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                        {/* Mobile Layout */}
                        <div className="flex h-full flex-col md:hidden">
                            <div className="relative h-1/2">
                                {featured.preview_image ? (
                                    <img
                                        src={featured.preview_image}
                                        alt={featured.title}
                                        className="h-full w-full object-cover"
                                        style={{ objectPosition: 'center' }}
                                    />
                                ) : (
                                    <PlaceholderPattern className="absolute inset-0 h-full w-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                )}
                            </div>
                            <div className="flex flex-1 flex-col overflow-hidden bg-white p-5 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                                <h2 className="shrink-0 text-2xl font-bold">{featured.title}</h2>
                                <p className="mt-1 line-clamp-4 flex-1 overflow-hidden">{featured.summary}</p>
                                <Link
                                    href={`/posts/${featured.id}`}
                                    className="mt-2 inline-block shrink-0 rounded-md bg-neutral-100 px-4 py-2 text-blue-500 hover:text-blue-600 dark:bg-neutral-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Posts */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/posts/${post.id}`}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col justify-end overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
                        >
                            <div className="relative aspect-video">
                                {post.preview_image ? (
                                    <img
                                        src={post.preview_image}
                                        alt={post.title}
                                        className="h-full w-full object-cover"
                                        style={{ objectPosition: 'center' }}
                                    />
                                ) : (
                                    <PlaceholderPattern className="absolute inset-0 h-full w-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                )}
                            </div>
                            <div className="flex-grow-0 bg-white p-4 dark:bg-neutral-800">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{post.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More */}
                {!!nextPageUrl && (
                    <div className="mt-4 flex justify-center">
                        <Link
                            key={`load-more`}
                            href={nextPageUrl}
                            only={['nextPageUrl', 'posts']}
                            preserveScroll
                            prefetch
                            as="button"
                            className="cursor-pointer rounded-xl bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {'Load More'}
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
