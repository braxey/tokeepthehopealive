import { Input } from '@/components/ui/input';
import { PostIndexSearchBarProps } from '@/types/pages/posts';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useRef, useState } from 'react';

export default function SearchBar({ search, order, showSearchBar, setShowSearchBar }: PostIndexSearchBarProps) {
    const [searchBarActive, setSearchBarActive] = useState<boolean>(search.length > 0);
    const [searchQuery, setSearchQuery] = useState<string>(search || '');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return (
        <div className="relative">
            <Input
                autoFocus={searchBarActive}
                onFocus={() => setSearchBarActive(true)}
                onBlur={() => setSearchBarActive(false)}
                type="text"
                placeholder="Search..."
                className={
                    'h-9 w-64 rounded-md border-neutral-200 pr-4 pl-10 transition-colors focus:border-green-500 focus:outline-none [&:focus]:border-green-500 ' +
                    (!showSearchBar && 'hidden')
                }
                value={searchQuery}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);

                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                        router.get('/posts', { search: value, order: order, page: 1 }, { preserveState: false, replace: true });
                    }, 500);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        router.get('/posts', { search: searchQuery, order: order, page: 1 }, { preserveState: false, replace: true });
                    }
                }}
            />
            <Search
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 cursor-pointer text-neutral-500"
                onClick={() => {
                    const shouldShow = !showSearchBar;
                    setSearchQuery('');
                    setShowSearchBar(shouldShow);

                    if (!shouldShow) {
                        router.get('/posts', { search: '', order: order, page: 1 }, { preserveState: false, replace: true });
                    }
                }}
            />
        </div>
    );
}
