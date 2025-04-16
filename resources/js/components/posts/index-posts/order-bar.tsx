import { cn } from '@/lib/utils';
import { PostIndexOrderProps, PostIndexOrderTab } from '@/types/pages/posts';
import { router } from '@inertiajs/react';

export default function OrderBar({ search, order }: PostIndexOrderProps) {
    const tabs: PostIndexOrderTab[] = [
        {
            title: 'Recent',
            value: 'recent',
        },
        {
            title: 'Popular',
            value: 'popular',
        },
        {
            title: 'Oldest',
            value: 'oldest',
        },
    ];

    return (
        <div className="inline-flex grow-0 gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            {tabs.map(({ title, value }) => (
                <button
                    key={title}
                    onClick={() => router.get('/posts', { search: search, order: value, page: 1 }, { preserveState: false, replace: true })}
                    className={cn(
                        'flex cursor-pointer items-center rounded-md px-3.5 py-1.5 transition-colors',
                        value === order
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <span className="ml-1.5 text-sm">{title}</span>
                </button>
            ))}
        </div>
    );
}
