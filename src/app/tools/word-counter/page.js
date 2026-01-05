"use client";
import { useState, useEffect } from 'react';
import { Type, FileText } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';

export default function WordCounter() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
    });

    useEffect(() => {
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
        const readingTime = Math.ceil(words / 200);

        setStats({ characters, charactersNoSpaces, words, sentences, paragraphs, readingTime });
    }, [text]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Word Counter</h1>
                <p className="text-zinc-400 text-lg">Count words, characters, sentences and more.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-black text-indigo-400">{stats.words}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase">Words</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-black text-indigo-400">{stats.characters}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase">Characters</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-black text-indigo-400">{stats.charactersNoSpaces}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase">No Spaces</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-black text-indigo-400">{stats.sentences}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase">Sentences</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-black text-indigo-400">{stats.paragraphs}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase">Paragraphs</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-black text-indigo-400">{stats.readingTime}</p>
                        <p className="text-xs font-bold text-zinc-500 uppercase">Min Read</p>
                    </div>
                </div>

                {/* Text Area */}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing or paste your text here..."
                    className="w-full h-64 p-6 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none resize-none text-white placeholder:text-zinc-600 transition-all text-lg leading-relaxed"
                />

                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setText('')}
                        className="text-zinc-500 hover:text-rose-500 font-bold text-sm transition-colors cursor-pointer flex items-center gap-2"
                    >
                        Clear Text
                    </button>
                </div>
            </div>
            <RelatedTools />
        </div>
    );
}
