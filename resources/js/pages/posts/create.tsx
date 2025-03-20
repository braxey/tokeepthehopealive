import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormEvent, ChangeEvent } from 'react';

export default function CreatePost() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        preview_image: null as File | null,
        media: [] as File[],
        media_positions: [] as number[],
    });

    const handlePreviewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('preview_image', e.target.files[0]);
        }
    };

    const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setData({
                ...data,
                media: files,
                media_positions: files.map((_, index) => data.media_positions[index] || 0),
            });
        }
    };

    const handlePositionChange = (index: number, value: string) => {
        const positions = [...data.media_positions];
        positions[index] = parseInt(value) || 0;
        setData('media_positions', positions);
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
            <Head title="create post" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={submit} className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col gap-4 rounded-xl border p-6 max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold">create a new post</h1>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-2"
                            placeholder="enter post title"
                        />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="body" className="text-sm font-medium">
                            body
                        </label>
                        <textarea
                            id="body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            className="border-sidebar-border/70 dark:border-sidebar-border min-h-[200px] rounded-xl border p-2"
                            placeholder="write your post here (use double newlines for paragraphs)"
                        />
                        {errors.body && <span className="text-red-500 text-sm">{errors.body}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="preview_image" className="text-sm font-medium">
                            preview image
                        </label>
                        <input
                            id="preview_image"
                            type="file"
                            accept="image/*"
                            onChange={handlePreviewImageChange}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-2"
                        />
                        {errors.preview_image && <span className="text-red-500 text-sm">{errors.preview_image}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="media" className="text-sm font-medium">
                            additional media (images/videos)
                        </label>
                        <input
                            id="media"
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                            onChange={handleMediaChange}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-2"
                        />
                        {errors.media && <span className="text-red-500 text-sm">{errors.media}</span>}
                    </div>

                    {data.media.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium">media positions (0 = before first paragraph, 1 = after first, etc.)</p>
                            {data.media.map((file, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-sm truncate max-w-xs">{file.name}</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.media_positions[index] ?? 0}
                                        onChange={(e) => handlePositionChange(index, e.target.value)}
                                        className="border-sidebar-border/70 dark:border-sidebar-border w-16 rounded-xl border p-1 text-center"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white rounded-xl p-2 hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {processing ? 'posting...' : 'create post'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}