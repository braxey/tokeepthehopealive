import ShowPostTopLevelComment from '@/components/posts/show-post/top-level-comment';
import { SharedData } from '@/types';
import { Comment_ShowPost, ShowPostCommentSectionProps } from '@/types/pages/posts/show';
import { router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

export default function ShowPostCommentSection({ post, comments }: ShowPostCommentSectionProps) {
    const { auth, csrf } = usePage<SharedData>().props;
    const [showComments, setShowComments] = useState<boolean>(false);
    const [commentCount, setCommentCount] = useState<number>(post.reply_count);
    const [topLevelComments, setTopLevelComments] = useState<Comment_ShowPost[]>(comments.post.replies);
    const [currentPage, setCurrentPage] = useState<number>(comments.post.current_page);
    const [hasMoreComments, setHasMoreComments] = useState<boolean>(comments.post.has_more);
    const [loadingMoreComments, setLoadingMoreComments] = useState<boolean>(false);
    const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);

    const {
        data: postCommentData,
        setData: setPostCommentData,
        post: submitPostComment,
        processing: postProcessing,
        errors: postErrors,
        clearErrors: clearPostErrors,
    } = useForm<{
        body: string;
        to_user_id: number;
    }>({
        body: '',
        to_user_id: post.user_id,
    });

    function deduplicateComments(comments: Comment_ShowPost[]): Comment_ShowPost[] {
        const seenIds = new Set<number>();
        return comments.filter((comment) => {
            if (seenIds.has(comment.id)) return false;
            seenIds.add(comment.id);
            return true;
        });
    }

    const handleSubmitPostComment = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        submitPostComment(route('posts.comment', { post: post.id }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setPostCommentData('body', '');
                setIsTextareaFocused(false);
                setCommentCount((prev) => prev + 1);
                const params = new URLSearchParams({ page: String(1) });

                fetch(`${route('comments.post', { post: post.id })}?${params.toString()}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(String(response.status));
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setTopLevelComments((prev) => deduplicateComments([...data.post.replies, ...prev]));
                    })
                    .catch(() => {
                        router.reload();
                    });
            },
        });
    };

    const handleCancelPostComment = () => {
        setPostCommentData('body', '');
        clearPostErrors();
        setIsTextareaFocused(false);
    };

    const handleDeleteComment = (commentId: number): void => {
        fetch(route('comment.delete', { comment: commentId }), {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(String(response.status));
                }
                return response.json();
            })
            .then(() => {
                setTopLevelComments((prev) => prev.filter((c) => c.id !== commentId));
                setCommentCount((prev) => prev - 1);
            })
            .catch(() => {
                router.reload();
            });
    };

    return (
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
            {!showComments ? (
                <div className="flex w-full items-center justify-center">
                    <button
                        onClick={() => {
                            setShowComments(true);
                        }}
                        className="cursor-pointer rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900"
                    >
                        {commentCount === 1 ? 'Show 1 Comment' : commentCount === 0 ? 'Show Comments' : `Show ${commentCount} Comments`}
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex w-full items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                setShowComments(false);
                            }}
                            className="cursor-pointer rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            Hide Comments
                        </button>
                    </div>

                    <form onSubmit={handleSubmitPostComment} className="mt-6">
                        <textarea
                            value={postCommentData.body}
                            onChange={(e) => {
                                setPostCommentData('body', e.target.value);
                                clearPostErrors();
                            }}
                            onFocus={() => setIsTextareaFocused(true)}
                            placeholder="Add a comment..."
                            className="min-h-[50px] w-full rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                            rows={2}
                            maxLength={255}
                            disabled={!auth.user || !auth.user.email_verified_at || postProcessing}
                        />
                        {postErrors.body && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{postErrors.body}</p>}
                        {!auth.user && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{'Sign in before commenting.'}</p>}
                        {auth.user && !auth.user.email_verified_at && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{'Verify your email before commenting.'}</p>
                        )}

                        {isTextareaFocused && (
                            <div className="mt-3 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={!auth.user || !auth.user.email_verified_at || postProcessing}
                                    className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                                >
                                    {postProcessing ? 'Posting...' : 'Post'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelPostComment}
                                    className="cursor-pointer rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>

                    {topLevelComments.length === 0 ? (
                        <p className="mt-8 w-full text-center text-neutral-700 dark:text-neutral-300">No comments yet.</p>
                    ) : (
                        <div className="mt-8">
                            {topLevelComments.map((comment) => (
                                <ShowPostTopLevelComment key={`comment-${comment.id}`} comment={comment} deleteComment={handleDeleteComment} />
                            ))}
                            {hasMoreComments && (
                                <button
                                    disabled={loadingMoreComments}
                                    onClick={() => {
                                        setLoadingMoreComments(true);
                                        const params = new URLSearchParams({ page: String(currentPage + 1) });

                                        fetch(`${route('comments.post', { post: post.id })}?${params.toString()}`, {
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                        })
                                            .then((response) => {
                                                if (!response.ok) {
                                                    throw new Error(String(response.status));
                                                }
                                                return response.json();
                                            })
                                            .then((data) => {
                                                setTopLevelComments((prev) => deduplicateComments([...prev, ...data.post.replies]));
                                                setCurrentPage(data.post.current_page);
                                                setHasMoreComments(data.post.has_more);
                                            })
                                            .catch(() => {
                                                router.reload();
                                            })
                                            .finally(() => {
                                                setLoadingMoreComments(false);
                                            });
                                    }}
                                    className="mt-4 w-full cursor-pointer text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                                >
                                    {loadingMoreComments ? 'Loading comments...' : 'Load More'}
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
