import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-emerald-600 dark:bg-emerald-500">
                <AppLogoIcon className="size-5 stroke-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold text-neutral-900 dark:text-neutral-100">To Keep The Hope Alive</span>
            </div>
        </>
    );
}
