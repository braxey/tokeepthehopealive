import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

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
    const contentWithMedia: any[] = [];
    paragraphs.forEach((para, index) => {
        contentWithMedia.push(
            <p key={`para-${index}`} className="text-neutral-900 dark:text-neutral-100">
                {para}
            </p>
        );

        const mediaAtPosition = post.media.filter((m) => m.position === index);
        mediaAtPosition.forEach((media) => {
            contentWithMedia.push(
                <div key={`media-${media.id}`} className="my-4">
                    {media.type === 'image' ? (
                        <img
                            src={media.url}
                            alt="post media"
                            className="max-w-full h-auto rounded-xl"
                        />
                    ) : (
                        <video controls className="max-w-full h-auto rounded-xl">
                            <source src={media.url} type={`video/${media.path.split('.').pop()}`} />
                        </video>
                    )}
                </div>
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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-7xl mx-auto">
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-6 bg-white dark:bg-neutral-800">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">{post.title}</h1>
                    {post.preview_image && (
                        <img
                            src={post.preview_image}
                            alt={post.title}
                            className="w-full h-auto rounded-xl mb-6 max-w-full"
                        />
                    )}
                    <div className="prose dark:prose-invert">{contentWithMedia}</div>
                </div>

                {/* Comments Section */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-6 bg-white dark:bg-neutral-800">
                    <button
                        onClick={loadComments}
                        disabled={loadingComments}
                        className="bg-blue-500 text-white rounded-xl p-2 hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loadingComments ? 'loading comments...' : 'load comments'}
                    </button>
                    {comments.length > 0 && (
                        <div className="mt-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="border-t border-sidebar-border/70 dark:border-sidebar-border pt-4 mt-4">
                                    <p className="text-neutral-900 dark:text-neutral-100">{comment.body}</p>
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
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