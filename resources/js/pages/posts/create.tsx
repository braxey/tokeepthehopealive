import { PostForm } from '@/components/posts/common/post-form';
import { PostPreview } from '@/components/posts/common/post-preview';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { convertYouTubeUrlsToEmbeds } from '@/lib/utils';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreatePost() {
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const { data, setData } = useForm({
        title: '',
        summary: '',
        body: '',
        preview_image: null as File | null,
        preview_caption: '',
    });

    const handleSubmit = () => {
        const updatedBody = convertYouTubeUrlsToEmbeds(data.body);
        setProcessing(true);

        router.post(
            route('posts.store'),
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
            <Head title="Create Testimony" />
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
                        previewImage={data.preview_image}
                        previewCaption={data.preview_caption}
                        summary={data.summary}
                        body={convertYouTubeUrlsToEmbeds(data.body)}
                    />
                ) : (
                    <PostForm
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
