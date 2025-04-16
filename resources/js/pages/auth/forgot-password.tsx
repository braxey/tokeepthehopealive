import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Forgot Password" description="Enter your email to receive a password reset link.">
            <Head title="Forgot Password" />

            {status && <div className="mb-6 text-center text-sm font-medium text-emerald-600 dark:text-emerald-500">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit} className="flex w-full flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            disabled={processing}
                            className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                        />
                        <InputError message={errors.email} className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full cursor-pointer rounded-lg bg-emerald-600 text-white shadow-md hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Email Password Reset Link
                    </Button>
                </form>

                <div className="text-center text-sm text-neutral-700 dark:text-neutral-300">
                    Or, return to{' '}
                    <TextLink
                        href={route('login')}
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                    >
                        Log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
