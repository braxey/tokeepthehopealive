import { PostForm } from '@/components/posts/common/post-form';
import { PostPreview } from '@/components/posts/common/post-preview';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { convertYouTubeUrlsToEmbeds } from '@/lib/utils';
import { EditPostProps } from '@/types/pages/posts/edit';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EditPost({ post }: EditPostProps) {
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const { data, setData } = useForm({
        title: post.title || '',
        summary: post.summary || '',
        body: post.body || '',
        preview_image: null as File | null,
        preview_caption: post.preview_caption || '',
    });

    const handleSubmit = () => {
        const updatedBody = convertYouTubeUrlsToEmbeds(data.body);
        setProcessing(true);

        router.put(
            route('posts.update', post.id),
            {
                ...data,
                body: updatedBody,
            },
            {
                onError: () => setProcessing(false),
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Edit Testimony" />
            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-6">
                <div className="flex justify-end">
                    <Button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    >
                        {isPreviewMode ? 'Back' : 'Preview'}
                    </Button>
                </div>

                {isPreviewMode ? (
                    <PostPreview
                        title={data.title}
                        previewImage={data.preview_image || post.preview_image_url}
                        previewCaption={data.preview_caption}
                        summary={data.summary}
                        body={convertYouTubeUrlsToEmbeds(data.body)}
                    />
                ) : (
                    <PostForm
                        post={post}
                        title={data.title}
                        previewImage={data.preview_image}
                        previewCaption={data.preview_caption}
                        summary={data.summary}
                        body={data.body}
                        setValue={setData}
                        processing={processing}
                        submitForm={handleSubmit}
                    />
                )}
            </div>
        </AppLayout>
    );
}
