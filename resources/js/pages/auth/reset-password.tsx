import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Reset Password" description="Please enter your new password below.">
            <Head title="Reset Password" />

            <form onSubmit={submit} className="flex w-full flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                            className="rounded-lg border border-neutral-300 bg-neutral-100 p-3 text-neutral-900 placeholder-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                        />
                        <InputError message={errors.email} className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            disabled={processing}
                            className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                        />
                        <InputError message={errors.password} className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Confirm password"
                            disabled={processing}
                            className="rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-600/20"
                        />
                        <InputError message={errors.password_confirmation} className="mt-1 text-sm text-red-600 dark:text-red-400" />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full rounded-lg bg-emerald-600 text-white shadow-md hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
