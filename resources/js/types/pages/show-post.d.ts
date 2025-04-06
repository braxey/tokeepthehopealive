import { Comment, Post } from '@/types/models';

export type Comment_ShowPost = Comment & {
    user: User;
    time_since: string;
    user_vote: number | null;
    [key: string]: unknown;
};

export type Comment_ShowPost_Dto = {
    replies: Comment_ShowPost[];
    current_page: number;
    has_more: boolean;
};

export type ShowPostProps = {
    post: Post;
    comments: {
        post: Comment_ShowPost_Dto;
    };
};

export type ShowPostPreviewProps = {
    post: Post;
};

export type ShowPostContentProps = {
    post: Post;
};

export type ShowPostPreviewAndContentProps = {
    post: Post;
};

export type Comment_State_ShowPost = {
    show_reply_form: boolean;
    show_comments: boolean;
    dto: Comment_ShowPost_Dto;
};

export type Comment_States_ShowPost = {
    [key: string]: Comment_State_ShowPost;
};

export type ShowPostCommentSectionProps = ShowPostProps;

export type ShowPostTopLevelCommentProps = {
    comment: Comment_ShowPost;
};

export type ShowPostNestedCommentProps = {
    comment: Comment_ShowPost;
    topLevelCommentId: number;
    loadCommentsAfterReply: () => void;
};
