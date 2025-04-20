import { convertEmbedsToYouTubeUrls } from '@/lib/utils';
import { SharedData } from '@/types';
import {
    WysiwigMediaUploadResponse,
    WysiwigTinyMceBlobInfo,
    WysiwigTinyMceProgressFn,
    WysiwigTinyMceUploadHandler,
    WysiwygEditorProps,
} from '@/types/pages/posts/common';
import { usePage } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';

export function WysiwygEditor({ content, onChange }: WysiwygEditorProps) {
    const { csrf } = usePage<SharedData>().props;
    const [uploading, setUploading] = useState<boolean>(false);
    const editorContent = convertEmbedsToYouTubeUrls(content);

    const handleMediaUpload: WysiwigTinyMceUploadHandler = async (blobInfo: WysiwigTinyMceBlobInfo, progress: WysiwigTinyMceProgressFn) => {
        setUploading(true);
        try {
            const file = blobInfo.blob();
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File size exceeds 10MB limit.');
            }
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                throw new Error('Only JPEG, PNG, and GIF are supported.');
            }

            const formData = new FormData();
            formData.append('file', file, blobInfo.filename());

            const response = await uploadFile(formData, progress);

            if (!response.ok) {
                throw new Error('Upload failed.');
            }

            const { url } = (await response.json()) as WysiwigMediaUploadResponse;
            return url;
        } catch (error) {
            throw new Error(`Upload error: ${(error as Error).message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleFilePicker = async (callback: (value: string, meta: Record<string, string>) => void): Promise<void> => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/jpeg,image/png,image/gif');

        input.onchange = async () => {
            if (!input.files || input.files.length === 0) return;
            setUploading(true);
            try {
                const file = input.files[0];
                if (file.size > 10 * 1024 * 1024) {
                    throw new Error('File size exceeds 10MB limit.');
                }
                if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                    throw new Error('Only JPEG, PNG, and GIF are supported.');
                }

                const formData = new FormData();
                formData.append('file', file, file.name);

                const response = await uploadFile(formData);

                if (!response.ok) {
                    throw new Error('Upload failed.');
                }

                const { url } = (await response.json()) as WysiwigMediaUploadResponse;
                callback(url, { title: file.name });
            } catch (error) {
                alert(`Upload error: ${(error as Error).message}`);
            } finally {
                setUploading(false);
            }
        };

        input.click();
    };

    const uploadFile = (formData: FormData, progress?: WysiwigTinyMceProgressFn): Promise<Response> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', route('media.upload'), true);

            xhr.setRequestHeader('X-CSRF-TOKEN', csrf);

            if (progress) {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        progress(percent);
                    }
                };
            }

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(new Response(xhr.response, { status: xhr.status, statusText: xhr.statusText }));
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.onabort = () => reject(new Error('Upload aborted'));

            xhr.send(formData);
        });
    };

    return (
        <div className="rounded-lg border border-neutral-300 p-3 dark:border-neutral-700">
            <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                value={editorContent}
                onEditorChange={onChange}
                init={{
                    license_key: 'gpl',
                    plugins: 'image link',
                    toolbar: 'undo redo | bold italic | blocks | link image',
                    block_formats: 'Paragraph=p;Heading 2=h2;Heading 3=h3',
                    menubar: false,
                    content_style: `
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
                        img { max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        p + img { margin-top: 0.5rem; }
                        h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
                        h3 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.75rem; }
                        p { margin: 1rem 0; }
                    `,
                    paste_data_images: false,
                    images_upload_handler: handleMediaUpload,
                    file_picker_types: 'image',
                    file_picker_callback: handleFilePicker,
                    height: 400,
                    skin: 'oxide',
                    content_css: 'default',
                    automatic_uploads: true,
                    forced_root_block: 'p',
                    valid_elements: 'p,h2,h3,ul,ol,li,a[href|title],strong,em,br,div,img[src|alt|width|height],source[src|type]',
                    extended_valid_elements: 'img[src|alt|width|height|style],source[src|type],h2[style],h3[style],p[style],a[href|title|style],br',
                    image_caption: false,
                    media_alt_source: false,
                    media_poster: false,
                    remove_trailing_brs: false,
                    newline_behavior: 'linebreak',
                    convert_urls: false,
                    setup: (editor) => {
                        editor.on('BeforeSetContent', (e) => {
                            e.content = convertEmbedsToYouTubeUrls(e.content);
                        });
                    },
                }}
            />
            {uploading && <p className="mt-2 text-sm text-neutral-600">Uploading media...</p>}
        </div>
    );
}
