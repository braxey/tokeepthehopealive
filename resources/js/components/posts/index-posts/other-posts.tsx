import { PostIndexOtherPostsProps } from '@/types/pages/posts';
import { Link } from '@inertiajs/react';

export default function OtherPosts({ posts }: PostIndexOtherPostsProps) {
    return (
        <div className="grid auto-rows-min gap-6 md:grid-cols-3">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="flex flex-col justify-end overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl dark:bg-neutral-900"
                >
                    <div className="relative aspect-video">
                        <img
                            src={post.preview_image}
                            alt={post.title}
                            className="h-full w-full rounded-t-lg object-cover shadow-md"
                            style={{ objectPosition: 'center' }}
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{post.title}</h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}
