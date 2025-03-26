export interface Post {
    id: number;
    title: string;
    summary: string;
    body: { [key: string]: string }[];
    vote_count?: number;
    user_vote?: number | null;
    preview_image: string | null;
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
    body: string;
    user: User;
    vote_count: number;
    time_since: string;
    user_vote?: number | null;
    created_at: string;
    [key: string]: unknown;
};
