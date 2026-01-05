import Link from 'next/link';
import { Twitter, Github, Linkedin, Facebook, Heart } from 'lucide-react';
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
                { name: 'PNG to PDF', href: '/convert/png-to-pdf' },
                { name: 'PNG to ICO', href: '/convert/png-to-ico' },
            ]
        },
        {
            title: 'JPG Tools',
            links: [
                { name: 'JPG to PNG', href: '/convert/jpg-to-png' },
                { name: 'JPG to WebP', href: '/convert/jpg-to-webp' },
                { name: 'JPG to PDF', href: '/convert/jpg-to-pdf' },
            ]
        },
        {
            title: 'JPEG Tools',
            links: [
                { name: 'JPEG to PNG', href: '/convert/jpeg-to-png' },
                { name: 'JPEG to WebP', href: '/convert/jpeg-to-webp' },
                { name: 'JPEG to PDF', href: '/convert/jpeg-to-pdf' },
            ]
        },
        {
            title: 'WebP Tools',
            links: [
                { name: 'WebP to PNG', href: '/convert/webp-to-png' },
                { name: 'WebP to JPG', href: '/convert/webp-to-jpg' },
                { name: 'WebP to SVG', href: '/convert/webp-to-svg' },
            ]
        },
        {
            title: 'SVG Tools',
            links: [
                { name: 'SVG to PNG', href: '/convert/svg-to-png' },
                { name: 'SVG to JPG', href: '/convert/svg-to-jpg' },
                { name: 'SVG to PDF', href: '/convert/svg-to-pdf' },
                { name: 'Any to SVG', href: '/convert/any-to-svg' },
                { name: 'SVG Viewer', href: '/tools/svg-viewer' },
                { name: 'SVG Color Changer', href: '/tools/svg-color-changer' },
                { name: 'Text to SVG', href: '/tools/text-to-svg' },
            ]
        },
        {
            title: 'Image Editing',
            links: [
                { name: 'Image Compressor', href: '/tools/image-compressor' },
                { name: 'Image Resizer', href: '/tools/resizer' },
                { name: 'Image Cropper', href: '/tools/image-cropper' },
                { name: 'Background Remover', href: '/tools/background-remover' },
                { name: 'Color Picker', href: '/tools/color-picker' },
            ]
        },
        {
            title: 'Video Tools',
            links: [
                { name: 'Video Compressor', href: '/tools/video-compressor' },
                { name: 'Video Enhancer', href: '/tools/video-enhancer' },
                { name: 'Video Speed', href: '/tools/video-speed' },
                { name: 'GIF to MP4', href: '/convert/gif-to-mp4' },
                { name: 'MP4 to GIF', href: '/convert/mp4-to-gif' },
            ]
        },
        {
            title: 'PDF Tools',
            links: [
                { name: 'PDF Compressor', href: '/tools/pdf-compressor' },
                { name: 'PDF Merger', href: '/tools/pdf-merger' },
            ]
        },
        {
            title: 'Code Tools',
            links: [
                { name: 'JSON Formatter', href: '/tools/json-formatter' },
                { name: 'Diff Checker', href: '/tools/diff-checker' },
                { name: 'HTML Minifier', href: '/tools/html-minifier' },
                { name: 'CSS Minifier', href: '/tools/css-minifier' },
                { name: 'Base64 Encoder', href: '/tools/base64' },
            ]
        },
        {
            title: 'Text & Utils',
            links: [
                { name: 'Word Counter', href: '/tools/word-counter' },
                { name: 'Case Converter', href: '/tools/case-converter' },
                { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum' },
                { name: 'QR Generator', href: '/tools/qr-generator' },
                { name: 'Barcode Gen', href: '/tools/barcode-generator' },
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Contact Us', href: '/contact' }
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
                        <p className="text-zinc-500 max-w-sm leading-relaxed text-sm font-medium">
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

                    <div className="w-full lg:w-3/4 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                        {footerSections.map((section) => (
                            <div key={section.title} className="space-y-6">
                                <h3 className="text-white font-bold text-xs uppercase tracking-widest">{section.title}</h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="text-zinc-500 hover:text-blue-400 transition-colors text-sm font-medium hover:pl-1 block">
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
                    <p className="text-zinc-600 text-xs font-semibold uppercase tracking-wider">
                        © {years} ToolsHub. All rights reserved.
                    </p>

                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                        Developed by Zrubix Solutions Pvt Ltd
                    </p>

                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                        Made by <Heart size={14} className="text-rose-500 fill-rose-500" /> Gowtham
                    </div>
                </div>
            </div>
        </footer>
    );
}
