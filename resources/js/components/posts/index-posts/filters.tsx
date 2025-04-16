import SearchBar from '@/components/posts/index-posts/search-bar';
import { PostIndexFilterProps } from '@/types/pages/posts';
import { useState } from 'react';
import OrderBar from './order-bar';

export function PostFilters({ search, order }: PostIndexFilterProps) {
    const [showSearchBar, setShowSearchBar] = useState<boolean>(search.length > 0);

    return (
        <>
            <div className="hidden w-full flex-row justify-between md:flex">
                <SearchBar search={search} order={order} showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} />
                <OrderBar search={search} order={order} />
            </div>

            <div className={'flex w-full items-center md:hidden ' + (showSearchBar ? 'flex-col justify-center gap-4' : 'flex-row justify-between')}>
                <SearchBar search={search} order={order} showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} />
                <OrderBar search={search} order={order} />
            </div>
        </>
    );
}
