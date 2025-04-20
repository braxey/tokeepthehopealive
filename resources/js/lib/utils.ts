import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertEmbedsToYouTubeUrls(content: string): string {
    const embedRegex = /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)"[^>]*>(?:<\/iframe>)?/gi;

    return content.replace(embedRegex, (_, videoId) => {
        return `<p>https://www.youtube.com/watch?v=${videoId}</p>`;
    });
}

export function convertYouTubeUrlsToEmbeds(content: string): string {
    const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/gi;

    return content.replace(youtubeRegex, (_, videoId) => {
        return `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
    });
}
