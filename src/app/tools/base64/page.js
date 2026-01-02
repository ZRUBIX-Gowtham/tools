"use client";
import { useState } from 'react';
import { Code, Copy, Check, ArrowRightLeft } from 'lucide-react';

export default function Base64Encoder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode');
    const [copied, setCopied] = useState(false);

    const process = () => {
        try {
            if (mode === 'encode') {
                setOutput(btoa(input));
            } else {
                setOutput(atob(input));
            }
        } catch (e) {
            setOutput('Error: Invalid input for ' + mode);
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swap = () => {
        setInput(output);
        setOutput('');
        setMode(mode === 'encode' ? 'decode' : 'encode');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Base64 Encoder/Decoder</h1>
                <p className="text-slate-500 text-lg">Encode or decode Base64 strings instantly.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-slate-100 rounded-xl p-1">
                        <button
                            onClick={() => setMode('encode')}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${mode === 'encode' ? 'bg-white shadow text-violet-600' : 'text-slate-500'}`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => setMode('decode')}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${mode === 'decode' ? 'bg-white shadow text-violet-600' : 'text-slate-500'}`}
                        >
                            Decode
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">
                            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
                            className="w-full h-32 p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-violet-500 outline-none resize-none font-mono"
                        />
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={process}
                            className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-violet-600 transition-all"
                        >
                            {mode === 'encode' ? 'Encode' : 'Decode'}
                        </button>
                        {output && (
                            <button
                                onClick={swap}
                                className="bg-slate-100 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                            >
                                <ArrowRightLeft size={18} /> Swap
                            </button>
                        )}
                    </div>

                    {output && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700">Result</label>
                                <button onClick={copyOutput} className="text-sm text-slate-500 hover:text-violet-600 flex items-center gap-1">
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                value={output}
                                readOnly
                                className="w-full h-32 p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-sm border-2 border-slate-800 outline-none resize-none"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
