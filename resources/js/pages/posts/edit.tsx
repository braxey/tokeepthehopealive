import AppLayout from '@/layouts/app-layout';
import { Media, Post } from '@/types/models';
import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent, FormEvent } from 'react';

type EditProps = {
    post: Post & {
        media: Media[];
    };
};

export default function EditPost({ post }: EditProps) {
    const {
        data,
        setData,
        post: submitPost,
        processing,
        errors,
    } = useForm({
        title: post.title || '',
        summary: post.summary || '',
        body: post.body || [{ section_title: '', section_text: '' }],
        preview_image: null as File | null,
        preview_caption: post.preview_caption || '',
        media: [] as File[],
        media_positions: post.media.map((m) => m.position) as number[],
        media_captions: post.media.map((m) => m.caption) as (string | null)[],
        existing_media: post.media.map((m) => ({
            id: m.id,
            position: m.position,
            caption: m.caption,
        })),
        deleted_media: [] as number[], // New field to track deleted media IDs
    });

    const addSection = () => {
        setData('body', [...data.body, { section_title: '', section_text: '' }]);
    };

    const updateSection = (index: number, field: 'section_title' | 'section_text', value: string) => {
        const newBody = [...data.body];
        newBody[index][field] = value;
        setData('body', newBody);
    };

    const removeSection = (index: number) => {
        if (data.body.length > 1) {
            setData(
                'body',
                data.body.filter((_, i) => i !== index),
            );
        }
    };

    const handlePreviewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('preview_image', e.target.files[0]);
        }
    };

    const handlePreviewCaptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData('preview_caption', e.target.value);
    };

    const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setData({
                ...data,
                media: files,
                media_positions: [...data.media_positions, ...files.map((_, index) => data.media_positions.length + index)],
                media_captions: [...data.media_captions, ...files.map(() => null)],
            });
        }
    };

    const handlePositionChange = (index: number, value: string, isExisting: boolean) => {
        if (isExisting) {
            const existingMedia = [...data.existing_media];
            existingMedia[index].position = parseInt(value) || 0;
            setData('existing_media', existingMedia);
        } else {
            const positions = [...data.media_positions];
            positions[index] = parseInt(value) || 0;
            setData('media_positions', positions);
        }
    };

    const handleCaptionChange = (index: number, value: string, isExisting: boolean) => {
        if (isExisting) {
            const existingMedia = [...data.existing_media];
            existingMedia[index].caption = value || null;
            setData('existing_media', existingMedia);
        } else {
            const captions = [...data.media_captions];
            captions[index] = value || null;
            setData('media_captions', captions);
        }
    };

    const removeMedia = (index: number, isExisting: boolean) => {
        if (isExisting) {
            const mediaToDelete = data.existing_media[index];
            setData({
                ...data,
                existing_media: data.existing_media.filter((_, i) => i !== index),
                deleted_media: [...data.deleted_media, mediaToDelete.id],
            });
        } else {
            setData({
                ...data,
                media: data.media.filter((_, i) => i !== index),
                media_positions: data.media_positions.filter((_, i) => i !== index),
                media_captions: data.media_captions.filter((_, i) => i !== index),
            });
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        submitPost(route('posts.update', post.id), {
            preserveState: true,
            onSuccess: () => {
                setData({
                    ...data,
                    media: [],
                    media_positions: data.existing_media.map((m) => m.position),
                    media_captions: data.existing_media.map((m) => m.caption),
                    deleted_media: [],
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Post" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl p-4">
                <form
                    onSubmit={submit}
                    className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col gap-10 rounded-xl border bg-white p-6 dark:bg-neutral-800"
                >
                    <h1 className="text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">Edit Post</h1>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                            placeholder="Enter Post Title"
                        />
                        {errors.title && <span className="text-sm text-red-500">{errors.title}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="summary" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Summary
                        </label>
                        <textarea
                            id="summary"
                            value={data.summary}
                            onChange={(e) => setData('summary', e.target.value)}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                            placeholder="Enter a brief summary"
                        />
                        {errors.summary && <span className="text-sm text-red-500">{errors.summary}</span>}
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Body Sections</label>
                        {data.body.map((section, index) => (
                            <div key={index} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`section-title-${index}`} className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                        Section Title (Optional)
                                    </label>
                                    <input
                                        id={`section-title-${index}`}
                                        type="text"
                                        value={section.section_title || ''}
                                        onChange={(e) => updateSection(index, 'section_title', e.target.value)}
                                        className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                                        placeholder="Enter Section Title"
                                    />
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <label htmlFor={`section-text-${index}`} className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                        Section Text (Optional)
                                    </label>
                                    <textarea
                                        id={`section-text-${index}`}
                                        value={section.section_text || ''}
                                        onChange={(e) => updateSection(index, 'section_text', e.target.value)}
                                        className="border-sidebar-border/70 dark:border-sidebar-border min-h-[100px] rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                                        placeholder="Write Section Content"
                                    />
                                </div>
                                {data.body.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSection(index)}
                                        className="mt-2 text-sm text-red-500 hover:text-red-700"
                                    >
                                        Remove Section
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSection}
                            className="mt-2 rounded-xl bg-neutral-200 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-500"
                        >
                            Add Section
                        </button>
                        {errors.body && <span className="text-sm text-red-500">{errors.body}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="preview_image" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Preview Image
                        </label>
                        {post.preview_image && !data.preview_image && (
                            <div className="mb-2">
                                <img src={post.preview_image} alt="Current preview" className="h-auto max-h-[200px] w-auto max-w-full rounded-xl" />
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="preview_image"
                                className="border-sidebar-border/70 dark:border-sidebar-border cursor-pointer rounded-xl border bg-neutral-100 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-500"
                            >
                                Choose New File
                                <input
                                    id="preview_image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handlePreviewImageChange}
                                    className="hidden"
                                />
                            </label>
                            {data.preview_image && (
                                <span className="max-w-xs truncate text-sm text-neutral-700 dark:text-neutral-300">{data.preview_image.name}</span>
                            )}
                        </div>
                        {errors.preview_image && <span className="text-sm text-red-500">{errors.preview_image}</span>}
                        <div className="mt-2 flex flex-col gap-2">
                            <label htmlFor="preview_caption" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                Preview Image Caption (Optional)
                            </label>
                            <input
                                id="preview_caption"
                                type="text"
                                value={data.preview_caption}
                                onChange={handlePreviewCaptionChange}
                                className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                                placeholder="Enter Preview Caption"
                            />
                            {errors.preview_caption && <span className="text-sm text-red-500">{errors.preview_caption}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Media</label>
                        {/* Existing Media */}
                        {data.existing_media.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Existing Media</p>
                                {data.existing_media.map((media, index) => (
                                    <div
                                        key={media.id}
                                        className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col gap-2 border-t pt-2"
                                    >
                                        <img
                                            src={post.media.find((m) => m.id === media.id)?.url}
                                            alt={media.caption || 'Media'}
                                            className="h-auto max-h-[100px] w-auto max-w-full rounded-xl"
                                        />
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`existing-position-${index}`} className="text-sm text-neutral-900 dark:text-neutral-100">
                                                Position:
                                            </label>
                                            <input
                                                id={`existing-position-${index}`}
                                                type="number"
                                                min="0"
                                                value={media.position ?? 0}
                                                onChange={(e) => handlePositionChange(index, e.target.value, true)}
                                                className="border-sidebar-border/70 dark:border-sidebar-border w-16 rounded-xl border bg-white p-1 text-center text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`existing-caption-${index}`} className="text-sm text-neutral-900 dark:text-neutral-100">
                                                Caption (Optional):
                                            </label>
                                            <input
                                                id={`existing-caption-${index}`}
                                                type="text"
                                                value={media.caption ?? ''}
                                                onChange={(e) => handleCaptionChange(index, e.target.value, true)}
                                                className="border-sidebar-border/70 dark:border-sidebar-border flex-1 rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                                                placeholder="Enter Caption (Optional)"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(index, true)}
                                            className="mt-2 mb-6 text-sm text-red-500 hover:text-red-700"
                                        >
                                            Remove Media
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Media */}
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="media"
                                className="border-sidebar-border/70 dark:border-sidebar-border cursor-pointer rounded-xl border bg-neutral-100 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-500"
                            >
                                Add New Media
                                <input
                                    id="media"
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                                    onChange={handleMediaChange}
                                    className="hidden"
                                />
                            </label>
                            {data.media.length > 0 && (
                                <span className="max-w-xs truncate text-sm text-neutral-700 dark:text-neutral-300">
                                    {data.media.map((file) => file.name).join(', ')}
                                </span>
                            )}
                        </div>
                        {errors.media && <span className="text-sm text-red-500">{errors.media}</span>}
                        {data.media.length > 0 && (
                            <div className="mt-2 flex flex-col gap-2">
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    New Media Details (Position: 0 = After First Section, 1 = After Second, etc.)
                                </p>
                                {data.media.map((file, index) => (
                                    <div
                                        key={index}
                                        className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col gap-2 border-t pt-2"
                                    >
                                        <span className="max-w-xs truncate text-sm text-neutral-700 dark:text-neutral-300">{file.name}</span>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`position-${index}`} className="text-sm text-neutral-900 dark:text-neutral-100">
                                                Position:
                                            </label>
                                            <input
                                                id={`position-${index}`}
                                                type="number"
                                                min="0"
                                                value={data.media_positions[index] ?? 0}
                                                onChange={(e) => handlePositionChange(index, e.target.value, false)}
                                                className="border-sidebar-border/70 dark:border-sidebar-border w-16 rounded-xl border bg-white p-1 text-center text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`caption-${index}`} className="text-sm text-neutral-900 dark:text-neutral-100">
                                                Caption (Optional):
                                            </label>
                                            <input
                                                id={`caption-${index}`}
                                                type="text"
                                                value={data.media_captions[index] ?? ''}
                                                onChange={(e) => handleCaptionChange(index, e.target.value, false)}
                                                className="border-sidebar-border/70 dark:border-sidebar-border flex-1 rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                                                placeholder="Enter Caption (Optional)"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(index, false)}
                                            className="mt-2 text-sm text-red-500 hover:text-red-700"
                                        >
                                            Remove Media
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:bg-emerald-300 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:disabled:bg-emerald-400"
                        >
                            {processing ? 'Updating...' : 'Update Post'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
