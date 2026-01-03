"use client";
import { useState } from 'react';
import { Type, Copy, Check, RefreshCw } from 'lucide-react';

export default function LoremIpsum() {
    const [paragraphs, setParagraphs] = useState(3);
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const loremWords = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
        "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
        "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
        "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
        "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
        "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
        "deserunt", "mollit", "anim", "id", "est", "laborum"
    ];

    const generateSentence = () => {
        const length = Math.floor(Math.random() * 10) + 8;
        const sentence = [];
        for (let i = 0; i < length; i++) {
            sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        return sentence.join(' ') + '.';
    };

    const generateParagraph = () => {
        const sentences = Math.floor(Math.random() * 4) + 4;
        const para = [];
        for (let i = 0; i < sentences; i++) {
            para.push(generateSentence());
        }
        return para.join(' ');
    };

    const generate = () => {
        const paras = [];
        for (let i = 0; i < paragraphs; i++) {
            paras.push(generateParagraph());
        }
        setText(paras.join('\n\n'));
    };

    const copyText = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Lorem Ipsum Generator</h1>
                <p className="text-zinc-400 text-lg">Generate placeholder text for your designs.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <label className="text-sm font-bold text-zinc-300">Paragraphs:</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={paragraphs}
                        onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
                        className="w-20 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none font-bold text-center text-white"
                    />
                    <button
                        onClick={generate}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/20"
                    >
                        <RefreshCw size={18} /> Generate
                    </button>
                </div>

                {text && (
                    <>
                        <div className="bg-black/30 border border-white/10 rounded-xl p-6 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{text}</p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={copyText}
                                className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                            >
                                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
