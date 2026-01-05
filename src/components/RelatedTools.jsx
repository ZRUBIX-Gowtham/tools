"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Zap,
    Maximize2,
    Crop,
    Image as ImageIcon,
    FileText,
    Video,
    Wand2,
    QrCode,
    Scissors,
    Palette,
    Code,
    Minimize2,
    RefreshCcw,
    Type,
    SplitSquareHorizontal,
    FileJson,
    Droplet,
    FileCode,
    Binary,
    AlignLeft,
    BoxSelect,
    PaintBucket,
    Baseline,
    ScanLine
} from 'lucide-react';

const TOOLS_DATA = [
    // --- Image Tools ---
    {
        name: 'Image Compressor',
        description: 'Reduce image file size without losing quality',
        icon: Zap,
        href: '/tools/image-compressor',
        category: 'image',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10'
    },
    {
        name: 'Image Resizer',
        description: 'Resize images to exact dimensions',
        icon: Maximize2,
        href: '/tools/resizer',
        category: 'image',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10'
    },
    {
        name: 'Background Remover',
        description: 'Remove image backgrounds automatically',
        icon: Scissors,
        href: '/tools/background-remover',
        category: 'image',
        color: 'text-rose-400',
        bgColor: 'bg-rose-400/10'
    },
    {
        name: 'Image Cropper',
        description: 'Crop and trim images easily',
        icon: Crop,
        href: '/tools/image-cropper',
        category: 'image',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10'
    },
    {
        name: 'Canvas Studio',
        description: 'Advanced frame editor and layout designer',
        icon: Palette,
        href: '/editing/canvas-studio',
        category: 'image',
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10'
    },
    {
        name: 'Text to SVG',
        description: 'Convert text to SVG paths',
        icon: Type,
        href: '/tools/text-to-svg',
        category: 'image',
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-400/10'
    },
    {
        name: 'PNG to JPG',
        description: 'Convert PNG images to JPG format',
        icon: ImageIcon,
        href: '/convert/png-to-jpg',
        category: 'image',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10'
    },

    {
        name: 'Image to SVG',
        description: 'Convert PNG/JPG to SVG vector',
        icon: RefreshCcw,
        href: '/convert/any-to-svg',
        category: 'image',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10'
    },

    // --- Video Tools ---
    {
        name: 'Video Compressor',
        description: 'Compress video files efficiently',
        icon: Minimize2,
        href: '/tools/video-compressor',
        category: 'video',
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10'
    },
    {
        name: 'Video Enhancer',
        description: 'Enhance video quality with AI',
        icon: Wand2,
        href: '/tools/video-enhancer',
        category: 'video',
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/10'
    },
    {
        name: 'Video Speed',
        description: 'Change video playback speed',
        icon: Video,
        href: '/tools/video-speed',
        category: 'video',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        name: 'MP4 to GIF',
        description: 'Convert video clips to animated GIFs',
        icon: RefreshCcw,
        href: '/convert/mp4-to-gif',
        category: 'video',
        color: 'text-pink-400',
        bgColor: 'bg-pink-400/10'
    },
    {
        name: 'GIF to MP4',
        description: 'Convert GIFs back to video format',
        icon: Video,
        href: '/convert/gif-to-mp4',
        category: 'video',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400/10'
    },

    // --- PDF Tools ---
    {
        name: 'PDF Compressor',
        description: 'Reduce PDF file size',
        icon: Minimize2,
        href: '/tools/pdf-compressor',
        category: 'pdf',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10'
    },
    {
        name: 'PDF Merger',
        description: 'Combine multiple PDFs into one',
        icon: FileText,
        href: '/tools/pdf-merger',
        category: 'pdf',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10'
    },

    {
        name: 'JPG to PDF',
        description: 'Convert images to PDF documents',
        icon: FileText,
        href: '/convert/jpg-to-pdf',
        category: 'pdf',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10'
    },

    // --- Developer Tools (Code) ---
    {
        name: 'JSON Formatter',
        description: 'Beautify and validate JSON data',
        icon: FileJson,
        href: '/tools/json-formatter',
        category: 'developer',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10'
    },
    {
        name: 'Diff Checker',
        description: 'Compare text and find differences',
        icon: SplitSquareHorizontal,
        href: '/tools/diff-checker',
        category: 'developer',
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-400/10'
    },
    {
        name: 'HTML Minifier',
        description: 'Minify HTML code',
        icon: FileCode,
        href: '/tools/html-minifier',
        category: 'developer',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10'
    },
    {
        name: 'CSS Minifier',
        description: 'Minify CSS code',
        icon: FileCode,
        href: '/tools/css-minifier',
        category: 'developer',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        name: 'Base64 Encoder',
        description: 'Encode and decode Base64',
        icon: Binary,
        href: '/tools/base64',
        category: 'developer',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    {
        name: 'SVG Viewer',
        description: 'View and inspect SVG code',
        icon: Code,
        href: '/tools/svg-viewer',
        category: 'developer',
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10'
    },
    {
        name: 'SVG Color Changer',
        description: 'Recolor SVG icons easily',
        icon: Palette,
        href: '/tools/svg-color-changer',
        category: 'image',
        color: 'text-pink-400',
        bgColor: 'bg-pink-400/10'
    },

    // --- Developer Tools (Text & Utils) ---
    {
        name: 'Word Counter',
        description: 'Count words, characters and lines',
        icon: Type,
        href: '/tools/word-counter',
        category: 'developer',
        color: 'text-lime-400',
        bgColor: 'bg-lime-400/10'
    },
    {
        name: 'Case Converter',
        description: 'Convert text case styles',
        icon: Baseline,
        href: '/tools/case-converter',
        category: 'developer',
        color: 'text-teal-400',
        bgColor: 'bg-teal-400/10'
    },
    {
        name: 'Lorem Ipsum',
        description: 'Generate placeholder text',
        icon: AlignLeft,
        href: '/tools/lorem-ipsum',
        category: 'developer',
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/10'
    },
    {
        name: 'QR Generator',
        description: 'Create custom QR codes instantly',
        icon: QrCode,
        href: '/tools/qr-generator',
        category: 'developer',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400/10'
    },
    {
        name: 'QR Reader',
        description: 'Scan and read QR codes from images',
        icon: QrCode,
        href: '/tools/qr-reader',
        category: 'developer',
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/10'
    },
    {
        name: 'Barcode Gen',
        description: 'Generate customizable barcodes',
        icon: ScanLine,
        href: '/tools/barcode-generator',
        category: 'developer',
        color: 'text-slate-400',
        bgColor: 'bg-slate-400/10'
    },
    {
        name: 'Barcode Reader',
        description: 'Scan and decode barcodes from images',
        icon: ScanLine,
        href: '/tools/barcode-reader',
        category: 'developer',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-400/10'
    },

    // --- Developer Tools (Color) ---
    {
        name: 'Color Picker',
        description: 'Pick and convert colors',
        icon: Droplet,
        href: '/tools/color-picker',
        category: 'developer',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10'
    },
    {
        name: 'Palette Generator',
        description: 'Generate color palettes',
        icon: Palette,
        href: '/tools/palette-generator',
        category: 'developer',
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/10'
    },
    {
        name: 'Gradient Generator',
        description: 'Create beautiful gradients',
        icon: PaintBucket,
        href: '/tools/gradient-generator',
        category: 'developer',
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/10'
    },
    {
        name: 'Color Converter',
        description: 'Convert between color formats',
        icon: RefreshCcw,
        href: '/tools/color-converter',
        category: 'developer',
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10'
    }
];

export default function RelatedTools({ currentPath: propPath }) {
    const pathname = usePathname();
    const currentPath = propPath || pathname;

    // Helper to get suggestions based on category
    const getSuggestions = () => {
        if (!currentPath) return TOOLS_DATA.slice(0, 4);

        const path = currentPath.toLowerCase();

        // Special Case: SVG Tools
        if (path.includes('svg')) {
            const svgTools = TOOLS_DATA.filter(t =>
                t.href !== currentPath &&
                (t.href.includes('svg') || t.name.toLowerCase().includes('svg'))
            );
            // If we have SVG tools, return them (prioritizing them). 
            // If less than 4, fill with image tools? User said "only", but empty slots are bad.
            // Let's return just SVG tools if we have at least 1, otherwise fallback.
            if (svgTools.length > 0) return svgTools.slice(0, 4);
        }

        let category = '';

        // Detect category based on path
        if (path.includes('video') || path.includes('mp4') || path.includes('gif')) {
            category = 'video';
        } else if (path.includes('pdf')) {
            category = 'pdf';
        } else if (
            path.includes('json') ||
            path.includes('diff') ||
            path.includes('html') ||
            path.includes('css') ||
            path.includes('base64') ||
            path.includes('word') ||
            path.includes('case') ||
            path.includes('lorem') ||
            path.includes('qr') ||
            path.includes('barcode') ||
            path.includes('color') ||
            path.includes('palette') ||
            path.includes('gradient')
        ) {
            category = 'developer';
        } else if (path.includes('image') || path.includes('png') || path.includes('jpg') || path.includes('webp')) {
            // Default related for image/converters
            if (path.includes('convert')) {
                // If specific converter request from previous instruction
                category = 'image'; // Broaden to image tools for converters so they see more than just converters
            } else {
                category = 'image';
            }
        }

        // Filter tools by category, excluding current tool
        // If categories match directly OR (special case: current page is PDF-related but not explicitly 'pdf' cat in some weird edge case, though we covered most above)
        let suggestions = TOOLS_DATA.filter(t =>
            t.href !== currentPath && (category ? t.category === category : true)
        );

        // Fallback or fill up if not enough suggestions
        if (suggestions.length < 4) {
            // Try to find more from similar broad categories if needed, or just random
            const remaining = TOOLS_DATA.filter(t => t.href !== currentPath && !suggestions.includes(t));
            // Prioritize same broad type if possible (e.g. image for pdf fallback?) - For now just fill
            suggestions = [...suggestions, ...remaining];
        }

        // Special requirement: For Converters (non-video/non-pdf), prioritize Image Compressor ?
        // The user previously asked for Image Compressor on converter pages.
        // If we are on an image converter page (category='image'), let's ensure Image Compressor is visible if possible.
        if (category === 'image' && path.includes('convert')) {
            const compressor = TOOLS_DATA.find(t => t.name === 'Image Compressor');
            if (compressor && !suggestions.includes(compressor) && currentPath !== compressor.href) {
                suggestions.unshift(compressor);
            }
        }

        return suggestions.slice(0, 4);
    };

    const suggestions = getSuggestions();

    return (
        <div className="w-full mt-24 pt-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-14 sm:px-6 lg:px-8 pb-10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">More Tools You Might Like</h2>
                    <p className="text-slate-400">Explore other powerful tools to streamline your workflow.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {suggestions.map((tool) => (
                        <Link key={tool.href} href={tool.href} className="group relative block h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl transition-all duration-300 group-hover:from-white/10 group-hover:to-white/5" />
                            <div className="relative p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all h-full bg-zinc-900/50 backdrop-blur-sm">
                                <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                    <tool.icon size={24} className={tool.color} />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {tool.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
