"use client";
import { useState, useRef, useEffect } from 'react';
import { Video, Download, X, Loader2, AlertCircle, Play, Pause, Clock } from 'lucide-react';

export default function GifToMp4() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(5);
    const [gifPreview, setGifPreview] = useState(null);
    const fileInputRef = useRef(null);
    const imgRef = useRef(null);
    const recordingRef = useRef(false);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'image/gif') {
            setFile(selectedFile);
            setGifPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
            setError(null);
            setVideoUrl(null);
        } else if (selectedFile) {
            setError('Please select a valid GIF file.');
        }
    };

    const convertToMp4 = async () => {
        if (!file || !imgRef.current) return;
        setStatus('processing');
        setProgress(0);
        setError(null);
        recordingRef.current = true;

        try {
            const img = imgRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');

            // Fill white background for transparency
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const stream = canvas.captureStream(30); // 30 FPS

            // Determine supported mime type
            const mimeTypes = [
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm',
                'video/mp4'
            ];
            const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));

            if (!mimeType) {
                throw new Error('No supported video export format in this browser.');
            }

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType,
                videoBitsPerSecond: 5000000 // 5 Mbps
            });

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                setVideoUrl(URL.createObjectURL(blob));
                setStatus('success');
                recordingRef.current = false;
            };

            mediaRecorder.start();

            // Recording loop
            const startTime = Date.now();
            const animate = () => {
                if (!recordingRef.current) return;

                const elapsed = (Date.now() - startTime) / 1000;
                setProgress((elapsed / duration) * 100);

                if (elapsed >= duration) {
                    mediaRecorder.stop();
                    return;
                }

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                requestAnimationFrame(animate);
            };

            animate();

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to convert GIF.');
            setStatus('error');
            recordingRef.current = false;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">GIF to Video Converter</h1>
                <p className="text-zinc-400 text-lg">Convert animated GIFs to MP4/WebM video.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-purple-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <Video size={32} className="text-purple-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all shadow-xl cursor-pointer"
                        >
                            Select GIF File
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/gif" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Preview */}
                        <div className="flex justify-center bg-white/5 p-4 rounded-xl border border-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img ref={imgRef} src={gifPreview} alt="GIF Preview" className="max-h-[300px] object-contain" />
                        </div>

                        {/* Settings */}
                        <div className="p-4 bg-white/5 rounded-xl max-w-md mx-auto border border-white/5">
                            <label className="text-sm font-bold text-zinc-300 flex items-center gap-2 mb-2">
                                <Clock size={16} /> Recording Duration: {duration}s
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-purple-500"
                            />
                            <p className="text-xs text-zinc-500 mt-2 text-center">
                                Since GIFs loop, specify how long to record the video.
                            </p>
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="space-y-2">
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 transition-all duration-300"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <p className="text-sm text-zinc-300 text-center">Recording... {Math.round(progress)}%</p>
                            </div>
                        )}

                        {status === 'success' && videoUrl && (
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-zinc-300 text-center">Converted Video</p>
                                <div className="rounded-xl overflow-hidden bg-black/50 p-4 flex justify-center border border-white/10">
                                    <video src={videoUrl} controls loop className="max-h-[300px]" />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-4 flex-wrap">
                            {status === 'success' ? (
                                <>
                                    <a
                                        href={videoUrl}
                                        download={`converted.webm`}
                                        className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center gap-3 cursor-pointer"
                                    >
                                        <Download size={20} /> Download Video
                                    </a>
                                    <button onClick={() => { setVideoUrl(null); setStatus('idle'); }} className="bg-zinc-800 text-white px-10 py-4 rounded-2xl font-bold cursor-pointer hover:bg-zinc-700 transition">Convert Again</button>
                                </>
                            ) : status === 'processing' ? (
                                <button disabled className="bg-zinc-800 text-zinc-500 px-10 py-4 rounded-2xl font-bold flex items-center gap-3 cursor-not-allowed">
                                    <Loader2 size={24} className="animate-spin" /> Recording...
                                </button>
                            ) : (
                                <>
                                    <button onClick={convertToMp4} className="bg-white text-zinc-900 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-purple-500 hover:text-white transition-all shadow-xl flex items-center gap-3 cursor-pointer">
                                        <Video size={20} /> Convert to Video
                                    </button>
                                    <button onClick={() => { setFile(null); setGifPreview(null); }} className="bg-zinc-800 text-white px-8 py-5 rounded-2xl font-bold cursor-pointer hover:bg-zinc-700 transition">
                                        <X size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
