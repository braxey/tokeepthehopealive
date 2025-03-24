import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Comment, Post } from '@/types/models';
import { Head, Link, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

type ShowProps = {
    post: Post;
    comments: Comment[];
    nextCommentPageUrl: string | null;
};

interface VoteState {
    [commentId: number]: { vote_count: number; user_vote: number | null };
}

export default function ShowPost({ post, comments, nextCommentPageUrl }: ShowProps) {
    const [showComments, setShowComments] = useState<boolean>(false);
    const [localVotes, setLocalVotes] = useState<VoteState>({});
    const { auth } = usePage<SharedData>().props;
    const contentWithMedia: ReactNode[] = [];
    const extraMedia: ReactNode[] = [];

    post.body.forEach((section, index) => {
        contentWithMedia.push(
            <div key={`section-${index}`} className="my-4">
                {section.section_title && <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{section.section_title}</h2>}
                {section.section_text && <p className="mt-2 text-neutral-900 dark:text-neutral-100">{section.section_text}</p>}
            </div>,
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

    const maxSectionIndex = post.body.length - 1;
    const leftoverMedia = post.media.filter((m) => m.position > maxSectionIndex);
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

    const commentKeys: number[] = [];
    const localComments: Comment[] = comments.filter((comment) => {
        const use = !commentKeys.includes(comment.id);
        if (use) commentKeys.push(comment.id);
        return use;
    });

    const handleVoteClick = (commentId: number, value: number, voteCount: number, userVote: number | undefined | null) => {
        if (!auth.user) {
            alert('Please log in to vote.');
            return;
        }

        if (userVote === undefined) userVote = null;

        const newUserVote = userVote === value ? null : value;
        const voteChange = userVote === value ? -value : userVote ? 2 * value : value;
        const newVoteCount = voteCount + voteChange;

        setLocalVotes((prev) => ({
            ...prev,
            [commentId]: { vote_count: newVoteCount, user_vote: newUserVote },
        }));
    };

    return (
        <AppLayout>
            <Head title={post.title} />
            <div className="flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Title, Preview Image, and Summary */}
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
                            <div className="mx-auto w-full max-w-3xl border-0 bg-transparent">
                                <p className="mt-4 text-neutral-700 dark:text-neutral-300">{post.summary}</p>
                            </div>
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
                <div className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col items-center rounded-xl border bg-white p-6 dark:bg-neutral-800">
                    {!showComments ? (
                        <button onClick={() => setShowComments(true)} className="cursor-pointer rounded-xl bg-none p-2 text-black dark:text-white">
                            {'View comments'}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowComments(false)}
                                className="cursor-pointer rounded-xl bg-none p-2 text-black dark:text-white"
                            >
                                {'Hide comments'}
                            </button>
                            {localComments.length === 0 ? (
                                <p className="mt-8 mb-4 text-neutral-900 dark:text-neutral-100">{'No comments yet.'}</p>
                            ) : (
                                <div className="w-full max-w-3xl">
                                    {localComments.map((comment) => {
                                        const localVote = localVotes[comment.id] || {};
                                        const voteCount = localVote.vote_count !== undefined ? localVote.vote_count : comment.vote_count || 0;
                                        const userVote = localVote.user_vote !== undefined ? localVote.user_vote : comment.user_vote;

                                        return (
                                            <div
                                                key={`comment-${comment.id}`}
                                                className="border-sidebar-border/70 dark:border-sidebar-border mt-4 border-t pt-4"
                                            >
                                                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                                                    {comment.user.name} · {comment.time_since}
                                                </p>
                                                <p className="text-neutral-900 dark:text-neutral-100">{comment.body}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Link
                                                        href={`/comments/${comment.id}/vote`}
                                                        only={['comments']}
                                                        method="post"
                                                        data={{ value: 1 }}
                                                        preserveState
                                                        preserveScroll
                                                        onClick={() => handleVoteClick(comment.id, 1, voteCount, userVote)}
                                                        className={`p-1 ${userVote === 1 ? 'text-green-500' : 'text-neutral-500'} hover:text-green-600`}
                                                        disabled={!auth.user}
                                                    >
                                                        ▲
                                                    </Link>
                                                    <span className="text-neutral-900 dark:text-neutral-100">{voteCount}</span>
                                                    <Link
                                                        href={`/comments/${comment.id}/vote`}
                                                        only={['comments']}
                                                        method="post"
                                                        data={{ value: -1 }}
                                                        preserveState
                                                        preserveScroll
                                                        onClick={() => handleVoteClick(comment.id, -1, voteCount, userVote)}
                                                        className={`p-1 ${userVote === -1 ? 'text-red-500' : 'text-neutral-500'} hover:text-red-600`}
                                                        disabled={!auth.user}
                                                    >
                                                        ▼
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {!!nextCommentPageUrl && (
                                        <Link
                                            key={'load-more-comments'}
                                            href={nextCommentPageUrl}
                                            only={['nextCommentPageUrl', 'comments']}
                                            preserveScroll
                                            preserveState
                                            prefetch
                                            className="mt-4 block cursor-pointer text-center text-black dark:text-white"
                                        >
                                            {'Load more'}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
