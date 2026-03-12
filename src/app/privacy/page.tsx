export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-10">Last updated: March 2026</p>

            <div className="prose prose-neutral max-w-none space-y-8 text-foreground">

                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Welcome to <strong>CampusShare</strong>. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        <li><strong>Account Information:</strong> Name, email address, and profile picture when you sign up.</li>
                        <li><strong>Item Listings:</strong> Item details, images, category, and availability that you submit.</li>
                        <li><strong>Request Data:</strong> Borrow/exchange requests including your contact details (college, department, year, phone number) that you provide.</li>
                        <li><strong>Usage Data:</strong> Pages visited, actions taken, and time spent on the platform.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        <li>To operate and improve the CampusShare platform.</li>
                        <li>To facilitate resource sharing and borrowing between students.</li>
                        <li>To send notifications about requests for your listed items.</li>
                        <li>To verify your identity and prevent fraudulent activity.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Information Sharing</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We do not sell your personal data to third parties. Your contact information (such as phone number) is only shared with other users when you initiate or accept a borrow/exchange request. We use trusted third-party services including Firebase, Supabase, and Cloudinary to operate our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us through our GitHub or LinkedIn profiles.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We may update this Privacy Policy from time to time. We will notify users of any significant changes by posting a notice on our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about this Privacy Policy, you can reach us at:{" "}
                        <a href="https://github.com/shawandarshan" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">
                            github.com/shawandarshan
                        </a>
                    </p>
                </section>

            </div>
        </div>
    );
}
