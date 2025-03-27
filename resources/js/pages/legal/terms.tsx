import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function TermsOfService() {
    return (
        <AppLayout>
            <Head title="Terms of Service" />
            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-6">
                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-900">
                    <h1 className="mb-6 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">Terms of Service</h1>
                    <div className="prose dark:prose-invert">
                        <p>
                            <strong>Effective Date:</strong> March 26, 2025
                        </p>
                        <p>
                            Welcome to Keep The Hope Alive! These Terms of Service ("Terms") govern your access to and use of the Keep The Hope Alive
                            app ("the Service"), a platform provided by Gillyware, LLC ("we," "us," or "our"). By downloading, accessing, or using the
                            Service, you agree to these Terms. If you do not agree, please do not use the Service.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">1. Use of the Service</h2>
                        <ul>
                            <li>
                                <strong>Eligibility:</strong> You must be at least 13 years old to use the Service. If you are under 18, you may only
                                use the Service under the supervision of a parent or legal guardian who agrees to these Terms.
                            </li>
                            <li>
                                <strong>Account Creation:</strong>
                                <ul>
                                    <li>
                                        You are responsible for providing accurate information during account creation, including your name, email,
                                        and password.
                                    </li>
                                    <li>
                                        You are responsible for maintaining the confidentiality of your account credentials and for all activities
                                        that occur under your account.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>License:</strong> We grant you a non-exclusive, non-transferable, revocable license to use the Service for
                                personal, non-commercial purposes, subject to these Terms.
                            </li>
                            <li>
                                <strong>Prohibited Activities:</strong>
                                <ul>
                                    <li>You may not use the Service for any unlawful or unauthorized purpose.</li>
                                    <li>
                                        You may not attempt to access, disrupt, or interfere with the Service’s systems, security, or functionality.
                                    </li>
                                    <li>
                                        You may not post content that is hateful, offensive, or violates the spirit of hope and faith central to the
                                        Service.
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">2. Features and Services</h2>
                        <p>
                            Keep The Hope Alive provides a platform to share and discover testimonies of hope and faith. Features include posting
                            testimonies, managing your profile, and viewing content from others. We may add, modify, or remove features at our
                            discretion, with or without notice. We do not guarantee the availability, accuracy, or permanence of any feature.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">3. Donations</h2>
                        <p>
                            The Service is currently free to use. In the future, we may offer the option to make voluntary donations to support its
                            operation. If implemented:
                        </p>
                        <ul>
                            <li>
                                <strong>Payment Methods:</strong> Donations may be processed via third-party payment processors (e.g., Stripe), with
                                terms displayed at the time of donation.
                            </li>
                            <li>
                                <strong>Charges:</strong> Donations are non-refundable except as required by law or our policy at the time.
                            </li>
                        </ul>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">4. User Content</h2>
                        <p>
                            Content you input into the Service (e.g., testimony text, profile details, uploaded media) is your "User Content." You
                            retain ownership but grant us a worldwide, non-exclusive, royalty-free license to use, store, and display it to provide,
                            maintain, and enhance the Service. You are responsible for ensuring your User Content aligns with the Service’s purpose
                            and for backing it up—we are not liable for its loss.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">5. Privacy and Your Rights</h2>
                        <p>
                            Our collection, use, and management of your data, including User Content, are governed by our Privacy Policy, incorporated
                            into these Terms. You have rights to access, delete, and manage your data as outlined there. We will not penalize you for
                            exercising these rights.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">6. Data Retention and Deletion</h2>
                        <ul>
                            <li>
                                <strong>User Account and Data Deletion:</strong> Deleting your account permanently removes all associated User
                                Content.
                            </li>
                            <li>
                                <strong>Data Backup:</strong> You are responsible for maintaining backups of your data. We are not liable for data
                                loss due to account deletion or Service interruptions.
                            </li>
                        </ul>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">7. Modifications to the Service</h2>
                        <p>
                            We may modify, suspend, or discontinue any part of the Service at any time, with or without notice. We are not liable for
                            any resulting changes or interruptions.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">8. Termination</h2>
                        <ul>
                            <li>
                                <strong>By You:</strong> You may stop using the Service and delete your account via the settings page or by contacting
                                support.
                            </li>
                            <li>
                                <strong>By Us:</strong> We may suspend or terminate your access if you violate these Terms or for any reason at our
                                discretion, without notice.
                            </li>
                        </ul>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">9. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, Gillyware, LLC is not liable for any indirect, incidental, or consequential
                            damages arising from your use of the Service. Our total liability for any claims is limited to the amount you paid us in
                            the past 12 months, if any (currently zero, unless donations are made in the future). This does not limit rights you may
                            have under applicable law.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">10. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold Gillyware, LLC harmless from any claims, liabilities, damages, or expenses arising from
                            your use of the Service or violation of these Terms.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            11. Governing Law and Dispute Resolution
                        </h2>
                        <p>
                            These Terms are governed by the laws of the State of Florida, without regard to its conflict of law principles. Any
                            disputes will be resolved in the state or federal courts of Florida, unless otherwise required by law (e.g., consumer
                            protection statutes).
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">12. Changes to These Terms</h2>
                        <p>
                            We may update these Terms periodically. Material changes will be communicated through the Service or via email. Continued
                            use of the Service after updates constitutes acceptance.
                        </p>

                        <h2 className="mt-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">13. Contact Us</h2>
                        <p>
                            For questions about these Terms, contact us at{' '}
                            <a
                                href="mailto:support@tokeepthehopealive.com"
                                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                            >
                                support@tokeepthehopealive.com
                            </a>{' '}
                            or write to Gillyware, LLC.
                        </p>

                        <p>By using Keep The Hope Alive, you agree to these Terms of Service. Thank you for joining us in sharing hope and faith!</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
