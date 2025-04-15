import { ShowPostContentProps } from '@/types/pages/posts/show';
import DOMPurify from 'dompurify';

export default function ShowPostContent({ post }: ShowPostContentProps) {
    return (
        <div className="post-show prose dark:prose-invert my-6">
            <div
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.body, {
                        ADD_TAGS: ['h2', 'h3', 'video', 'source'],
                        ADD_ATTR: ['loading', 'controls', 'src', 'type', 'style'],
                        FORBID_TAGS: ['figure', 'figcaption'], // Explicitly exclude
                    }),
                }}
            />
        </div>
    );
}
