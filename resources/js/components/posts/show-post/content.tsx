import { ShowPostContentProps } from '@/types/pages/show-post';
import { ReactNode } from 'react';

export default function ShowPostContent({ post }: ShowPostContentProps) {
    const contentWithMedia: ReactNode[] = [];
    const extraMedia: ReactNode[] = [];

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

    return <div className="prose dark:prose-invert">{contentWithMedia}</div>;
}
