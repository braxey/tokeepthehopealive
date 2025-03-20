import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

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

export default function Dashboard({ canPost, featured, posts }: Props) {
    return (
        <AppLayout>
            <Head title="dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Featured Post */}
                {featured && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border">
                        {featured.preview_image ? (
                            <div className="absolute inset-0 flex justify-center items-center">
                                <img
                                    src={featured.preview_image}
                                    alt={featured.title}
                                    className="min-h-full min-w-full object-cover"
                                    style={{ objectPosition: 'center' }}
                                />
                            </div>
                        ) : (
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-end p-6">
                            <div className="border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-800 rounded-xl border p-6 w-full max-w-xs min-h-[300px] shadow-lg flex flex-col justify-between ml-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{featured.title}</h2>
                                    <p className="mt-2 text-neutral-700 dark:text-neutral-300">{featured.first_paragraph}</p>
                                </div>
                                <Link
                                    href={`/posts/${featured.id}`}
                                    className="mt-4 inline-block text-blue-500 dark:text-blue-400 hover:underline self-start"
                                >
                                    read more
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Posts */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {posts.data.map((post) => (
                        <Link
                            key={post.id}
                            href={`/posts/${post.id}`}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border hover:shadow-lg transition-shadow flex flex-col"
                        >
                            <div className="relative aspect-video flex justify-center items-center">
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
                            <div className="p-4 bg-white dark:bg-neutral-800 flex-grow-0">
                                <h3 className="text-neutral-900 dark:text-neutral-100 font-semibold">{post.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex gap-2 justify-center">
                    {posts.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-3 py-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-black dark:text-white'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}