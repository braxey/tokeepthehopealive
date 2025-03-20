import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Media {
    id: number;
    path: string;
    type: string;
    url: string;
    position: number;
}

export interface Post {
    id: number;
    title: string;
    body: string;
    vote_count: number;
    preview_image: string | null;
    first_paragraph?: string;
    media: Media[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    canPost?: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    hasVerifiedEmail: boolean;
    [key: string]: unknown;
}

export interface PageProps<T = {}> {
    auth: {
        user: User | null;
    };
    canPost?: boolean;
    featured?: Post | null;
    posts?: {
        data: Post[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    [key: string]: any;
}
