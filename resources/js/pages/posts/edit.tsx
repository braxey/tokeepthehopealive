import { PostForm } from '@/components/posts/common/post-form';
import AppLayout from '@/layouts/app-layout';
import { EditPostProps } from '@/types/pages/posts/edit';
import { Head, useForm } from '@inertiajs/react';

export default function EditPost({ post }: EditPostProps) {
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
            <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col gap-6 p-6">
                <PostForm
                    post={post}
                    title={data.title}
                    summary={data.summary}
                    previewImage={data.preview_image}
                    previewCaption={data.preview_caption}
                    body={data.body}
                    setValue={setData}
                    processing={processing}
                    submitForm={() => {
                        update(route('posts.update', { post: post.id }), {
                            preserveState: true,
                        });
                    }}
                />
            </div>
        </AppLayout>
    );
}
