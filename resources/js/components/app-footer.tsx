import { Link } from '@inertiajs/react';

export function AppFooter() {
    return (
        <footer className="mt-12 w-full border-t border-neutral-200 bg-white p-6 text-center text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
            <div className="mx-auto max-w-4xl">
                <div className="flex justify-center gap-4">
                    <Link href={route('privacy')} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                        Privacy Policy
                    </Link>
                    <Link href={route('terms')} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                        Terms of Service
                    </Link>
                </div>
                <p className="mt-4">© {new Date().getFullYear()} To Keep The Hope Alive. All rights reserved.</p>
            </div>
        </footer>
    );
}
