import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                {/* Top row: brand + social links */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                        CampusShare
                    </span>

                    {/* Join Community */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500 font-medium mr-1">Join our community:</span>

                        {/* GitHub */}
                        <a
                            href="https://github.com/shawandarshan/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-9 w-9 rounded-full border border-neutral-200 hover:border-neutral-400 bg-white flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-all hover:shadow-sm"
                            title="GitHub"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/shawandarshan/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-9 w-9 rounded-full border border-neutral-200 hover:border-blue-400 bg-white flex items-center justify-center text-neutral-600 hover:text-blue-600 transition-all hover:shadow-sm"
                            title="LinkedIn"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>

                        {/* Reddit */}
                        <a
                            href="https://www.reddit.com/user/Shawan_darshan/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-9 w-9 rounded-full border border-neutral-200 hover:border-orange-400 bg-white flex items-center justify-center text-neutral-600 hover:text-orange-500 transition-all hover:shadow-sm"
                            title="Reddit"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-neutral-400">
                        © 2026 CampusShare. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-sm text-neutral-400 hover:text-emerald-600 transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-neutral-200">|</span>
                        <Link href="/terms" className="text-sm text-neutral-400 hover:text-emerald-600 transition-colors">
                            Terms and Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
