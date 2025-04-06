import ShowPostContent from '@/components/posts/show-post/content';
import ShowPostPreview from '@/components/posts/show-post/preview';
import { ShowPostPreviewAndContentProps } from '@/types/pages/show-post';

export default function ShowPostPreviewAndContent({ post }: ShowPostPreviewAndContentProps) {
    return (
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
            <ShowPostPreview post={post} />
            <ShowPostContent post={post} />
        </div>
    );
}
