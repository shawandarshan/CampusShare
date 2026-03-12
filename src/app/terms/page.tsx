export default function TermsAndConditions() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-4xl font-bold text-foreground mb-2">Terms and Conditions</h1>
            <p className="text-sm text-muted-foreground mb-10">Last updated: March 2026</p>

            <div className="prose prose-neutral max-w-none space-y-8 text-foreground">

                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        By accessing or using <strong>CampusShare</strong>, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Who Can Use CampusShare</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        CampusShare is intended for use by students and faculty of registered educational institutions. By creating an account, you confirm that you are currently enrolled or employed at a recognized college or university.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        <li>You are responsible for ensuring the accuracy of any item listing you post.</li>
                        <li>You must not list stolen, illegal, or prohibited items.</li>
                        <li>You agree to honor borrow/exchange requests that you accept.</li>
                        <li>You are responsible for the safe return of any borrowed item within the agreed availability period.</li>
                        <li>You must not misuse another user's contact information shared through the platform.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Prohibited Conduct</h2>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        <li>Posting false or misleading item descriptions or images.</li>
                        <li>Harassing, threatening, or abusing other users.</li>
                        <li>Attempting to circumvent the platform to conduct transactions outside CampusShare.</li>
                        <li>Using automated bots or scripts to access the platform.</li>
                        <li>Listing or requesting the exchange of alcohol, drugs, weapons, or any illegal goods.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5. Item Transactions</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        CampusShare is a peer-to-peer sharing platform. We facilitate connections between users but are not a party to any transaction. We are not responsible for disputes between users regarding item condition, availability, or return. Users are encouraged to resolve disputes amicably.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">6. Intellectual Property</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        All content on CampusShare — including the logo, design, and code — is the property of CampusShare and its contributors. You may not reproduce or distribute any part of the platform without prior written permission.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        CampusShare is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including damages related to item loss, theft, or damage.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">8. Account Termination</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We reserve the right to suspend or terminate any account that violates these Terms and Conditions, with or without prior notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We may update these Terms and Conditions at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        For any questions about these Terms, reach out via:{" "}
                        <a href="https://www.linkedin.com/in/shawandarshan/" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">
                            linkedin.com/in/shawandarshan
                        </a>
                    </p>
                </section>

            </div>
        </div>
    );
}
