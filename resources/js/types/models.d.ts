export interface Post {
    id: number;
    title: string;
    summary: string;
    body: string;
    preview_image_url: string;
    preview_caption: string | null;
    user_id: number;
    vote_count: number;
    reply_count: number;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
    user_vote?: number | null;
}

export interface Media {
    id: number;
    path: string;
    type: string;
    url?: string;
    position: number;
    caption: string | null;
}

export type Comment = {
    id: number;
    user_id: number;
    to_user_id: number;
    commentable_type: 'App\\Models\\Post' | 'App\\Models\\Comment';
    commentable_id: number;
    body: string;
    vote_count: number;
    reply_count: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
