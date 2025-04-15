import { Post } from '@/types/models';

export interface EditPostProps {
    post: Post;
}

export interface DeletePostProps {
    postId: number;
    deleting: boolean;
    processing: boolean;
    setDeleting: (deleting: boolean) => void;
}
