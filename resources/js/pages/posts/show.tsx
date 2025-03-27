import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Comment, Post } from '@/types/models';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ReactNode, useRef, useState } from 'react';

type ShowProps = {
    post: Post;
    comments: Comment[];
    nextCommentPageUrl: string | null;
};

interface VoteState {
    [key: string]: { vote_count: number; user_vote: number | null };
}

export default function ShowPost({ post, comments, nextCommentPageUrl }: ShowProps) {
    const [showComments, setShowComments] = useState<boolean>(false);
    const [localVotes, setLocalVotes] = useState<VoteState>({});
    const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);
    const { auth } = usePage<SharedData>().props;
    const contentWithMedia: ReactNode[] = [];
    const extraMedia: ReactNode[] = [];
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        data,
        setData,
        post: submitComment,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        body: '',
    });

    post.body.forEach((section, index) => {
        contentWithMedia.push(
            <div key={`section-${index}`} className="my-6">
                {section.section_title && <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{section.section_title}</h2>}
                {section.section_text && <p className="mt-3 text-neutral-700 dark:text-neutral-300">{section.section_text}</p>}
            </div>,
        );

        const mediaAtPosition = post.media.filter((m) => m.position === index);
        mediaAtPosition.forEach((media) => {
            contentWithMedia.push(
                <div key={`media-${media.id}`} className="my-6 flex flex-col items-center">
                    {media.type === 'image' ? (
                        <img
                            src={media.url}
                            alt={media.caption || 'post media'}
                            className="h-auto max-h-[400px] w-auto max-w-full rounded-lg object-contain shadow-md"
                        />
                    ) : (
                        <video controls className="h-auto max-h-[400px] w-auto max-w-full rounded-lg shadow-md">
                            <source src={media.url} type={`video/${media.path.split('.').pop()}`} />
                        </video>
                    )}
                    {media.caption && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{media.caption}</p>}
                </div>,
            );
        });
    });

    const maxSectionIndex = post.body.length - 1;
    const leftoverMedia = post.media.filter((m) => m.position > maxSectionIndex);
    leftoverMedia.forEach((media) => {
        extraMedia.push(
            <div key={`media-${media.id}`} className="my-6 flex flex-col items-center">
                {media.type === 'image' ? (
                    <img
                        src={media.url}
                        alt={media.caption || 'post media'}
                        className="h-auto max-h-[400px] w-auto max-w-full rounded-lg object-contain shadow-md"
                    />
                ) : (
                    <video controls className="h-auto max-h-[400px] w-auto max-w-full rounded-lg shadow-md">
                        <source src={media.url} type={`video/${media.path.split('.').pop()}`} />
                    </video>
                )}
                {media.caption && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{media.caption}</p>}
            </div>,
        );
    });

    if (extraMedia.length > 0) {
        contentWithMedia.push(...extraMedia);
    }

    // Deduplicate and sort comments
    const commentKeys: number[] = [];
    const uniqueComments: Comment[] = comments.filter((comment) => {
        const use = !commentKeys.includes(comment.id);
        if (use) commentKeys.push(comment.id);
        return use;
    });

    const localComments: Comment[] = uniqueComments.sort((a: Comment, b: Comment) => {
        if (auth.user && a.user.id === auth.user.id && b.user.id === auth.user.id) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (auth.user && a.user.id === auth.user.id) return -1;
        if (auth.user && b.user.id === auth.user.id) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.user) {
            alert('Please log in to comment.');
            return;
        }

        submitComment(`/posts/${post.id}/comments`, {
            preserveScroll: true,
            preserveState: true,
            only: ['comments'],
            onSuccess: () => {
                reset('body');
                setIsTextareaFocused(false);
            },
        });
    };

    const handleCancelComment = () => {
        reset('body');
        clearErrors();
        setIsTextareaFocused(false);
        textareaRef.current?.blur();
    };

    return (
        <AppLayout>
            <Head title={post.title} />
            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-6">
                {/* Title, Preview Image, and Summary */}
                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
                    <h1 className="mb-6 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">{post.title}</h1>
                    {/* Post Voting */}
                    <div className="mb-6 flex items-center justify-center gap-3">
                        <Link
                            href={`/posts/${post.id}/vote`}
                            method="post"
                            data={{ value: 1 }}
                            preserveState
                            preserveScroll
                            except={['comments']}
                            className={`text-xl ${post.user_vote === 1 ? 'text-emerald-500' : 'text-neutral-500'} transition hover:text-emerald-600`}
                            disabled={!auth.user}
                        >
                            ▲
                        </Link>
                        <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{post.vote_count}</span>
                        <Link
                            href={`/posts/${post.id}/vote`}
                            method="post"
                            data={{ value: -1 }}
                            preserveState
                            preserveScroll
                            except={['comments']}
                            className={`text-xl ${post.user_vote === -1 ? 'text-red-500' : 'text-neutral-500'} transition hover:text-red-600`}
                            disabled={!auth.user}
                        >
                            ▼
                        </Link>
                    </div>
                    {post.preview_image && (
                        <div className="mb-6 flex flex-col items-center">
                            <img
                                src={post.preview_image}
                                alt={post.preview_caption || post.title}
                                className="h-auto max-h-[500px] w-auto max-w-full rounded-lg object-contain shadow-md"
                            />
                            {post.preview_caption && <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{post.preview_caption}</p>}
                            <p className="mt-4 text-neutral-700 dark:text-neutral-300">{post.summary}</p>
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
                    <div className="prose dark:prose-invert">{contentWithMedia}</div>
                </div>

                {/* Comments Section */}
                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
                    {!showComments ? (
                        <div className="flex w-full items-center justify-center">
                            <button
                                onClick={() => setShowComments(true)}
                                className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900"
                            >
                                View Comments
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex w-full items-center justify-center">
                                <button
                                    onClick={() => setShowComments(false)}
                                    className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                >
                                    Hide Comments
                                </button>
                            </div>

                            {/* Add Comment Form */}
                            <form onSubmit={handleSubmitComment} className="mt-6">
                                <textarea
                                    ref={textareaRef}
                                    value={data.body}
                                    onChange={(e) => {
                                        setData('body', e.target.value);
                                        clearErrors();
                                    }}
                                    onFocus={() => setIsTextareaFocused(true)}
                                    placeholder="Add a comment..."
                                    className="min-h-[100px] w-full rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                                    rows={3}
                                    disabled={!auth.user || processing}
                                />
                                {errors.body && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.body}</p>}
                                {isTextareaFocused && (
                                    <div className="mt-3 flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={!auth.user || processing}
                                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                                        >
                                            {processing ? 'Posting...' : 'Post Comment'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelComment}
                                            className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>

                            {localComments.length === 0 ? (
                                <p className="mt-8 w-full text-center text-neutral-700 dark:text-neutral-300">No comments yet.</p>
                            ) : (
                                <div className="mt-8">
                                    {localComments.map((comment) => {
                                        const localVote = localVotes[comment.id] || {};
                                        const voteCount = localVote.vote_count !== undefined ? localVote.vote_count : comment.vote_count || 0;
                                        const userVote = localVote.user_vote !== undefined ? localVote.user_vote : comment.user_vote;

                                        return (
                                            <div key={`comment-${comment.id}`} className="border-t border-neutral-200 py-6 dark:border-neutral-700">
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {comment.user.name} · {comment.time_since}
                                                </p>
                                                <p className="mt-2 text-neutral-900 dark:text-neutral-100">{comment.body}</p>
                                                <div className="mt-3 flex items-center gap-3">
                                                    <Link
                                                        href={`/comments/${comment.id}/vote`}
                                                        only={['comments']}
                                                        method="post"
                                                        data={{ value: 1 }}
                                                        preserveState
                                                        preserveScroll
                                                        onClick={() => handleVoteClick(comment.id, 1, voteCount, userVote)}
                                                        className={`text-lg ${userVote === 1 ? 'text-emerald-500' : 'text-neutral-500'} transition hover:text-emerald-600`}
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
                                                        className={`text-lg ${userVote === -1 ? 'text-red-500' : 'text-neutral-500'} transition hover:text-red-600`}
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
                                            className="mt-6 block text-center text-sm font-medium text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                                        >
                                            Load more
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
