import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify Email" description="Please verify your email address by clicking the link we just emailed to you.">
            <Head title="Email Verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-center text-sm font-medium text-emerald-600 dark:text-emerald-500">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit} className="flex w-full flex-col gap-6 text-center">
                <Button
                    type="submit"
                    className="w-full rounded-lg bg-emerald-600 text-white shadow-md hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Resend Verification Email
                </Button>

                <TextLink
                    href={route('logout')}
                    method="post"
                    className="mx-auto block text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                >
                    Log Out
                </TextLink>
            </form>
        </AuthLayout>
    );
}
