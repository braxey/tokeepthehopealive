export interface Post {
    id: number;
    user_id: number;
    title: string;
    summary: string;
    body: { [key: string]: string }[];
    vote_count: number;
    user_vote: number | null;
    preview_image: string;
    preview_caption: string | null;
    media: Media[];
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
