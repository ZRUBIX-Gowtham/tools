"use client";
import Link from 'next/link';
import { ChevronDown, Menu, X, Image as ImageIcon, Settings, FileImage, Layers, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'PNG Tools',
            icon: <ImageIcon size={20} className="text-blue-500" />,
            items: [
                { name: 'PNG to JPG', href: '/convert/png-to-jpg' },
                { name: 'PNG to WebP', href: '/convert/png-to-webp' },
                { name: 'PNG to SVG', href: '/convert/png-to-svg' },
                { name: 'PNG to PDF', href: '/convert/png-to-pdf' }
            ]
        },
        {
            name: 'JPEG Tools',
            icon: <FileImage size={20} className="text-indigo-500" />,
            items: [
                { name: 'JPEG to WebP', href: '/convert/jpeg-to-webp' },
                { name: 'JPEG to PDF', href: '/convert/jpeg-to-pdf' },
                { name: 'JPEG to PNG', href: '/convert/jpeg-to-png' },
            ]
        },
        {
            name: 'JPG Tools',
            icon: <FileImage size={20} className="text-emerald-500" />,
            items: [
                { name: 'JPG to PNG', href: '/convert/jpg-to-png' },
                { name: 'JPG to WebP', href: '/convert/jpg-to-webp' },
            ]
        },
        {
            name: 'SVG Tools',
            icon: <Layers size={20} className="text-purple-500" />,
            items: [
                { name: 'SVG to PNG', href: '/convert/svg-to-png' },
                { name: 'SVG to JPG', href: '/convert/svg-to-jpg' },
                { name: 'Any to SVG', href: '/convert/any-to-svg' },
            ]
        },
        {
            name: 'WebP Tools',
            icon: <Sparkles size={20} className="text-cyan-500" />,
            items: [
                { name: 'WebP to PNG', href: '/convert/webp-to-png' },
                { name: 'WebP to JPEG', href: '/convert/webp-to-jpeg' },
                { name: 'WebP to JPG', href: '/convert/webp-to-jpg' },
                { name: 'WebP to SVG', href: '/convert/webp-to-svg' }
            ]
        }
    ];

    const moreTools = [
        { name: 'GIF to MP4', href: '/convert/gif-to-mp4' },
        { name: 'Image Resizer', href: '/tools/resizer' },
        { name: 'PDF Compressor', href: '/tools/pdf-compressor' },
        { name: 'Color Picker', href: '/tools/color-picker' },
        { name: 'QR Generator', href: '/tools/qr-generator' }
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white/10 shadow-2xl">
            <div className="max-w-[1500px] mx-auto px-6 h-20 flex items-center justify-between">

                {/* Brand / Logo */}
                <div className="flex-shrink-0 flex items-center gap-2">
                    <Logo />
                </div>

                {/* Desktop Navigation - Right Aligned */}
                <nav className="hidden xl:flex items-center gap-1">
                    {menuItems.map((menu) => (
                        <div
                            key={menu.name}
                            className="relative group h-20 flex items-center px-1"
                            onMouseEnter={() => setActiveDropdown(menu.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className={`flex items-center gap-2 font-bold text-sm transition-all py-2 px-4 rounded-lg bg-transparent border border-transparent ${activeDropdown === menu.name ? 'text-white bg-white/10 border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                {menu.icon}
                                <span>{menu.name.split(' ')[0]}</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === menu.name ? 'rotate-180 text-white' : 'opacity-50'}`} />
                            </button>

                            {/* Enhanced Submenu */}
                            <div className={`absolute top-[80px] left-1/2 -translate-x-1/2 w-[280px] transition-all duration-300 origin-top ${activeDropdown === menu.name ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-4'}`}>
                                {/* Arrow Pointer */}
                                <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a0a0a] border-t border-l border-white/10 rotate-45 z-10" />

                                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden mt-1 p-3">
                                    {/* Subtle Glow Background */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

                                    <div className="relative z-20">
                                        <div className="px-3 py-2 border-b border-white/5 mb-2 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{menu.name}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        </div>

                                        <div className="space-y-1">
                                            {menu.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`group/item flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${pathname === item.href ? 'text-white bg-white/10 ring-1 ring-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${pathname === item.href ? 'bg-blue-500 scale-125' : 'bg-zinc-700 group-hover/item:bg-white'}`} />
                                                        {item.name}
                                                    </div>
                                                    <ArrowRight size={14} className={`transition-all duration-300 ${pathname === item.href ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0'}`} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="h-6 w-px bg-white/10 mx-3"></div>

                    {/* More Tools Dropdown */}
                    <div className="relative group h-20 flex items-center px-1" onMouseEnter={() => setActiveDropdown('more')} onMouseLeave={() => setActiveDropdown(null)}>
                        <button className={`flex items-center gap-2 font-bold text-sm transition-all py-2 px-4 rounded-lg bg-transparent border border-transparent ${activeDropdown === 'more' ? 'text-white bg-white/10 border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                            <Settings size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                            <span>More</span>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'more' ? 'rotate-180 text-white' : 'opacity-50'}`} />
                        </button>

                        <div className={`absolute top-[80px] right-0 w-[240px] transition-all duration-300 origin-top-right ${activeDropdown === 'more' ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-4'}`}>
                            {/* Arrow Pointer */}
                            <div className="absolute top-[-6px] right-8 w-3 h-3 bg-[#0a0a0a] border-t border-l border-white/10 rotate-45 z-10" />

                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden mt-1 p-3">
                                <div className="px-3 py-2 border-b border-white/5 mb-2">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Extra Resources</span>
                                </div>
                                <div className="space-y-1">
                                    {moreTools.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`group/item flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${pathname === item.href ? 'text-white bg-white/10 ring-1 ring-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${pathname === item.href ? 'bg-blue-500 scale-125' : 'bg-zinc-700 group-hover/item:bg-white'}`} />
                                                {item.name}
                                            </div>
                                            <ExternalLink size={14} className={`transition-all duration-300 ${pathname === item.href ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0'}`} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="xl:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 top-20 bg-black z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full overflow-y-auto p-6 space-y-8 pb-32 bg-black">
                    {menuItems.map((menu) => (
                        <div key={menu.name} className="space-y-4">
                            <div className="flex items-center gap-2 text-white font-black text-lg border-b border-white/10 pb-2 uppercase tracking-wide">
                                {menu.icon}
                                {menu.name}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
                                {menu.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${pathname === item.href ? 'bg-blue-950 border-blue-500 text-white' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                                    >
                                        <span className="font-bold text-sm">{item.name}</span>
                                        <ArrowRight size={16} className={pathname === item.href ? 'text-blue-400' : 'text-zinc-600'} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-white font-black text-lg border-b border-white/10 pb-2">
                            <Settings size={20} />
                            More Utilities
                        </div>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            {moreTools.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${pathname === item.href ? 'bg-indigo-950 border-indigo-500 text-white' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                                >
                                    <span className="font-bold text-sm">{item.name}</span>
                                    <ExternalLink size={16} className={pathname === item.href ? 'text-indigo-400' : 'text-zinc-600'} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
