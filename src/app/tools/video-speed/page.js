"use client";
import { useState, useRef } from 'react';
import { Video, Download, X, Loader2, AlertCircle, Zap, FastForward, Gauge } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';

export default function VideoSpeedChanger() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [processedUrl, setProcessedUrl] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1.5);
    const [videoPreview, setVideoPreview] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);

    const speedOptions = [
        { value: 0.25, label: '0.25x', desc: 'Very Slow' },
        { value: 0.5, label: '0.5x', desc: 'Slow Motion' },
        { value: 0.75, label: '0.75x', desc: 'Slightly Slow' },
        { value: 1, label: '1x', desc: 'Normal' },
        { value: 1.25, label: '1.25x', desc: 'Slightly Fast' },
        { value: 1.5, label: '1.5x', desc: 'Fast' },
        { value: 2, label: '2x', desc: 'Double Speed' },
        { value: 3, label: '3x', desc: 'Triple Speed' },
        { value: 4, label: '4x', desc: 'Quad Speed' },
    ];

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setVideoPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
            setError(null);
            setProcessedUrl(null);
        }
    };

    const changeSpeed = async () => {
        if (!file || !videoRef.current) return;
        setStatus('processing');
        setProgress(0);
        setError(null);

        try {
            const video = videoRef.current;

            // Wait for video to load
            if (video.readyState < 2) {
                await new Promise((resolve) => {
                    video.onloadeddata = resolve;
                });
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Create stream and recorder
            const stream = canvas.captureStream(30);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8',
                videoBitsPerSecond: 5000000 // 5 Mbps for good quality
            });

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                setProcessedUrl(URL.createObjectURL(blob));
                setStatus('success');
            };

            mediaRecorder.onerror = () => {
                setError('Failed to process video');
                setStatus('error');
            };

            mediaRecorder.start();

            // Set video playback rate
            video.playbackRate = speed;
            video.currentTime = 0;
            video.muted = true;
            await video.play();

            const drawFrame = () => {
                if (video.ended || video.paused) {
                    mediaRecorder.stop();
                    return;
                }

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const progressPercent = (video.currentTime / video.duration) * 100;
                setProgress(progressPercent);
                requestAnimationFrame(drawFrame);
            };

            drawFrame();

            video.onended = () => {
                if (mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
            };

        } catch (err) {
            console.error(err);
            setError('Failed to process video. Please try a different file.');
            setStatus('error');
        }
    };

    const getSpeedDescription = () => {
        if (speed < 1) return `Video will play ${Math.round(1 / speed)}x slower`;
        if (speed > 1) return `Video will play ${speed}x faster`;
        return 'Normal playback speed';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Video Speed Changer</h1>
                <p className="text-zinc-400 text-lg">Speed up or slow down your videos. Create fast-motion or slow-motion effects.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-indigo-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <FastForward size={32} className="text-indigo-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl cursor-pointer"
                        >
                            Select Video File
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="video/*" />
                        <p className="text-zinc-500 mt-4 text-sm">Supports MP4, WebM, MOV and more</p>
                        <p className="text-zinc-600 mt-2 text-xs">Change video playback speed from 0.25x to 4x</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Video Preview */}
                        <div className="rounded-xl overflow-hidden bg-black/50 border border-white/10">
                            <video
                                ref={videoRef}
                                src={videoPreview}
                                controls
                                className="w-full max-h-[300px]"
                            />
                        </div>

                        {/* Speed Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                <Gauge size={16} className="text-indigo-500" /> Select Speed
                            </label>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                {speedOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSpeed(option.value)}
                                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${speed === option.value
                                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                            : 'border-white/10 hover:border-indigo-500/50 text-zinc-400 hover:text-white bg-white/5'
                                            }`}
                                    >
                                        <div className="font-bold text-lg">{option.label}</div>
                                        <div className="text-xs text-zinc-500 group-hover:text-zinc-400">{option.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Speed Info */}
                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Zap size={20} className="text-indigo-400" />
                                <span className="font-bold text-indigo-300 text-lg">{speed}x Speed</span>
                            </div>
                            <p className="text-sm text-indigo-400">{getSpeedDescription()}</p>
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
                                        className="h-full bg-indigo-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-zinc-300 text-center">Processing at {speed}x speed... {Math.round(progress)}%</p>
                            </div>
                        )}

                        {status === 'success' && processedUrl && (
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-zinc-300 text-center">Processed Video ({speed}x speed)</p>
                                <div className="rounded-xl overflow-hidden bg-black/50 border border-white/10">
                                    <video src={processedUrl} controls className="w-full max-h-[300px]" />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-4 flex-wrap">
                            {status === 'success' ? (
                                <>
                                    <a
                                        href={processedUrl}
                                        download={`${speed}x-speed-${file.name.replace(/\.[^/.]+$/, '')}.webm`}
                                        className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center gap-3 cursor-pointer"
                                    >
                                        <Download size={20} /> Download Video
                                    </a>
                                    <button onClick={() => { setProcessedUrl(null); setStatus('idle'); }} className="bg-zinc-800 text-white px-10 py-4 rounded-2xl font-bold cursor-pointer hover:bg-zinc-700 transition">Change Speed Again</button>
                                </>
                            ) : status === 'processing' ? (
                                <div className="flex items-center gap-3 text-white">
                                    <Loader2 size={24} className="animate-spin" />
                                    <span className="font-bold">Processing video...</span>
                                </div>
                            ) : (
                                <>
                                    <button onClick={changeSpeed} className="bg-white text-zinc-900 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl flex items-center gap-3 cursor-pointer">
                                        <Zap size={20} /> Apply {speed}x Speed
                                    </button>
                                    <button onClick={() => { setFile(null); setVideoPreview(null); }} className="bg-zinc-800 text-white px-8 py-5 rounded-2xl font-bold cursor-pointer hover:bg-zinc-700 transition">
                                        <X size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <RelatedTools />
        </div>
    );
}
