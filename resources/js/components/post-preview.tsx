import { ReactNode } from 'react';

interface PostPreviewProps {
    title: string;
    summary: string;
    body: { [key: string]: string }[];
    previewImage: string | File | null;
    previewCaption: string;
    media: (string | File)[];
    mediaPositions: number[];
    mediaCaptions: (string | null)[];
}

export function PostPreview({ title, summary, body, previewImage, previewCaption, media, mediaPositions, mediaCaptions }: PostPreviewProps) {
    const contentWithMedia: ReactNode[] = [];
    const extraMedia: ReactNode[] = [];

    // Build content with sections and interleaved media
    body.forEach((section, index) => {
        contentWithMedia.push(
            <div key={`section-${index}`} className="my-6">
                {section.section_title && <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{section.section_title}</h2>}
                {section.section_text && <p className="mt-3 text-neutral-700 dark:text-neutral-300">{section.section_text}</p>}
            </div>,
        );

        const mediaAtPosition = media.filter((_, i) => mediaPositions[i] === index);
        mediaAtPosition.forEach((mediaItem, mediaIndex) => {
            const caption = mediaCaptions[media.indexOf(mediaItem)] || '';
            const src = typeof mediaItem === 'string' ? mediaItem : URL.createObjectURL(mediaItem);
            const isImage = typeof mediaItem === 'string' ? true : mediaItem.type.startsWith('image/');

            contentWithMedia.push(
                <div key={`media-${mediaIndex}`} className="my-6 flex flex-col items-center">
                    {isImage ? (
                        <img
                            src={src}
                            alt={caption || 'preview media'}
                            className="h-auto max-h-[400px] w-auto max-w-full rounded-lg object-contain shadow-md"
                        />
                    ) : (
                        <video controls className="h-auto max-h-[400px] w-auto max-w-full rounded-lg shadow-md">
                            <source src={src} type={mediaItem instanceof File ? mediaItem.type : 'video/mp4'} />
                        </video>
                    )}
                    {caption && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{caption}</p>}
                </div>,
            );
        });
    });

    // Handle leftover media (position > max section index)
    const maxSectionIndex = body.length - 1;
    const leftoverMedia = media.filter((_, i) => mediaPositions[i] > maxSectionIndex);
    leftoverMedia.forEach((mediaItem, index) => {
        const caption = mediaCaptions[media.indexOf(mediaItem)] || '';
        const src = typeof mediaItem === 'string' ? mediaItem : URL.createObjectURL(mediaItem);
        const isImage = typeof mediaItem === 'string' ? true : mediaItem.type.startsWith('image/');

        extraMedia.push(
            <div key={`extra-media-${index}`} className="my-6 flex flex-col items-center">
                {isImage ? (
                    <img
                        src={src}
                        alt={caption || 'extra media'}
                        className="h-auto max-h-[400px] w-auto max-w-full rounded-lg object-contain shadow-md"
                    />
                ) : (
                    <video controls className="h-auto max-h-[400px] w-auto max-w-full rounded-lg shadow-md">
                        <source src={src} type={mediaItem instanceof File ? mediaItem.type : 'video/mp4'} />
                    </video>
                )}
                {caption && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{caption}</p>}
            </div>,
        );
    });

    if (extraMedia.length > 0) {
        contentWithMedia.push(...extraMedia);
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Title, Preview Image, and Summary */}
            <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
                <h1 className="mb-6 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">{title || 'Untitled Testimony'}</h1>
                {previewImage && (
                    <div className="mb-6 flex flex-col items-center">
                        <img
                            src={typeof previewImage === 'string' ? previewImage : URL.createObjectURL(previewImage)}
                            alt={previewCaption || title || 'Preview Image'}
                            className="h-auto max-h-[500px] w-auto max-w-full rounded-lg object-contain shadow-md"
                        />
                        {previewCaption && <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{previewCaption}</p>}
                        {summary && <p className="mt-4 text-neutral-700 dark:text-neutral-300">{summary}</p>}
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
                <div className="prose dark:prose-invert">{contentWithMedia}</div>
            </div>
        </div>
    );
}
