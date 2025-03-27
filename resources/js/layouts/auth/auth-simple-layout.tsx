import { AppFooter } from '@/components/app-footer';
import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col bg-[#FDFDFC] dark:bg-[#0a0a0a]">
            <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6 lg:p-8">
                <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
                    <div className="flex flex-col items-center gap-6">
                        <Link href={route('home')} className="flex flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <AppLogoIcon className="h-8 w-8 stroke-current text-emerald-600 dark:text-emerald-500" />
                            </div>
                            <span className="sr-only">Keep The Hope Alive</span>
                        </Link>

                        <div className="space-y-3 text-center">
                            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{title}</h1>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">{description}</p>
                        </div>

                        <div className="w-full">{children}</div>
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
