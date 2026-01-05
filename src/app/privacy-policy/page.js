"use client";



export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
            <div className="prose prose-slate lg:prose-xl">
                <p className="text-lg text-slate-600 mb-6">
                    At ToolsHub, we take your privacy seriously. This policy explains how we handle your data when you use our online file converters.
                </p>
                <h2 className="text-2xl font-bold mt-12 mb-4">1. Local Processing</h2>
                <p className="text-slate-500 mb-6">
                    Unlike many other conversion services, ToolsHub processes your files directly in your browser whenever possible. This means your files never leave your computer, ensuring the highest level of privacy and security.
                </p>
                <h2 className="text-2xl font-bold mt-12 mb-4">2. Server-side Conversions</h2>
                <p className="text-slate-500 mb-6">
                    For specialized conversions that require server-side processing, files are uploaded securely, processed, and then automatically deleted within 2 hours of completion.
                </p>
                <h2 className="text-2xl font-bold mt-12 mb-4">3. No Personal Data Collection</h2>
                <p className="text-slate-500 mb-6">
                    We do not require accounts, email addresses, or any personal information to use our free tools. We do not track individual users or sell your data.
                </p>
            </div>
        </div>
    );
}
