import { Button } from '@/components/ui/button';
import { PostIndexLoadMoreButtonProps } from '@/types/pages/index-posts';

export default function LoadMoreButton({ handleLoadMore }: PostIndexLoadMoreButtonProps) {
    return (
        <div className="mt-6 flex justify-center">
            <Button
                key={`load-more`}
                onClick={handleLoadMore}
                className="cursor-pointer rounded-lg bg-emerald-100 px-6 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900"
            >
                Load More
            </Button>
        </div>
    );
}
