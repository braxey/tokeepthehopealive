export interface DeletePostProps {
    postId: number;
    deleting: boolean;
    processing: boolean;
    setDeleting: (deleting: boolean) => void;
}
