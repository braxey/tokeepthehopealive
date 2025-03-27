import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to To Keep The Hope Alive" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:p-8 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header with Navigation */}
                <header className="mb-6 w-full max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('posts.index')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm font-medium text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Testimonies
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm font-medium text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm font-medium text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Main Content */}
                <main className="flex w-full max-w-4xl flex-col items-center justify-center text-center lg:grow">
                    <div className="mb-8">
                        <h1 className="text-4xl font-semibold text-[#1b1b18] lg:text-5xl dark:text-[#EDEDEC]">To Keep The Hope Alive</h1>
                        <p className="mt-4 max-w-xl text-lg text-[#706f6c] dark:text-[#A1A09A]">
                            A place to discover testimonies of hope, resilience, and faith. Read stories that inspire and uplift.
                        </p>
                    </div>

                    {/* Call to Action */}
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <Link
                            href={route('posts.index')}
                            className="inline-block rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        >
                            Explore Testimonies
                        </Link>
                        {auth.canPost && (
                            <Link
                                href={route('posts.create')}
                                className="inline-block rounded-lg border border-emerald-600 px-6 py-3 text-base font-medium text-emerald-600 hover:bg-emerald-600/10 dark:border-emerald-500 dark:text-emerald-500 dark:hover:bg-emerald-500/10"
                            >
                                Share a Story
                            </Link>
                        )}
                    </div>

                    {/* Decorative Element */}
                    <div className="mt-12 flex justify-center">
                        <svg
                            className="h-16 w-16 text-emerald-600 dark:text-emerald-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0-4c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 14c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                            />
                        </svg>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-12 w-full max-w-4xl text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    <p>© {new Date().getFullYear()} To Keep The Hope Alive. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
