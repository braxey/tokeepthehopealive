import {
    FilePickerCallback,
    WysiwigMediaUploadResponse,
    WysiwigTinyMceBlobInfo,
    WysiwigTinyMceMediaMeta,
    WysiwigTinyMceProgressFn,
    WysiwigTinyMceUploadHandler,
    WysiwigTinyMceVideoData,
    WysiwygEditorProps,
} from '@/types/pages/posts/common';
import { Editor } from '@tinymce/tinymce-react';
import Uppy, { Meta, UploadResult } from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { useMemo, useState } from 'react';

export function WysiwygEditor({ content, onChange }: WysiwygEditorProps) {
    const [uploading, setUploading] = useState<boolean>(false);

    const uppy = useMemo(
        () =>
            new Uppy({
                autoProceed: true,
                restrictions: {
                    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
                    maxFileSize: 2 * 1024 * 1024,
                },
            }).use(XHRUpload, {
                endpoint: route('media.upload'),
                fieldName: 'file',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                limit: 1,
            }),
        [],
    );

    const handleMediaUpload: WysiwigTinyMceUploadHandler = async (blobInfo: WysiwigTinyMceBlobInfo, progress: WysiwigTinyMceProgressFn) => {
        setUploading(true);
        try {
            const file = blobInfo.blob();
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('File size exceeds 2MB limit.');
            }
            if (!['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type)) {
                throw new Error('Only JPEG, PNG, GIF, MP4, and WebM are supported.');
            }

            const result = await new Promise<UploadResult<Meta, Record<string, never>>>((resolve, reject) => {
                uppy.addFile({
                    source: 'tinymce',
                    name: blobInfo.blob.name,
                    type: file.type,
                    data: file,
                });
                uppy.on('upload-progress', (file, prog) => {
                    if (file && prog.bytesTotal && prog.bytesTotal > 0) {
                        const percent = Math.round((prog.bytesUploaded / prog.bytesTotal) * 100);
                        progress(percent);
                    }
                });
                uppy.on('complete', (res) => resolve(res));
                uppy.on('error', (err) => reject(err));
            });

            if (result.successful && result.successful.length > 0) {
                const { url } = result.successful[0].response?.body as WysiwigMediaUploadResponse;
                return url;
            }
            throw new Error('Upload failed.');
        } catch (error) {
            throw new Error(`Upload error: ${(error as Error).message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleFilePicker: FilePickerCallback = async (
        callback: (value: string, meta: Record<string, string>) => void,
        value: string,
        meta: WysiwigTinyMceMediaMeta,
    ): Promise<void> => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', meta.filetype === 'image' ? 'image/jpeg,image/png,image/gif' : 'video/mp4,video/webm');

        input.onchange = async () => {
            if (!input.files || input.files.length === 0) return;
            setUploading(true);
            try {
                const file = input.files[0];
                if (file.size > 2 * 1024 * 1024) {
                    throw new Error('File size exceeds 2MB limit.');
                }
                if (!['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type)) {
                    throw new Error('Only JPEG, PNG, GIF, MP4, and WebM are supported.');
                }

                const result = await new Promise<UploadResult<Meta, Record<string, never>>>((resolve, reject) => {
                    uppy.addFile({
                        source: 'file-picker',
                        name: file.name,
                        type: file.type,
                        data: file,
                    });
                    uppy.on('complete', (res) => resolve(res));
                    uppy.on('error', (err) => reject(err));
                });

                if (result.successful && result.successful.length > 0) {
                    const { url } = result.successful[0].response?.body as WysiwigMediaUploadResponse;
                    callback(url, { title: file.name });
                } else {
                    throw new Error('Upload failed.');
                }
            } catch (error) {
                alert(`Upload error: ${(error as Error).message}`);
            } finally {
                setUploading(false);
            }
        };

        input.click();
    };

    return (
        <div className="rounded-lg border border-neutral-300 p-3 dark:border-neutral-700">
            <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                value={content}
                onEditorChange={onChange}
                init={{
                    plugins: 'image media link',
                    toolbar: 'undo redo | bold italic | blocks | link image media',
                    block_formats: 'Paragraph=p;Heading 2=h2;Heading 3=h3',
                    menubar: false,
                    content_style: `
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
            img, video { max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            p + img, p + video { margin-top: 0.5rem; }
            h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
            h3 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.75rem; }
            p { margin: 1rem 0; }
          `,
                    paste_data_images: false,
                    images_upload_handler: handleMediaUpload,
                    file_picker_types: 'image media',
                    file_picker_callback: handleFilePicker,
                    height: 400,
                    skin: 'oxide',
                    content_css: 'default',
                    automatic_uploads: true,
                    video_template_callback: (data: WysiwigTinyMceVideoData) => {
                        return `<video controls><source src="${data.source}" type="${data.sourcemime}"></video>`;
                    },
                    forced_root_block: 'p',
                    valid_elements: 'p,h2,h3,ul,ol,li,a[href|title],strong,em,br,div,img[src|alt|width|height],video[controls],source[src|type]',
                    extended_valid_elements:
                        'img[src|alt|width|height|style],video[controls|style],source[src|type],h2[style],h3[style],p[style],a[href|title|style],br',
                    image_caption: false,
                    media_alt_source: false,
                    media_poster: false,
                    remove_trailing_brs: false,
                    newline_behavior: 'linebreak',
                    convert_urls: false,
                }}
            />
            {uploading && <p className="mt-2 text-sm text-neutral-600">Uploading media...</p>}
        </div>
    );
}
