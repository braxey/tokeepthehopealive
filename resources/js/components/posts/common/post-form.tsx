import ArchivePost from '@/components/posts/edit-posts/archive-post';
import DeletePost from '@/components/posts/edit-posts/delete-post';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { PostFormProps } from '@/types/pages/posts/common';
import { usePage } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { WysiwygEditor } from './wysiwyg-editor';

export function PostForm({ post, title, summary, previewImage, previewCaption, body, setValue, submitForm, processing }: PostFormProps) {
    const { auth, errors } = usePage<SharedData>().props;
    const [deleting, setDeleting] = useState<boolean>(false);
    const [archiving, setArchiving] = useState<boolean>(false);

    return (
        <form
            onSubmit={(e: FormEvent) => {
                e.preventDefault();
                submitForm();
            }}
            className="flex flex-col gap-8 rounded-xl bg-white p-8 shadow-lg dark:bg-neutral-900"
        >
            <h1 className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">{post ? 'Edit Testimony' : 'Share a Testimony'}</h1>

            {/* Title */}
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setValue('title', e.target.value)}
                    className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                    placeholder="Enter Testimony Title"
                />
                {errors.title && <span className="text-sm text-red-600 dark:text-red-400">{errors.title}</span>}
            </div>

            {/* Preview Image */}
            <div className="flex flex-col gap-2">
                <label htmlFor="preview_image" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Preview Image
                </label>

                {post && !previewImage && (
                    <img src={post.preview_image_url} alt="Current preview" className="mb-4 max-h-40 rounded-lg object-cover" />
                )}

                <input
                    id="preview_image"
                    type="file"
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files[0]) {
                            setValue('preview_image', e.target.files[0]);
                        }
                    }}
                    className="cursor-pointer rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                />
                {errors.preview_image && <span className="text-sm text-red-600 dark:text-red-400">{errors.preview_image}</span>}
            </div>

            {/* Preview Caption */}
            <div className="flex flex-col gap-2">
                <label htmlFor="preview_caption" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Preview Caption
                </label>
                <input
                    id="preview_caption"
                    type="text"
                    value={previewCaption}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setValue('preview_caption', e.target.value);
                    }}
                    className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                    placeholder="Enter Preview Caption"
                />
                {errors.preview_caption && <span className="text-sm text-red-600 dark:text-red-400">{errors.preview_caption}</span>}
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-2">
                <label htmlFor="summary" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Summary
                </label>
                <textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setValue('summary', e.target.value)}
                    className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                    placeholder="Enter Testimony Summary"
                    rows={4}
                />
                {errors.summary && <span className="text-sm text-red-600 dark:text-red-400">{errors.summary}</span>}
            </div>

            {/* Body */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Body</label>
                <WysiwygEditor content={body} onChange={(body) => setValue('body', body)} />
                {errors.body && <span className="text-sm text-red-600 dark:text-red-400">{errors.body}</span>}
            </div>

            <div className="flex justify-center gap-5">
                <Button
                    type="submit"
                    disabled={processing || archiving || deleting}
                    className="cursor-pointer rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                    {post ? 'Update' : 'Create'}
                </Button>

                {post && <ArchivePost post={post} setArchiving={setArchiving} disabled={processing || archiving || deleting} />}

                {post && auth.can_delete && <DeletePost postId={post.id} setDeleting={setDeleting} disabled={processing || archiving || deleting} />}
            </div>
        </form>
    );
}
