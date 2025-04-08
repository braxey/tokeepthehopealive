import { Input } from '@/components/ui/input';
import { PostIndexSearchBarProps } from '@/types/pages/index-posts';
import { router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function SearchBar({ search }: PostIndexSearchBarProps) {
    const searchInputRef = useRef(null);
    const [showSearchBar, setShowSearchBar] = useState<boolean>(search.length > 0);
    const [searchQuery, setSearchQuery] = useState<string>(search || '');

    useEffect(() => {
        if (searchInputRef !== null && search.length > 0) {
            searchInputRef.current.focus();
        }
    }, [search]);

    return (
        <div className="relative">
            <Input
                type="text"
                ref={searchInputRef}
                placeholder="Search..."
                className={
                    'h-9 w-64 rounded-md border-neutral-200 pr-4 pl-10 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:outline-none [&:focus]:border-green-500 [&:focus]:ring-green-500 ' +
                    (!showSearchBar && 'hidden')
                }
                value={searchQuery}
                onChange={(e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    debounce((query) => {
                        router.get('/posts', { search: query, page: 1 }, { preserveState: false, replace: true });
                    }, 500)(q);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        router.get('/posts', { search: searchQuery, page: 1 }, { preserveState: false, replace: true });
                    }
                }}
            />
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" onClick={() => setShowSearchBar(!showSearchBar)} />
        </div>
    );
}
