import DeletePost from '@/components/posts/edit-posts/delete-post';
import AppLayout from '@/layouts/app-layout';
import { Media, Post } from '@/types/models';
import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useState } from 'react';

type EditProps = {
    post: Post & {
        media: Media[];
    };
};

export default function EditPost({ post }: EditProps) {
    const [deleting, setDeleting] = useState<boolean>(false);

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
        deleted_media: [] as number[],
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
            <Head title="Edit Testimony" />
            <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col gap-6 p-6">
                <form onSubmit={submit} className="flex flex-col gap-8 rounded-xl bg-white p-8 shadow-lg dark:bg-neutral-900">
                    <h1 className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">Edit Testimony</h1>

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                            placeholder="Enter Testimony Title"
                        />
                        {errors.title && <span className="text-sm text-red-600 dark:text-red-400">{errors.title}</span>}
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="summary" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Summary
                        </label>
                        <textarea
                            id="summary"
                            value={data.summary}
                            onChange={(e) => setData('summary', e.target.value)}
                            className="min-h-[100px] rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                            placeholder="Enter a brief summary"
                        />
                        {errors.summary && <span className="text-sm text-red-600 dark:text-red-400">{errors.summary}</span>}
                    </div>

                    {/* Body Sections */}
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Body Sections</label>
                        {data.body.map((section, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor={`section-title-${index}`}
                                        className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                                    >
                                        Section Title (Optional)
                                    </label>
                                    <input
                                        id={`section-title-${index}`}
                                        type="text"
                                        value={section.section_title || ''}
                                        onChange={(e) => updateSection(index, 'section_title', e.target.value)}
                                        className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                                        placeholder="Enter Section Title"
                                    />
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <label htmlFor={`section-text-${index}`} className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        Section Text (Optional)
                                    </label>
                                    <textarea
                                        id={`section-text-${index}`}
                                        value={section.section_text || ''}
                                        onChange={(e) => updateSection(index, 'section_text', e.target.value)}
                                        className="min-h-[120px] rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                                        placeholder="Write Section Content"
                                    />
                                </div>
                                {data.body.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSection(index)}
                                        className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Remove Section
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSection}
                            className="mt-2 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900"
                        >
                            Add Section
                        </button>
                        {errors.body && <span className="text-sm text-red-600 dark:text-red-400">{errors.body}</span>}
                    </div>

                    {/* Preview Image */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="preview_image" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Preview Image
                        </label>
                        {post.preview_image && !data.preview_image && (
                            <img src={post.preview_image} alt="Current preview" className="mb-4 max-h-40 rounded-lg object-cover" />
                        )}
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="preview_image"
                                className="cursor-pointer rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
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
                                <span className="truncate text-sm text-neutral-600 dark:text-neutral-400">{data.preview_image.name}</span>
                            )}
                        </div>
                        {errors.preview_image && <span className="text-sm text-red-600 dark:text-red-400">{errors.preview_image}</span>}
                        {(data.preview_image || post.preview_image) && (
                            <div className="mt-4 flex flex-col gap-2">
                                {data.preview_image && (
                                    <img
                                        src={URL.createObjectURL(data.preview_image)}
                                        alt="New preview"
                                        className="max-h-40 rounded-lg object-cover"
                                    />
                                )}
                                <label htmlFor="preview_caption" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                    Preview Caption (Optional)
                                </label>
                                <input
                                    id="preview_caption"
                                    type="text"
                                    value={data.preview_caption}
                                    onChange={handlePreviewCaptionChange}
                                    className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                                    placeholder="Enter Preview Caption"
                                />
                                {errors.preview_caption && <span className="text-sm text-red-600 dark:text-red-400">{errors.preview_caption}</span>}
                            </div>
                        )}
                    </div>

                    {/* Media */}
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Media</label>

                        {/* Existing Media */}
                        {data.existing_media.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Existing Media</p>
                                {data.existing_media.map((media, index) => (
                                    <div
                                        key={media.id}
                                        className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <img
                                            src={post.media.find((m) => m.id === media.id)?.url}
                                            alt={media.caption || 'Media'}
                                            className="mb-3 max-h-32 rounded-lg object-cover"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <label
                                                    htmlFor={`existing-position-${index}`}
                                                    className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                                                >
                                                    Position:
                                                </label>
                                                <input
                                                    id={`existing-position-${index}`}
                                                    type="number"
                                                    min="0"
                                                    value={media.position ?? 0}
                                                    onChange={(e) => handlePositionChange(index, e.target.value, true)}
                                                    className="w-20 rounded-lg border border-neutral-300 bg-white p-2 text-center text-neutral-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label
                                                    htmlFor={`existing-caption-${index}`}
                                                    className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                                                >
                                                    Caption (Optional):
                                                </label>
                                                <input
                                                    id={`existing-caption-${index}`}
                                                    type="text"
                                                    value={media.caption ?? ''}
                                                    onChange={(e) => handleCaptionChange(index, e.target.value, true)}
                                                    className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                                                    placeholder="Enter Caption"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeMedia(index, true)}
                                                className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Remove Media
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Media */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="media"
                                    className="cursor-pointer rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
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
                                    <span className="truncate text-sm text-neutral-600 dark:text-neutral-400">
                                        {data.media.map((file) => file.name).join(', ')}
                                    </span>
                                )}
                            </div>
                            {errors.media && <span className="text-sm text-red-600 dark:text-red-400">{errors.media}</span>}
                        </div>

                        {/* New Media Details */}
                        {data.media.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                    New Media Details (Position: 0 = After First Section, 1 = After Second, etc.)
                                </p>
                                {data.media.map((file, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <span className="mb-2 block truncate text-sm text-neutral-600 dark:text-neutral-400">{file.name}</span>
                                        {file.type.startsWith('image/') && (
                                            <img src={URL.createObjectURL(file)} alt={file.name} className="mb-3 max-h-32 rounded-lg object-cover" />
                                        )}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <label
                                                    htmlFor={`position-${index}`}
                                                    className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                                                >
                                                    Position:
                                                </label>
                                                <input
                                                    id={`position-${index}`}
                                                    type="number"
                                                    min="0"
                                                    value={data.media_positions[index] ?? 0}
                                                    onChange={(e) => handlePositionChange(index, e.target.value, false)}
                                                    className="w-20 rounded-lg border border-neutral-300 bg-white p-2 text-center text-neutral-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label
                                                    htmlFor={`caption-${index}`}
                                                    className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                                                >
                                                    Caption (Optional):
                                                </label>
                                                <input
                                                    id={`caption-${index}`}
                                                    type="text"
                                                    value={data.media_captions[index] ?? ''}
                                                    onChange={(e) => handleCaptionChange(index, e.target.value, false)}
                                                    className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                                                    placeholder="Enter Caption"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeMedia(index, false)}
                                                className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Remove Media
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center gap-5">
                        <button
                            type="submit"
                            disabled={processing || deleting}
                            className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-md transition hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:disabled:bg-emerald-400"
                        >
                            {processing ? 'Updating...' : 'Update Testimony'}
                        </button>

                        <DeletePost postId={post.id} deleting={deleting} setDeleting={setDeleting} processing={processing} />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
