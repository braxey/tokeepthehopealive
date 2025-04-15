import { PostForm } from '@/components/posts/common/post-form';
import { PostPreview } from '@/components/posts/common/post-preview';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreatePost() {
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const { data, setData, post, processing } = useForm({
        title: '',
        summary: '',
        body: '',
        preview_image: null as File | null,
        preview_caption: '',
    });

    return (
        <AppLayout>
            <Head title="Create Testimony" />
            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-6">
                <div className="flex justify-end">
                    <Button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    >
                        {isPreviewMode ? 'Back to Creating' : 'Preview'}
                    </Button>
                </div>

                {isPreviewMode ? (
                    <PostPreview
                        title={data.title}
                        summary={data.summary}
                        body={data.body}
                        previewImage={data.preview_image}
                        previewCaption={data.preview_caption}
                    />
                ) : (
                    <PostForm
                        title={data.title}
                        summary={data.summary}
                        previewImage={data.preview_image}
                        previewCaption={data.preview_caption}
                        body={data.body}
                        setValue={setData}
                        processing={processing}
                        submitForm={() => {
                            post(route('posts.store'), {
                                preserveState: true,
                            });
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
