import { Post } from '@/types/models';

export interface PostFormProps {
    post?: Post;
    title: string;
    summary: string;
    previewImage: File | string | null;
    previewCaption: string;
    body: string;
    setValue: (key: string, value: string | File) => void;
    submitForm: () => void;
    processing: boolean;
}

export interface WysiwygEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export interface WysiwigMediaUploadResponse {
    [url: string]: string;
}

export interface WysiwigTinyMceBlobInfo {
    id: () => string;
    name: () => string;
    filename: () => string;
    blob: () => Blob;
    base64: () => string;
    blobUri: () => string;
    uri: () => string | undefined;
}

export type WysiwigTinyMceProgressFn = (percent: number) => void;

export type WysiwigTinyMceUploadHandler = (blobInfo: WysiwigTinyMceBlobInfo, progress: WysiwigTinyMceProgressFn) => Promise<string>;

export interface WysiwigTinyMceMediaMeta {
    [filetype: string]: string;
}

export type FilePickerCallback = (
    callback: (value: string, meta?: WysiwigTinyMceMediaMeta) => void,
    value: string,
    meta: WysiwigTinyMceMediaMeta,
) => void;

export interface WysiwigTinyMceVideoData {
    source: string;
    sourcemime: string;
}
