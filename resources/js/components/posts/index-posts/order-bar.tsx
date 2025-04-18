import { PostOrder } from '@/constants/posts';
import { cn } from '@/lib/utils';
import { PostIndexOrderProps, PostIndexOrderTab } from '@/types/pages/posts';
import { router } from '@inertiajs/react';

export default function OrderBar({ query }: PostIndexOrderProps) {
    const tabs: PostIndexOrderTab[] = [
        {
            title: 'Recent',
            value: PostOrder.RECENT,
        },
        {
            title: 'Popular',
            value: PostOrder.POPULAR,
        },
        {
            title: 'Oldest',
            value: PostOrder.OLDEST,
        },
    ];

    return (
        <div className="inline-flex grow-0 gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            {tabs.map(({ title, value }) => (
                <button
                    key={title}
                    onClick={() =>
                        router.get(
                            '/posts',
                            { search: query.search, order: value, filter: query.filter, page: 1 },
                            { preserveState: false, replace: true },
                        )
                    }
                    className={cn(
                        'flex cursor-pointer items-center rounded-md px-3.5 py-1.5 transition-colors',
                        value === query.order
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <span className="text-sm">{title}</span>
                </button>
            ))}
        </div>
    );
}
