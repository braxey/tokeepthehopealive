import { PostForm } from '@/components/posts/common/post-form';
import { PostPreview } from '@/components/posts/common/post-preview';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { EditPostProps } from '@/types/pages/posts/edit';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EditPost({ post }: EditPostProps) {
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const {
        data,
        setData,
        post: update,
        processing,
    } = useForm({
        title: post.title || '',
        summary: post.summary || '',
        body: post.body || '',
        preview_image: null as File | null,
        preview_caption: post.preview_caption || '',
    });

    return (
        <AppLayout>
            <Head title="Edit Testimony" />
            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-6">
                <div className="flex justify-end">
                    <Button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
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
                        body={data.body}
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
                        submitForm={() => {
                            update(route('posts.update', { post: post.id }), {
                                preserveState: true,
                            });
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
