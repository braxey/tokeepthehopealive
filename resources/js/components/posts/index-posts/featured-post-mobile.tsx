import { PostIndexFeaturedPostProps } from '@/types/pages/posts';
import { Link } from '@inertiajs/react';

export default function FeaturedPostMobile({ featured }: PostIndexFeaturedPostProps) {
    return (
        <div className="flex h-[60vh] flex-col md:hidden">
            <div className="relative h-1/2">
                <img
                    src={featured.preview_image}
                    alt={featured.title}
                    className="h-full w-full rounded-t-lg object-cover shadow-md"
                    style={{ objectPosition: 'center' }}
                />
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
    );
}
