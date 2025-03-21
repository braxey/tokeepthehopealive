import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

type Media = {
    id: number;
    path: string;
    type: string;
    url: string;
    position: number;
    caption: string | null;
};

type Comment = {
    id: number;
    body: string;
    user: { name: string };
    vote_count: number;
};

type Post = {
    id: number;
    title: string;
    body: string;
    vote_count: number;
    preview_image: string | null;
    preview_caption: string | null; // Added
    media: Media[];
};

type Props = PageProps & {
    post: Post;
};

export default function ShowPost() {
    const { post } = usePage<Props>().props;
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const paragraphs = post.body.split('\n').filter((para) => para.trim() !== '');
    const contentWithMedia: ReactNode[] = [];
    const extraMedia: ReactNode[] = [];

    paragraphs.forEach((para, index) => {
        contentWithMedia.push(
            <p key={`para-${index}`} className="my-4 text-neutral-900 dark:text-neutral-100">
                {para}
            </p>,
        );

        const mediaAtPosition = post.media.filter((m) => m.position === index);
        mediaAtPosition.forEach((media) => {
            contentWithMedia.push(
                <div key={`media-${media.id}`} className="my-4 flex flex-col items-center">
                    {media.type === 'image' ? (
                        <img
                            src={media.url}
                            alt={media.caption || 'post media'}
                            className="h-auto max-h-[300px] w-auto max-w-full rounded-xl object-contain"
                        />
                    ) : (
                        <video controls className="h-auto max-h-[300px] w-auto max-w-full rounded-xl">
                            <source src={media.url} type={`video/${media.path.split('.').pop()}`} />
                        </video>
                    )}
                    {media.caption && <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{media.caption}</p>}
                </div>,
            );
        });
    });

    // Append media with positions exceeding paragraph count
    const maxParagraphIndex = paragraphs.length - 1;
    const leftoverMedia = post.media.filter((m) => m.position > maxParagraphIndex);
    leftoverMedia.forEach((media) => {
        extraMedia.push(
            <div key={`media-${media.id}`} className="my-4 flex flex-col items-center">
                {media.type === 'image' ? (
                    <img
                        src={media.url}
                        alt={media.caption || 'post media'}
                        className="h-auto max-h-[300px] w-auto max-w-full rounded-xl object-contain"
                    />
                ) : (
                    <video controls className="h-auto max-h-[300px] w-auto max-w-full rounded-xl">
                        <source src={media.url} type={`video/${media.path.split('.').pop()}`} />
                    </video>
                )}
                {media.caption && <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{media.caption}</p>}
            </div>,
        );
    });

    if (extraMedia.length > 0) {
        contentWithMedia.push(...extraMedia);
    }

    const loadComments = async () => {
        setLoadingComments(true);
        const response = await fetch(`/posts/${post.id}/comments`);
        const data = await response.json();
        setComments(data);
        setLoadingComments(false);
    };

    return (
        <AppLayout>
            <Head title={post.title} />
            <div className="flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Title and Preview Image */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-6 dark:bg-neutral-800">
                    <h1 className="mb-4 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">{post.title}</h1>
                    {post.preview_image && (
                        <div className="mb-6 flex flex-col items-center">
                            <img
                                src={post.preview_image}
                                alt={post.preview_caption || post.title}
                                className="h-auto max-h-[500px] w-auto max-w-full rounded-xl object-contain"
                            />
                            {post.preview_caption && <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{post.preview_caption}</p>}
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-6 dark:bg-neutral-800">
                    <div className="mx-auto w-full max-w-3xl border-0 bg-transparent">
                        <div className="prose dark:prose-invert">{contentWithMedia}</div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border flex justify-center rounded-xl border bg-white p-6 dark:bg-neutral-800">
                    <button onClick={loadComments} disabled={loadingComments} className="rounded-xl bg-none p-2">
                        {loadingComments ? 'Loading comments...' : 'View comments'}
                    </button>
                    {comments.length > 0 && (
                        <div className="mt-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="border-sidebar-border/70 dark:border-sidebar-border mt-4 border-t pt-4">
                                    <p className="text-neutral-900 dark:text-neutral-100">{comment.body}</p>
                                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                                        - {comment.user.name} (Votes: {comment.vote_count})
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
