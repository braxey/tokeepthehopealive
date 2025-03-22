export interface Post {
    id: number;
    title: string;
    summary: string;
    body: { [key: string]: string }[];
    vote_count: number;
    preview_image: string | null;
    preview_caption: string | null;
    media: Media[];
}

export interface Media {
    id: number;
    path: string;
    type: string;
    url: string;
    position: number;
    caption: string | null;
}

export type Comment = {
    id: number;
    body: string;
    user: { name: string };
    vote_count: number;
};
