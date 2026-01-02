import Link from 'next/link';
import { Twitter, Github, Linkedin, Facebook, Heart, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
    const years = new Date().getFullYear();

    const footerSections = [
        {
            title: 'PNG Tools',
            links: [
                { name: 'PNG to JPG', href: '/convert/png-to-jpg' },
                { name: 'PNG to WebP', href: '/convert/png-to-webp' },
                { name: 'PNG to SVG', href: '/convert/png-to-svg' },
                { name: 'PNG to PDF', href: '/convert/png-to-pdf' }
            ]
        },
        {
            title: 'JPEG Tools',
            links: [
                { name: 'JPEG to WebP', href: '/convert/jpeg-to-webp' },
                { name: 'JPEG to PDF', href: '/convert/jpeg-to-pdf' },
                { name: 'JPEG to PNG', href: '/convert/jpeg-to-png' },
            ]
        },
        {
            title: 'JPG Tools',
            links: [
                { name: 'JPG to PNG', href: '/convert/jpg-to-png' },
                { name: 'JPG to WebP', href: '/convert/jpg-to-webp' },
            ]
        },
        {
            title: 'WebP Tools',
            links: [
                { name: 'WebP to PNG', href: '/convert/webp-to-png' },
                { name: 'WebP to JPEG', href: '/convert/webp-to-jpeg' },
                { name: 'WebP to JPG', href: '/convert/webp-to-jpg' },
                { name: 'WebP to SVG', href: '/convert/webp-to-svg' }
            ]
        },
        {
            title: 'SVG Tools',
            links: [
                { name: 'SVG to PNG', href: '/convert/svg-to-png' },
                { name: 'SVG to JPG', href: '/convert/svg-to-jpg' },
                { name: 'Any to SVG', href: '/convert/any-to-svg' },
            ]
        },
        {
            title: 'More Tools',
            links: [
                { name: 'GIF to MP4', href: '/convert/gif-to-mp4' },
                { name: 'Image Resizer', href: '/tools/resizer' },
                { name: 'PDF Compressor', href: '/tools/pdf-compressor' },
                { name: 'QR Generator', href: '/tools/qr-generator' }
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms', href: '/terms' }
            ]
        }
    ];

    return (
        <footer className="pt-24 pb-12 bg-black border-t border-white/10 relative z-10">
            <div className="max-w-[1500px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 mb-20">
                    <div className="w-full lg:w-1/4 space-y-6">
                        <div className="flex items-center gap-2">
                            <Logo />
                        </div>
                        <p className="text-zinc-400 max-w-sm leading-relaxed text-sm font-medium">
                            Professional file conversion suite running locally in your browser.
                            Secure, fast, and free forever.
                        </p>
                        <div className="flex gap-3">
                            {[Twitter, Github, Linkedin, Facebook].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/20 transition-all group">
                                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-3/4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-12">
                        {footerSections.map((section) => (
                            <div key={section.title} className="space-y-6">
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider">{section.title}</h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="text-zinc-500 hover:text-white transition-colors text-sm font-medium hover:pl-1 block">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                        © {years} ToolsHub. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={14} className="text-emerald-500" /> Secure
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                            <Zap size={14} className="text-blue-500" /> Fast
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
