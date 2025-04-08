import FeaturedPostDesktop from '@/components/posts/index-posts/featured-post-desktop';
import FeaturedPostMobile from '@/components/posts/index-posts/featured-post-mobile';
import { PostIndexFeaturedPostProps } from '@/types/pages/index-posts';

export default function FeaturedPost({ featured }: PostIndexFeaturedPostProps) {
    return (
        <div className="rounded-lg bg-white shadow-lg dark:bg-neutral-900">
            {/* Desktop Layout */}
            <FeaturedPostDesktop featured={featured} />

            {/* Mobile Layout */}
            <FeaturedPostMobile featured={featured} />
        </div>
    );
}
