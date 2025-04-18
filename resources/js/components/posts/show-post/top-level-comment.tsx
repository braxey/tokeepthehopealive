import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { csrfToken } from '@/lib/utils';
import { SharedData } from '@/types';
import { Comment_ShowPost, ShowPostTopLevelCommentProps } from '@/types/pages/posts/show';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowBigDown, ArrowBigUp, Dot, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import ShowPostNestedComment from './nested-comment';

export default function ShowPostTopLevelComment({ comment, deleteComment }: ShowPostTopLevelCommentProps) {
    const commentKey = `comment-${comment.id}`;
    const getInitials = useInitials();
    const { auth } = usePage<SharedData>().props;
    const [userVote, setUserVote] = useState<number | null>(comment.user_vote);
    const [voteCount, setVoteCount] = useState<number>(comment.vote_count);
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [currentReplyPage, setCurrentReplyPage] = useState<number>(1);
    const [hasMoreReplies, setHasMoreReplies] = useState<boolean>(comment.reply_count > 0);
    const [replyCount, setReplyCount] = useState<number>(comment.reply_count);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [replies, setReplies] = useState<Comment_ShowPost[]>([]);
    const [loadedReplies, setLoadedReplies] = useState<boolean>(false);
    const [loadingReplies, setLoadingReplies] = useState<boolean>(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    function deduplicateComments(comments: Comment_ShowPost[]): Comment_ShowPost[] {
        const seenIds = new Set<number>();
        return comments.filter((comment) => {
            if (seenIds.has(comment.id)) return false;
            seenIds.add(comment.id);
            return true;
        });
    }

    const {
        data: replyData,
        setData: setReplyData,
        post,
        processing: replyProcessing,
        errors: replyErrors,
        clearErrors: clearReplyErrors,
    } = useForm<{
        body: string;
        to_user_id: number;
    }>({
        body: '',
        to_user_id: comment.user_id,
    });

    useEffect(() => {
        if (showReplyForm && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showReplyForm]);

    const loadCommentsAfterReply = () => {
        // This is called for top-level and nested comments after a successful reply,
        // so we can increment the reply count for the top-level comment here.
        setReplyCount((prev) => prev + 1);

        const params = new URLSearchParams({ page: String(1) });

        fetch(`${route('comments.comment', { comment: comment.id })}?${params.toString()}`, {
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
                setReplies((prev) => deduplicateComments([...data[commentKey].replies, ...prev]));

                if (!loadedReplies) {
                    setHasMoreReplies(data[commentKey].has_more);
                    setLoadedReplies(true);
                }
            })
            .catch(() => {
                router.reload();
            });
    };

    const loadMoreReplies = () => {
        setLoadingReplies(true);
        const params = new URLSearchParams({ page: String(currentReplyPage + (loadedReplies ? 1 : 0)) });

        fetch(`${route('comments.comment', { comment: comment.id })}?${params.toString()}`, {
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
                setReplies((prev) => deduplicateComments([...prev, ...data[commentKey].replies]));
                setCurrentReplyPage(data[commentKey].current_page);
                setHasMoreReplies(data[commentKey].has_more);
                setLoadedReplies(true);
            })
            .catch(() => {
                router.reload();
            })
            .finally(() => setLoadingReplies(false));
    };

    const handleSubmitReplyComment = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(`/comments/${comment.id}/comment`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setReplyData('body', '');
                setShowReplyForm(false);
                loadCommentsAfterReply();
            },
        });
    };

    const handleDeleteReply = (commentId: number): void => {
        fetch(route('comment.delete', { comment: commentId }), {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken(),
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(String(response.status));
                }
                return response.json();
            })
            .then(() => {
                setReplies((prev) => prev.filter((c) => c.id !== commentId));
                setReplyCount((prev) => prev - 1);
            })
            .catch(() => {
                router.reload();
            });
    };

    return (
        <div key={commentKey} className={'border-t border-neutral-200 py-4 dark:border-neutral-700'}>
            <div className="flex flex-row items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Avatar className="size-8 overflow-hidden rounded-full">
                    <AvatarImage src={comment.user?.avatar_url} alt={comment.user?.username || ''} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(comment.user?.username || '')}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-row flex-wrap items-center justify-start gap-1">
                    <p>{comment.user?.username || '[deleted user]'}</p>
                    <Dot size={14} />
                    <p>{comment.time_since || 'just now'}</p>
                </div>
            </div>
            <p className="mt-2 text-neutral-900 dark:text-neutral-100">{comment.body}</p>
            <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/comments/${comment.id}/vote`}
                        only={['comments']}
                        method="post"
                        data={{ value: 1 }}
                        preserveState
                        preserveScroll
                        onClick={() => {
                            if (userVote === 1) {
                                setUserVote(0);
                                return setVoteCount(voteCount - 1);
                            }

                            setUserVote(1);
                            return setVoteCount(voteCount + (userVote === -1 ? 2 : 1));
                        }}
                        className={`cursor-pointer text-lg ${userVote === 1 ? 'text-emerald-500' : 'text-neutral-500'} transition hover:text-emerald-600`}
                    >
                        <ArrowBigUp />
                    </Link>
                    <span className="text-neutral-900 dark:text-neutral-100">{voteCount}</span>
                    <Link
                        href={`/comments/${comment.id}/vote`}
                        only={['comments']}
                        method="post"
                        data={{ value: -1 }}
                        preserveState
                        preserveScroll
                        onClick={() => {
                            if (userVote === -1) {
                                setUserVote(0);
                                return setVoteCount(voteCount + 1);
                            }

                            setUserVote(-1);
                            return setVoteCount(voteCount - (userVote === 1 ? 2 : 1));
                        }}
                        className={`cursor-pointer text-lg ${userVote === -1 ? 'text-red-500' : 'text-neutral-500'} transition hover:text-red-600`}
                    >
                        <ArrowBigDown />
                    </Link>
                    {auth.user && (auth.can_delete || auth.user.id === comment.user?.id) && (
                        <Trash2
                            size={18}
                            className="cursor-pointer text-lg text-neutral-500 transition hover:text-red-600"
                            onClick={() => deleteComment(comment.id)}
                        />
                    )}
                    {comment.user && (
                        <button
                            onClick={() => setShowReplyForm((prev) => !prev)}
                            className="cursor-pointer text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                            Reply
                        </button>
                    )}
                </div>
            </div>

            {comment.user && (
                <form onSubmit={handleSubmitReplyComment} className={'mt-4 ' + (!showReplyForm && 'hidden')}>
                    <textarea
                        ref={inputRef}
                        value={replyData.body}
                        onChange={(e) => {
                            setReplyData('body', e.target.value);
                            clearReplyErrors();
                        }}
                        className="min-h-[80px] w-full rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                        placeholder="Add a reply..."
                        rows={2}
                        disabled={!auth.user || !auth.user.email_verified_at || replyProcessing}
                    />
                    {replyErrors.body && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{replyErrors.body}</p>}
                    {!auth.user && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{'Sign in before commenting.'}</p>}
                    {auth.user && !auth.user.email_verified_at && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{'Verify your email before commenting.'}</p>
                    )}

                    <div className={'mt-3 flex gap-3'}>
                        <button
                            type="submit"
                            disabled={!auth.user || !auth.user.email_verified_at || replyProcessing}
                            className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        >
                            {replyProcessing ? 'Posting...' : 'Post'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowReplyForm(false);
                                setReplyData('body', '');
                            }}
                            className="cursor-pointer rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            {(replyCount > 0 || replies.length > 0) && (
                <div className="flex w-full items-center justify-center">
                    <button
                        disabled={loadingReplies}
                        onClick={() => {
                            setShowReplies((prev) => !prev);

                            if (!loadedReplies) {
                                loadMoreReplies();
                            }
                        }}
                        className="mt-4 cursor-pointer text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                    >
                        {showReplies
                            ? 'Hide Replies'
                            : loadingReplies
                              ? 'Loading replies...'
                              : replyCount === 1
                                ? 'Show 1 Reply'
                                : `Show ${replyCount} Replies`}
                    </button>
                </div>
            )}
            {showReplies && replies.length > 0 && (
                <div className="mt-4">
                    {replies.map((nestedComment) => (
                        <ShowPostNestedComment
                            key={`comment-${nestedComment.id}`}
                            comment={nestedComment}
                            topLevelCommentId={comment.id}
                            loadCommentsAfterReply={loadCommentsAfterReply}
                            deleteReply={handleDeleteReply}
                        />
                    ))}
                    {hasMoreReplies && (
                        <div className="flex w-full items-center justify-center">
                            <button
                                disabled={loadingReplies}
                                onClick={loadMoreReplies}
                                className="mt-4 cursor-pointer text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                            >
                                {loadingReplies ? 'Loading more replies...' : 'Load More Replies'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
