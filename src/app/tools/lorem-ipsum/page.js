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
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Lorem Ipsum Generator</h1>
                <p className="text-black text-lg">Generate placeholder text for your designs.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <label className="text-sm font-bold text-black">Paragraphs:</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={paragraphs}
                        onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
                        className="w-20 px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-teal-500 outline-none font-bold text-center text-black"
                    />
                    <button
                        onClick={generate}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <RefreshCw size={18} /> Generate
                    </button>
                </div>

                {text && (
                    <>
                        <div className="bg-slate-50 rounded-xl p-6 mb-6 max-h-[400px] overflow-y-auto">
                            <p className="text-black leading-relaxed whitespace-pre-wrap">{text}</p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={copyText}
                                className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
