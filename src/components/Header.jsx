"use client";
import Link from 'next/link';
import { ChevronDown, Menu, X, Image as ImageIcon, FileText, Play, Code, ScanLine, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import LoginPopup from './LoginPopup';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeMobileMenu, setActiveMobileMenu] = useState(null);
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'Image Converter',
            icon: <ImageIcon size={20} className="text-blue-500" />,
            width: 'w-[1000px]',
            align: 'left',
            sections: [
                {
                    title: 'PNG Tools',
                    items: [
                        { name: 'PNG to JPG', href: '/convert/png-to-jpg' },
                        { name: 'PNG to WebP', href: '/convert/png-to-webp' },
                        { name: 'PNG to SVG', href: '/convert/png-to-svg' },
                        { name: 'PNG to PDF', href: '/convert/png-to-pdf' },
                        { name: 'PNG to ICO', href: '/convert/png-to-ico' },
                    ]
                },
                {
                    title: 'JPG Tools',
                    items: [
                        { name: 'JPG to PNG', href: '/convert/jpg-to-png' },
                        { name: 'JPG to WebP', href: '/convert/jpg-to-webp' },
                        { name: 'JPG to PDF', href: '/convert/jpg-to-pdf' },
                    ]
                },
                {
                    title: 'JPEG Tools',
                    items: [
                        { name: 'JPEG to PNG', href: '/convert/jpeg-to-png' },
                        { name: 'JPEG to WebP', href: '/convert/jpeg-to-webp' },
                        { name: 'JPEG to PDF', href: '/convert/jpeg-to-pdf' },
                    ]
                },
                {
                    title: 'WebP Tools',
                    items: [
                        { name: 'WebP to PNG', href: '/convert/webp-to-png' },
                        { name: 'WebP to JPG', href: '/convert/webp-to-jpg' },
                        { name: 'WebP to SVG', href: '/convert/webp-to-svg' },
                    ]
                },
                {
                    title: 'SVG & Vectors',
                    items: [
                        { name: 'SVG to PNG', href: '/convert/svg-to-png' },
                        { name: 'SVG to JPG', href: '/convert/svg-to-jpg' },
                        { name: 'SVG to PDF', href: '/convert/svg-to-pdf' },
                        { name: 'Any to SVG (Path)', href: '/convert/any-to-svg' },
                        { name: 'SVG Viewer', href: '/tools/svg-viewer' },
                        { name: 'SVG Color Changer', href: '/tools/svg-color-changer' },
                        { name: 'Text to SVG', href: '/tools/text-to-svg' },
                    ]
                }
            ]
        },
        {
            name: 'Image Editing',
            icon: <ScanLine size={20} className="text-indigo-500" />,
            width: 'w-[300px]',
            sections: [
                {
                    title: 'Modification',
                    items: [
                        { name: 'Canvas Studio', href: '/editing/canvas-studio' },
                        { name: 'Image Compressor', href: '/tools/image-compressor' },
                        { name: 'Image Resizer', href: '/tools/resizer' },
                        { name: 'Image Cropper', href: '/tools/image-cropper' },
                        { name: 'Background Remover', href: '/tools/background-remover' },
                    ]
                }
            ]
        },
        {
            name: 'Video Tools',
            icon: <Play size={20} className="text-rose-500" />,
            width: 'w-[450px]',
            sections: [
                {
                    title: 'Processing',
                    items: [
                        { name: 'Video Compressor', href: '/tools/video-compressor' },
                        { name: 'Video Speed', href: '/tools/video-speed' },
                        { name: 'Video Enhancer', href: '/tools/video-enhancer' },
                    ]
                },
                {
                    title: 'Converter',
                    items: [
                        { name: 'GIF to MP4', href: '/convert/gif-to-mp4' },
                        { name: 'MP4 to GIF', href: '/convert/mp4-to-gif' },
                    ]
                }
            ]
        },
        {
            name: 'PDF Tools',
            icon: <FileText size={20} className="text-red-500" />,
            width: 'w-[400px]',
            sections: [
                {
                    title: 'Management',
                    items: [
                        { name: 'PDF Compressor', href: '/tools/pdf-compressor' },
                        { name: 'PDF Merger', href: '/tools/pdf-merger' },
                    ]
                }
            ]
        },
        {
            name: 'Developer',
            icon: <Code size={20} className="text-violet-500" />,
            width: 'w-[800px]',
            align: 'right',
            sections: [
                {
                    title: 'Code',
                    items: [
                        { name: 'JSON Formatter', href: '/tools/json-formatter' },
                        { name: 'Diff Checker', href: '/tools/diff-checker' },
                        { name: 'HTML Minifier', href: '/tools/html-minifier' },
                        { name: 'CSS Minifier', href: '/tools/css-minifier' },
                        { name: 'Base64 Encoder', href: '/tools/base64' },
                    ]
                },
                {
                    title: 'Color Tools',
                    items: [
                        { name: 'Color Picker', href: '/tools/color-picker' },
                        { name: 'Palette Generator', href: '/tools/palette-generator' },
                        { name: 'Gradient Generator', href: '/tools/gradient-generator' },
                        { name: 'Color Converter', href: '/tools/color-converter' },
                    ]
                },
                {
                    title: 'Text & Utils',
                    items: [
                        { name: 'Word Counter', href: '/tools/word-counter' },
                        { name: 'Case Converter', href: '/tools/case-converter' },
                        { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum' },
                        { name: 'QR Generator', href: '/tools/qr-generator' },
                        { name: 'QR Reader', href: '/tools/qr-reader' },
                        { name: 'Barcode Gen', href: '/tools/barcode-generator' },
                        { name: 'Barcode Reader', href: '/tools/barcode-reader' },
                    ]
                }
            ]
        }
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 shadow-2xl">
            <div className="max-w-[1500px] mx-auto px-6 h-20 flex items-center justify-between">

                {/* Brand / Logo */}
                <div className="flex-shrink-0 flex items-center gap-2">
                    <Logo />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center gap-2">
                    {menuItems.map((menu) => (
                        <div
                            key={menu.name}
                            className="relative group h-20 flex items-center px-1"
                            onMouseEnter={() => setActiveDropdown(menu.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className={`flex items-center gap-2 font-bold text-sm transition-all py-2 px-4 rounded-xl border border-transparent ${activeDropdown === menu.name ? 'text-white bg-white/10 border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                {menu.icon}
                                <span>{menu.name}</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === menu.name ? 'rotate-180 text-white' : 'opacity-50'}`} />
                            </button>

                            {/* Dropdown / Mega Menu */}
                            <div className={`absolute top-[80px] ${menu.align === 'right' ? 'right-0' : menu.align === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'} ${menu.width} transition-all duration-300 origin-top ${activeDropdown === menu.name ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-4'}`}>
                                {/* Arrow Pointer */}
                                <div className={`absolute top-[-6px] ${menu.align === 'right' ? 'right-10' : menu.align === 'left' ? 'left-10' : 'left-1/2 -translate-x-1/2'} w-3 h-3 bg-[#0a0a0a] border-t border-l border-white/10 rotate-45 z-10`} />

                                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden mt-1 p-6">
                                    {/* Subtle Glow Background */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

                                    <div className={`grid ${menu.sections.length > 1 ? 'grid-cols-' + menu.sections.length : 'grid-cols-1'} gap-8 relative z-20`} style={{ gridTemplateColumns: `repeat(${menu.sections.length}, minmax(0, 1fr))` }}>
                                        {menu.sections.map((section, idx) => (
                                            <div key={idx} className="space-y-4">
                                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2 mb-2">
                                                    {section.title}
                                                </h3>
                                                <div className="space-y-1">
                                                    {section.items.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className={`group/item flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${pathname === item.href ? 'text-white bg-white/10 ring-1 ring-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${pathname === item.href ? 'bg-blue-500 scale-125' : 'bg-zinc-800 group-hover/item:bg-white'}`} />
                                                                {item.name}
                                                            </div>
                                                            {pathname !== item.href && (
                                                                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 text-zinc-600" />
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </nav>

                <button
                    onClick={() => setIsLoginOpen(true)}
                    className="hidden cursor-pointer md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all ml-4"
                >
                    <User size={18} />
                    <span>Login</span>
                </button>

                {/* Mobile Menu Toggle */}
                <button
                    className="xl:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 h-[100vh] top-20 bg-[#000000] z-[60] transition-transform duration-300 overflow-y-auto pb-32 border-t border-white/10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 space-y-4">
                    {menuItems.map((menu) => (
                        <div key={menu.name} className="border-b border-white/5 last:border-0">
                            <button
                                onClick={() => setActiveMobileMenu(activeMobileMenu === menu.name ? null : menu.name)}
                                className={`w-full flex items-center justify-between py-4 font-bold text-lg transition-colors ${activeMobileMenu === menu.name ? 'text-white' : 'text-zinc-400'}`}
                            >
                                <div className="flex items-center gap-3">
                                    {menu.icon}
                                    {menu.name}
                                </div>
                                <ChevronDown size={20} className={`transition-transform duration-300 ${activeMobileMenu === menu.name ? 'rotate-180 text-white' : 'text-zinc-600'}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ${activeMobileMenu === menu.name ? 'max-h-[3000px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-6 pl-4">
                                    {menu.sections.map((section, sIdx) => (
                                        <div key={sIdx} className="space-y-3">
                                            <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-2 border-l-2 border-zinc-800">{section.title}</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {section.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${pathname === item.href ? 'bg-blue-950/20 border-blue-500/30 text-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                                                    >
                                                        <span className="font-medium text-sm">{item.name}</span>
                                                        <ArrowRight size={14} className={pathname === item.href ? 'text-blue-400' : 'text-zinc-700 opacity-50'} />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-white/10">
                    <button
                        onClick={() => { setIsOpen(false); setIsLoginOpen(true); }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-500/20"
                    >
                        <User size={20} />
                        Login / Sign Up
                    </button>
                </div>
            </div>

            <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </header>
    );
}

