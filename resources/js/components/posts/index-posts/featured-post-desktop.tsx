import { PostIndexFeaturedPostProps } from '@/types/pages/posts';
import { Link } from '@inertiajs/react';

export default function FeaturedPostDesktop({ featured }: PostIndexFeaturedPostProps) {
    return (
        <div className="hidden h-[50vh] md:flex md:flex-row">
            <div className="relative h-full md:w-2/3">
                <img
                    src={featured.preview_image}
                    alt={featured.title}
                    className="h-full w-full rounded-l-lg object-cover shadow-md"
                    style={{ objectPosition: 'center' }}
                />
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
    );
}
