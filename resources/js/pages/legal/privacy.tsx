import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <AppLayout>
            <Head title="Privacy Policy" />
            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-6">
                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
                    <h1 className="mb-6 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">Privacy Policy</h1>
                    <div className="prose dark:prose-invert">
                        <p>
                            <strong>Effective Date:</strong> March 26, 2025
                        </p>
                        <p>
                            Keep The Hope Alive (“we,” “us,” or “our”) is a platform provided by Gillyware, LLC. We are committed to protecting your
                            privacy and ensuring your trust as you engage with our app (“the Service”), a place to share and discover testimonies of
                            hope and faith. This Privacy Policy explains how we collect, use, and safeguard your personal data.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">1. Information We Collect</h2>
                        <p>We collect only the data necessary to provide the Service’s functionality, including:</p>
                        <ul>
                            <li>
                                <strong>Identifiers:</strong> Name, email, and password collected during account creation.
                            </li>
                            <li>
                                <strong>Personal Information:</strong> Content you provide, such as testimony text, optional profile details (e.g.,
                                display name), and uploaded media (e.g., profile pictures or images in posts).
                            </li>
                            <li>
                                <strong>Internet or Network Activity:</strong> Technical details like device type, operating system, and app
                                interactions for functionality and troubleshooting.
                            </li>
                            <li>
                                <strong>Session Data:</strong> Cookies used solely for session management and security (e.g., CSRF tokens), not for
                                analytics or third-party tracking.
                            </li>
                        </ul>
                        <p>We do not collect data from third parties or for purposes beyond the Service’s operation.</p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">2. How We Use Your Information</h2>
                        <p>We use your data exclusively to:</p>
                        <ul>
                            <li>Enable the Service’s functionality, such as posting, reading, and managing testimonies.</li>
                            <li>Authenticate users and secure your account.</li>
                            <li>Analyze usage to improve the Service and resolve technical issues.</li>
                        </ul>
                        <p>No data is used for advertising, profiling, or third-party purposes.</p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">3. Data Deletion</h2>
                        <ul>
                            <li>
                                <strong>Posts:</strong> Deleting a post permanently removes its content and associated media.
                            </li>
                            <li>
                                <strong>User Account Deletion:</strong> Deleting your account permanently erases all account data, user-provided
                                content, and uploaded media.
                            </li>
                        </ul>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">4. Data Sharing</h2>
                        <p>
                            We do not sell or share your personal data with third parties for marketing or analytics. Data may be disclosed only to:
                        </p>
                        <ul>
                            <li>
                                <strong>Service Providers:</strong> Hosting providers to operate the Service, under strict confidentiality agreements.
                            </li>
                            <li>
                                <strong>Legal Authorities:</strong> To comply with legal obligations, such as law enforcement requests.
                            </li>
                            <li>
                                <strong>Future Donations:</strong> If donations are enabled, payment processors (e.g., Stripe) will handle transaction
                                data under their privacy policies.
                            </li>
                        </ul>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">5. Data Security</h2>
                        <p>
                            We use industry-standard encryption and protocols to protect your data from unauthorized access. No system is fully
                            secure, so we encourage strong passwords and keeping your credentials confidential.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">6. Children’s Data</h2>
                        <p>
                            The Service is not directed at children under 13. If children’s data is provided (e.g., in testimonies), it is collected
                            solely for the Service’s functionality with parental consent where required by law, and deleted upon request or account
                            removal.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">7. Your Privacy Rights</h2>
                        <p>Under laws like the California Consumer Privacy Act (CCPA), you have the right to:</p>
                        <ul>
                            <li>
                                <strong>Know:</strong> Request details about the personal data we collect and use.
                            </li>
                            <li>
                                <strong>Access:</strong> Obtain a copy of your personal data.
                            </li>
                            <li>
                                <strong>Delete:</strong> Request deletion of your data through account settings or by contacting us.
                            </li>
                            <li>
                                <strong>Opt-Out:</strong> Opt out of data sales. We do not sell data, so no action is needed.
                            </li>
                            <li>
                                <strong>Non-Discrimination:</strong> We will not discriminate against you for exercising these rights.
                            </li>
                        </ul>
                        <p>
                            To exercise these rights, contact us at{' '}
                            <a
                                href="mailto:support@tokeepthehopealive.com"
                                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                            >
                                support@tokeepthehopealive.com
                            </a>
                            . We’ll respond within 45 days, extendable by 45 more if needed, per CCPA rules.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">8. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy as the Service evolves. Changes will be posted in the app, with significant updates
                            notified via email or app alerts.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">9. Contact Us</h2>
                        <p>
                            For questions about this Privacy Policy or your rights, email us at{' '}
                            <a
                                href="mailto:support@tokeepthehopealive.com"
                                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                            >
                                support@tokeepthehopealive.com
                            </a>{' '}
                            or write to Gillyware, LLC.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
