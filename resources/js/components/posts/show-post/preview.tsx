import { SharedData } from '@/types';
import { ShowPostPreviewProps } from '@/types/pages/posts/show';
import { Link, router, usePage } from '@inertiajs/react';

export default function ShowPostPreview({ post }: ShowPostPreviewProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <h1
                className={`mb-6 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100 ${auth.can_post ? 'cursor-pointer' : ''}`}
                onClick={() => auth.can_post && router.get(route('posts.edit', { post: post.id }))}
            >
                {post.title}
            </h1>
            <div className="mb-6 flex items-center justify-center gap-3">
                <Link
                    href={`/posts/${post.id}/vote`}
                    method="post"
                    data={{ value: 1 }}
                    preserveState
                    preserveScroll
                    except={['comments']}
                    className={`cursor-pointer text-xl ${post.user_vote === 1 ? 'text-emerald-500' : 'text-neutral-500'} transition hover:text-emerald-600`}
                >
                    ▲
                </Link>
                <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{post.vote_count}</span>
            </div>
            {post.preview_image_url && (
                <div className="mb-6 flex flex-col items-center">
                    <img
                        src={post.preview_image_url}
                        alt={post.preview_caption || post.title}
                        className="h-auto max-h-[500px] w-auto max-w-full rounded-lg object-contain shadow-md"
                    />
                    {post.preview_caption && <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{post.preview_caption}</p>}
                    <p className="mt-4 text-neutral-700 dark:text-neutral-300">{post.summary}</p>
                </div>
            )}
        </>
    );
}
