import { ShowPostContentProps } from '@/types/pages/posts/show';
import DOMPurify from 'dompurify';

export default function ShowPostContent({ post }: ShowPostContentProps) {
    const sanitizedBody = DOMPurify.sanitize(post.body, {
        ALLOWED_TAGS: ['p', 'div', 'br', 'iframe', 'h2', 'h3', 'source', 'img'],
        ALLOWED_ATTR: ['src', 'style', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'scrolling', 'alt'],
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allowfullscreen'],
        ALLOW_UNKNOWN_PROTOCOLS: false,
    });

    return (
        <div className="post-show prose dark:prose-invert my-6 max-w-none">
            <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
        </div>
    );
}
