import { convertYouTubeUrlsToEmbeds } from '@/lib/utils';
import DOMPurify from 'dompurify';

interface PostPreviewProps {
    title: string;
    previewImage: string | File | null;
    previewCaption: string;
    summary: string;
    body: string;
}

export function PostPreview({ title, previewImage, previewCaption, summary, body }: PostPreviewProps) {
    const processedBody = convertYouTubeUrlsToEmbeds(body);

    const sanitizedBody: string = DOMPurify.sanitize(processedBody, {
        ADD_TAGS: ['h2', 'h3', 'iframe', 'source', 'p', 'br'],
        ADD_ATTR: ['loading', 'controls', 'src', 'type', 'style'],
        FORBID_TAGS: ['figure', 'figcaption'],
    });

    return (
        <div className="post-show flex flex-col gap-6">
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

                <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
            </div>
        </div>
    );
}
