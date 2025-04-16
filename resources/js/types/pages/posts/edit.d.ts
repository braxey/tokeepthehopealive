import { Post } from '@/types/models';

export interface EditPostProps {
    post: Post;
}

export interface ArchivePostProps {
    postId: number;
    disabled: boolean;
    setArchiving: (archiving: boolean) => void;
}

export interface DeletePostProps {
    postId: number;
    disabled: boolean;
    setDeleting: (deleting: boolean) => void;
}
