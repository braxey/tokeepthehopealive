import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent, FormEvent } from 'react';

export default function CreatePost() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        preview_image: null as File | null,
        preview_caption: '',
        media: [] as File[],
        media_positions: [] as number[],
        media_captions: [] as (string | null)[],
    });

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
                media_positions: files.map((_, index) => data.media_positions[index] || 0),
                media_captions: files.map((_, index) => data.media_captions[index] || null),
            });
        }
    };

    const handlePositionChange = (index: number, value: string) => {
        const positions = [...data.media_positions];
        positions[index] = parseInt(value) || 0;
        setData('media_positions', positions);
    };

    const handleCaptionChange = (index: number, value: string) => {
        const captions = [...data.media_captions];
        captions[index] = value || null;
        setData('media_captions', captions);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => reset(),
            preserveState: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Create Post" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl p-4">
                <form
                    onSubmit={submit}
                    className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col gap-10 rounded-xl border bg-white p-6 dark:bg-neutral-800"
                >
                    <h1 className="text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">Create a New Post</h1>

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
                        <label htmlFor="body" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Body
                        </label>
                        <textarea
                            id="body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            className="border-sidebar-border/70 dark:border-sidebar-border min-h-[200px] rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                            placeholder="Write Your Post Here (Use Double Newlines for Paragraphs)"
                        />
                        {errors.body && <span className="text-sm text-red-500">{errors.body}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="preview_image" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Preview Image
                        </label>
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="preview_image"
                                className="border-sidebar-border/70 dark:border-sidebar-border cursor-pointer rounded-xl border bg-neutral-100 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-500"
                            >
                                Choose File
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
                        {data.preview_image && (
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
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="media" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Additional Media (Images/Videos)
                        </label>
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="media"
                                className="border-sidebar-border/70 dark:border-sidebar-border cursor-pointer rounded-xl border bg-neutral-100 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-500"
                            >
                                Choose Files
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
                    </div>

                    {data.media.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                Media Details (Position: 0 = After First Paragraph, 1 = After Second, etc.)
                            </p>
                            {data.media.map((file, index) => (
                                <div key={index} className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col gap-2 border-t pt-2">
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
                                            onChange={(e) => handlePositionChange(index, e.target.value)}
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
                                            onChange={(e) => handleCaptionChange(index, e.target.value)}
                                            className="border-sidebar-border/70 dark:border-sidebar-border flex-1 rounded-xl border bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                                            placeholder="Enter Caption (Optional)"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:bg-emerald-300 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:disabled:bg-emerald-400"
                        >
                            {processing ? 'Posting...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
