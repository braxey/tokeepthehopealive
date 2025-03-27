import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log In to Your Account" description="Enter your email and password to access your account.">
            <Head title="Log In" />

            <form className="flex w-full flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            disabled={processing}
                            className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                        />
                        <InputError message={errors.email} className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="ml-auto text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            disabled={processing}
                            className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                        />
                        <InputError message={errors.password} className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="border-neutral-300 dark:border-neutral-700"
                        />
                        <Label htmlFor="remember" className="text-sm text-neutral-700 dark:text-neutral-300">
                            Remember me
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full rounded-lg bg-emerald-600 text-white shadow-md hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Log In
                    </Button>
                </div>

                <div className="text-center text-sm text-neutral-700 dark:text-neutral-300">
                    Don’t have an account?{' '}
                    <TextLink
                        href={route('register')}
                        tabIndex={5}
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                    >
                        Sign up
                    </TextLink>
                </div>

                {status && <div className="mt-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-500">{status}</div>}
            </form>
        </AuthLayout>
    );
}
