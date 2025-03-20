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
    paragraphs.forEach((para, index) => {
        contentWithMedia.push(
            <p key={`para-${index}`} className="text-neutral-900 dark:text-neutral-100">
                {para}
            </p>,
        );

        const mediaAtPosition = post.media.filter((m) => m.position === index);
        mediaAtPosition.forEach((media) => {
            contentWithMedia.push(
                <div key={`media-${media.id}`} className="my-4">
                    {media.type === 'image' ? (
                        <img src={media.url} alt="post media" className="h-auto max-w-full rounded-xl" />
                    ) : (
                        <video controls className="h-auto max-w-full rounded-xl">
                            <source src={media.url} type={`video/${media.path.split('.').pop()}`} />
                        </video>
                    )}
                </div>,
            );
        });
    });

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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex h-full min-h-[50vh] flex-1 flex-col gap-4 overflow-hidden rounded-xl border p-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-6 dark:bg-neutral-800">
                        <h1 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{post.title}</h1>
                        {post.preview_image && <img src={post.preview_image} alt={post.title} className="mb-6 h-auto w-full max-w-full rounded-xl" />}
                        <div className="prose dark:prose-invert">{contentWithMedia}</div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-6 dark:bg-neutral-800">
                        <button
                            onClick={loadComments}
                            disabled={loadingComments}
                            className="rounded-xl bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loadingComments ? 'loading comments...' : 'load comments'}
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
            </div>
        </AppLayout>
    );
}
