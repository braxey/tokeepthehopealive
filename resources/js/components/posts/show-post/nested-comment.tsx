import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { SharedData } from '@/types';
import { ShowPostNestedCommentProps } from '@/types/pages/posts/show';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

export default function ShowPostNestedComment({ comment, topLevelCommentId, loadCommentsAfterReply }: ShowPostNestedCommentProps) {
    const commentKey = `comment-${comment.id}`;
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const [userVote, setUserVote] = useState<number | null>(comment.user_vote);
    const [voteCount, setVoteCount] = useState<number>(comment.vote_count);
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

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

    const handleSubmitReplyComment = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(`/comments/${topLevelCommentId}/comment`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setReplyData('body', '');
                setShowReplyForm(false);
                loadCommentsAfterReply();
            },
        });
    };

    return (
        <div key={commentKey} className={'mt-2 ml-6 border-l-2 border-neutral-300 py-4 pl-4 dark:border-neutral-600'}>
            <div className="flex flex-row items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Avatar className="size-8 overflow-hidden rounded-full">
                    <AvatarImage src={comment.user?.avatar_url} alt={comment.user?.username} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(comment.user?.username)}
                    </AvatarFallback>
                </Avatar>
                <p>
                    {comment.user?.username || '[deleted user]'} ► {comment.to_user?.username || '[deleted user]'} ·{' '}
                    {comment.time_since || 'Just now'}
                </p>
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
                        ▼
                    </Link>
                    <button
                        onClick={() => setShowReplyForm((prev) => !prev)}
                        className="cursor-pointer text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                        Reply
                    </button>
                </div>
            </div>
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

                <div className="mt-3 flex gap-3">
                    <button
                        type="submit"
                        disabled={!auth.user || !auth.user.email_verified_at || replyProcessing}
                        className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    >
                        {replyProcessing ? 'Posting...' : 'Post'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowReplyForm(false)}
                        className="cursor-pointer rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
