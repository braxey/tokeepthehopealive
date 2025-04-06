import ShowPostCommentSection from '@/components/posts/show-post/comment-section';
import ShowPostPreviewAndContent from '@/components/posts/show-post/preview-and-content';
import AppLayout from '@/layouts/app-layout';
import { ShowPostProps } from '@/types/pages/show-post';
import { Head } from '@inertiajs/react';

export default function ShowPost({ post, comments }: ShowPostProps) {
    return (
        <AppLayout>
            <Head title={post.title} />
            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-6">
                <ShowPostPreviewAndContent post={post} />
                <ShowPostCommentSection post={post} comments={comments} />
            </div>
        </AppLayout>
    );
}
