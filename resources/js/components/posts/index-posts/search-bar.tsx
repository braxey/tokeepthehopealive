import { Input } from '@/components/ui/input';
import { PostIndexSearchBarProps } from '@/types/pages/posts';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function SearchBar({ query, showSearchBar, setShowSearchBar }: PostIndexSearchBarProps) {
    const [searchBarActive, setSearchBarActive] = useState<boolean>(query.search.length > 0);
    const [searchQuery, setSearchQuery] = useState<string>(query.search || '');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (showSearchBar) {
            searchInputRef.current?.focus();
        }
    }, [showSearchBar]);

    return (
        <div className="relative">
            <Input
                ref={searchInputRef}
                autoFocus={searchBarActive}
                onFocus={() => setSearchBarActive(true)}
                onBlur={() => setSearchBarActive(false)}
                type="text"
                placeholder="Search..."
                className={
                    'h-9 w-60 rounded-md border-neutral-200 pr-4 pl-10 transition-colors focus:border-green-500 focus:outline-none [&:focus]:border-green-500 ' +
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
                        router.get(
                            '/posts',
                            { search: value, order: query.order, filter: query.filter, page: 1 },
                            { preserveState: false, replace: true },
                        );
                    }, 500);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        router.get(
                            '/posts',
                            { search: searchQuery, order: query.order, filter: query.filter, page: 1 },
                            { preserveState: false, replace: true },
                        );
                    }
                }}
            />
            <Search
                className="absolute top-4/9 left-3 h-4 w-4 -translate-y-1/2 cursor-pointer text-neutral-500"
                onClick={() => {
                    const shouldShow = !showSearchBar;
                    setSearchQuery('');
                    setShowSearchBar(shouldShow);

                    if (!shouldShow) {
                        router.get(
                            '/posts',
                            { search: '', order: query.order, filter: query.filter, page: 1 },
                            { preserveState: false, replace: true },
                        );
                    }
                }}
            />
        </div>
    );
}
