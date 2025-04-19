import SearchBar from '@/components/posts/index-posts/search-bar';
import { SharedData } from '@/types';
import { PostIndexFilterProps } from '@/types/pages/posts';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import FilterBar from './filter-bar';
import OrderBar from './order-bar';

export function PostFilters({ query }: PostIndexFilterProps) {
    const { auth } = usePage<SharedData>().props;
    const [showSearchBar, setShowSearchBar] = useState<boolean>(query.search.length > 0);

    return (
        <>
            <div className="hidden w-full flex-row justify-between gap-2 md:flex">
                <SearchBar query={query} showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} />

                <div className="flex w-60 flex-row items-center justify-end gap-2">
                    <OrderBar query={query} />
                    {auth.can_post && <FilterBar query={query} />}
                </div>
            </div>

            <div
                className={
                    'flex w-full flex-row flex-wrap md:hidden ' +
                    (showSearchBar ? 'items-start justify-center gap-4' : 'items-center justify-between')
                }
            >
                <SearchBar query={query} showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} />

                <div className={'flex w-60 flex-col items-center justify-center gap-4'}>
                    <OrderBar query={query} />
                    {auth.can_post && <FilterBar query={query} />}
                </div>
            </div>
        </>
    );
}
