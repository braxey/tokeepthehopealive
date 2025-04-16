import { PostIndexFeaturedPostProps } from '@/types/pages/posts';
import { Link } from '@inertiajs/react';

export default function FeaturedPostMobile({ featured }: PostIndexFeaturedPostProps) {
    return (
        <Link
            key={featured.id}
            href={`/posts/${featured.id}`}
            className="flex flex-col justify-end overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl md:hidden dark:bg-neutral-900"
        >
            <div className="relative aspect-video">
                <img
                    src={featured.preview_image_url}
                    alt={featured.title}
                    className="h-full w-full rounded-t-lg object-cover shadow-md"
                    style={{ objectPosition: 'center' }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{featured.title}</h3>
            </div>
        </Link>
    );
}
