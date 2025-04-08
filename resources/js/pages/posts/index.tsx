import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Post } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useState } from 'react';

type PostIndexProps = {
    featured: Post | null;
    nextPageUrl: string | null;
    posts: Post[];
    search: string;
};

export default function Posts({ featured, nextPageUrl, posts, search }: PostIndexProps) {
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(search || '');

    return (
        <AppLayout>
            <Head title="Testimonies" />
            <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-6 p-6">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className={
                            'h-9 w-64 rounded-md border-neutral-200 pr-4 pl-10 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:outline-none [&:focus]:border-green-500 [&:focus]:ring-green-500 ' +
                            (!showSearchBar && 'hidden')
                        }
                        value={searchQuery}
                        onChange={(e) => {
                            const q = e.target.value;
                            setSearchQuery(q);
                            debounce((query) => {
                                router.get('/posts', { search: query, page: 1 }, { preserveState: true, replace: true });
                            }, 500)(q);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/posts', { search: searchQuery, page: 1 }, { preserveState: true, replace: true });
                            }
                        }}
                    />
                    <Search
                        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500"
                        onClick={() => setShowSearchBar(!showSearchBar)}
                    />
                </div>

                {/* Featured Post */}
                {featured && (
                    <div className="rounded-lg bg-white shadow-lg dark:bg-neutral-900">
                        {/* Desktop Layout */}
                        <div className="hidden h-[50vh] md:flex md:flex-row">
                            <div className="relative h-full md:w-2/3">
                                {featured.preview_image ? (
                                    <img
                                        src={featured.preview_image}
                                        alt={featured.title}
                                        className="h-full w-full rounded-l-lg object-cover shadow-md"
                                        style={{ objectPosition: 'center' }}
                                    />
                                ) : (
                                    <PlaceholderPattern className="absolute inset-0 h-full w-full rounded-l-lg stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                )}
                            </div>
                            <div className="flex h-full flex-col overflow-hidden p-8 md:w-1/3">
                                <h2 className="shrink-0 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{featured.title}</h2>
                                <p
                                    className="mt-4 flex-1 overflow-hidden text-neutral-700 dark:text-neutral-300"
                                    style={{
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 'unset',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {featured.summary}
                                </p>
                                <Link
                                    href={`/posts/${featured.id}`}
                                    className="mt-6 inline-block w-full rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                                >
                                    Read Testimony
                                </Link>
                            </div>
                        </div>
                        {/* Mobile Layout */}
                        <div className="flex h-[60vh] flex-col md:hidden">
                            <div className="relative h-1/2">
                                {featured.preview_image ? (
                                    <img
                                        src={featured.preview_image}
                                        alt={featured.title}
                                        className="h-full w-full rounded-t-lg object-cover shadow-md"
                                        style={{ objectPosition: 'center' }}
                                    />
                                ) : (
                                    <PlaceholderPattern className="absolute inset-0 h-full w-full rounded-t-lg stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                )}
                            </div>
                            <div className="flex flex-1 flex-col overflow-hidden p-6">
                                <h2 className="shrink-0 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{featured.title}</h2>
                                <p
                                    className="mt-3 flex-1 overflow-hidden text-neutral-700 dark:text-neutral-300"
                                    style={{
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 'unset',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {featured.summary}
                                </p>
                                <Link
                                    href={`/posts/${featured.id}`}
                                    className="mt-4 inline-block w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                                >
                                    Read Testimony
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Posts */}
                <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/posts/${post.id}`}
                            className="flex flex-col justify-end overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl dark:bg-neutral-900"
                        >
                            <div className="relative aspect-video">
                                {post.preview_image ? (
                                    <img
                                        src={post.preview_image}
                                        alt={post.title}
                                        className="h-full w-full rounded-t-lg object-cover shadow-md"
                                        style={{ objectPosition: 'center' }}
                                    />
                                ) : (
                                    <PlaceholderPattern className="absolute inset-0 h-full w-full rounded-t-lg stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{post.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More */}
                {!!nextPageUrl && (
                    <div className="mt-6 flex justify-center">
                        <Link
                            key={`load-more`}
                            href={`${nextPageUrl}&search=${encodeURIComponent(search || '')}`}
                            only={['nextPageUrl', 'posts']}
                            preserveScroll
                            prefetch
                            as="button"
                            className="rounded-lg bg-emerald-100 px-6 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900"
                        >
                            Load More
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
