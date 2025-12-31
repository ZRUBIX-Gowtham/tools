"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileImage,
  Repeat,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

const converterGroups = [
  {
    title: "PNG Tools",
    icon: <ImageIcon size={24} />,
    gradient: "from-blue-500/20 to-blue-500/5",
    tools: [
      { name: "PNG to JPG", href: "/convert/png-to-jpg", description: "Convert transparent PNG to high-quality JPG" },
      { name: "PNG to WebP", href: "/convert/png-to-webp", description: "Modern, compressed image format for web" },
      { name: "PNG to SVG", href: "/convert/png-to-svg", description: "Raster to vector conversion tool" },
      { name: "PNG to PDF", href: "/convert/png-to-pdf", description: "Save PNG image as a PDF document" }
    ]
  },
  {
    title: "JPEG Tools",
    icon: <FileImage size={24} />,
    gradient: "from-indigo-500/20 to-indigo-500/5",
    tools: [
      { name: "JPEG to WebP", href: "/convert/jpeg-to-webp", description: "Best conversion for web photos" },
      { name: "JPEG to PDF", href: "/convert/jpeg-to-pdf", description: "Quick photo to PDF conversion" },
      { name: "JPEG to PNG", href: "/convert/jpeg-to-png", description: "Convert JPEG to transparent PNG" }
    ]
  },
  {
    title: "JPG Tools",
    icon: <FileImage size={24} />,
    gradient: "from-emerald-500/20 to-emerald-500/5",
    tools: [
      { name: "JPG to PNG", href: "/convert/jpg-to-png", description: "Convert JPG to transparent PNG format" },
      { name: "JPG to WebP", href: "/convert/jpg-to-webp", description: "Best conversion for web photos" }
    ]
  },
  {
    title: "SVG & Vectors",
    icon: <Layers size={24} />,
    gradient: "from-purple-500/20 to-purple-500/5",
    tools: [
      { name: "SVG to PNG", href: "/convert/svg-to-png", description: "Vector to high-res raster image" },
      { name: "SVG to JPG", href: "/convert/svg-to-jpg", description: "Vector illustration to photo format" },
      { name: "Any to SVG", href: "/convert/any-to-svg", description: "Vectorize any image instantly" }
    ]
  },
  {
    title: "WebP Tools",
    icon: <Sparkles size={24} />,
    gradient: "from-cyan-500/20 to-cyan-500/5",
    tools: [
      { name: "WebP to PNG", href: "/convert/webp-to-png", description: "Modern format back to classic PNG" },
      { name: "WebP to JPEG", href: "/convert/webp-to-jpeg", description: "Modern format to standard JPEG" },
      { name: "WebP to JPG", href: "/convert/webp-to-jpg", description: "Modern format to standard JPG" },
      { name: "WebP to SVG", href: "/convert/webp-to-svg", description: "Convert WebP to vector SVG" }
    ]
  },
  {
    title: "More Utilities",
    icon: <Repeat size={24} />,
    gradient: "from-rose-500/20 to-rose-500/5",
    tools: [
      { name: "GIF to MP4", href: "/convert/gif-to-mp4", description: "Convert animated GIFs to video files" },
      { name: "Image Resizer", href: "/tools/resizer", description: "Resize images to any dimension" }
    ]
  }
];

export default function Home() {
  return (
    <div className="min-h-screen selection:bg-blue-500/30 selection:text-white">

      {/* Hero Section */}
      <section className="relative pt-30 pb-20 overflow-hidden bg-black">
        {/* Subtle Backdrop - No more muddy blur */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-50" />

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-500/30 backdrop-blur-md mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase">Premium Tools Free Forever</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              MASTER YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                DIGITAL ASSETS
              </span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
              Enterprise-grade file conversion suite running locally in your browser.
              <span className="block text-zinc-200 font-bold mt-2">Zero uploads. Infinite privacy.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-32 relative z-10 bg-black">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converterGroups.map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10 hover:border-blue-500 transition-all duration-300 group relative overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors duration-300">
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-white text-xl uppercase tracking-wide">{group.title}</h3>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-1">{group.tools.length} Tools Available</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {group.tools.map((tool, tIdx) => (
                      <Link
                        key={tIdx}
                        href={tool.href}
                        className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-900/50 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group/item"
                      >
                        <span className="text-sm font-bold text-zinc-300 group-hover/item:text-white transition-colors">
                          {tool.name}
                        </span>
                        <ArrowRight size={16} className="text-zinc-600 group-hover/item:text-white transition-all opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/10 bg-[#050505]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck size={32} />, title: "Zero Data Uploads", desc: "Files convert locally. No server access." },
              { icon: <Zap size={32} />, title: "WASM Performance", desc: "Native speed via WebAssembly engine." },
              { icon: <Award size={32} />, title: "Lossless Quality", desc: "Bit-perfect preservation of your assets." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="text-blue-500 bg-blue-900/10 p-4 rounded-2xl h-fit border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
