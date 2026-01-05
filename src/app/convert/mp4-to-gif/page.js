"use client";
import { useState, useRef, useEffect } from 'react';
import { Video, Download, X, Loader2, AlertCircle, Play, Pause, Clock, Scissors, Zap } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';

export default function MP4ToGIF() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [gifUrl, setGifUrl] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(5);
    const [startTime, setStartTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoPreview, setVideoPreview] = useState(null);
    const [fps, setFps] = useState(10);
    const [quality, setQuality] = useState(0.8);
    const [speed, setSpeed] = useState(1); // 1x, 2x, 3x speed options
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setVideoPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
            setError(null);
            setGifUrl(null);
        }
    };

    const handleVideoLoaded = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setVideoDuration(dur);
            // Default to first 5 seconds or full video if shorter
            setDuration(Math.min(5, dur));
            setStartTime(0);
        }
    };

    const loadGifshot = () => {
        return new Promise((resolve, reject) => {
            if (typeof window !== 'undefined' && window.gifshot) {
                resolve(window.gifshot);
            } else {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gifshot/0.4.5/gifshot.min.js';
                script.onload = () => resolve(window.gifshot);
                script.onerror = () => reject(new Error('Failed to load GIF library'));
                document.body.appendChild(script);
            }
        });
    };

    const convertToGif = async () => {
        if (!file || !videoRef.current) return;
        setStatus('processing');
        setProgress(0);
        setError(null);

        try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size based on video
            const maxWidth = 480;
            const scale = Math.min(1, maxWidth / video.videoWidth);
            const w = Math.floor(video.videoWidth * scale);
            const h = Math.floor(video.videoHeight * scale);
            canvas.width = w;
            canvas.height = h;

            const frames = [];
            // Calculate frame count based on speed
            const effectiveDuration = duration / speed;
            const frameCount = Math.floor(effectiveDuration * fps);
            const frameDelay = 1000 / fps;

            // Capture frames with speed consideration
            for (let i = 0; i < frameCount; i++) {
                const currentTime = startTime + (i / fps) * speed;
                if (currentTime > videoDuration || currentTime > startTime + duration) break;

                video.currentTime = currentTime;

                await new Promise((resolve) => {
                    video.onseeked = () => {
                        ctx.drawImage(video, 0, 0, w, h);
                        frames.push(canvas.toDataURL('image/jpeg', quality));
                        setProgress(((i + 1) / frameCount) * 50);
                        resolve();
                    };
                });
            }

            if (frames.length === 0) {
                throw new Error('No frames captured');
            }

            // Create GIF using imported gifshot
            // We need to dynamically import because gifshot might assume window exists
            const gifshotModule = await import('gifshot');
            const gifshot = gifshotModule.default || gifshotModule;

            gifshot.createGIF({
                images: frames,
                gifWidth: w,
                gifHeight: h,
                interval: frameDelay / 1000,
                numFrames: frames.length,
                progressCallback: (captureProgress) => {
                    setProgress(50 + captureProgress * 50);
                },
            }, function (obj) {
                if (!obj.error) {
                    setGifUrl(obj.image);
                    setStatus('success');
                } else {
                    setError('Failed to create GIF: ' + obj.errorMsg);
                    setStatus('error');
                }
            });

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to convert video. Please try a different file.');
            setStatus('error');
        }
    };

    const speedOptions = [
        { value: 1, label: '1x Normal', description: 'Original speed' },
        { value: 2, label: '2x Fast', description: 'Double speed' },
        { value: 3, label: '3x Faster', description: 'Triple speed' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">MP4 to GIF Converter</h1>
                <p className="text-zinc-400 text-lg">Convert video clips to animated GIFs with speed control. Extract up to 5 seconds.</p>
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
                            Select Video File
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="video/*" />
                        <p className="text-zinc-500 mt-4 text-sm">Supports MP4, WebM, MOV and more</p>
                        <p className="text-zinc-600 mt-2 text-xs">Extracts up to 5 seconds of video</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Video Preview */}
                        <div className="rounded-xl overflow-hidden bg-black/50 border border-white/10">
                            <video
                                ref={videoRef}
                                src={videoPreview}
                                onLoadedMetadata={handleVideoLoaded}
                                controls
                                className="w-full max-h-[300px]"
                            />
                        </div>

                        {/* Speed Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                <Zap size={16} className="text-purple-500" /> Playback Speed
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {speedOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSpeed(option.value)}
                                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${speed === option.value
                                            ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                                            : 'border-white/10 hover:border-purple-500/50 text-zinc-400 hover:text-white bg-white/5'
                                            }`}
                                    >
                                        <div className="font-bold text-lg">{option.label}</div>
                                        <div className="text-xs text-zinc-500 mt-1">{option.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                    <Clock size={14} /> Start Time: {startTime.toFixed(1)}s
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max={Math.max(0, videoDuration - duration)}
                                    step="0.1"
                                    value={startTime}
                                    onChange={(e) => setStartTime(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-purple-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                    <Scissors size={14} /> Duration: {duration.toFixed(1)}s (max 5s)
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max={Math.min(5, videoDuration - startTime)}
                                    step="0.5"
                                    value={duration}
                                    onChange={(e) => setDuration(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-purple-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-300">FPS: {fps}</label>
                                <input
                                    type="range"
                                    min="5"
                                    max="15"
                                    step="1"
                                    value={fps}
                                    onChange={(e) => setFps(parseInt(e.target.value))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-purple-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-300">Quality: {Math.round(quality * 100)}%</label>
                                <input
                                    type="range"
                                    min="0.3"
                                    max="1"
                                    step="0.1"
                                    value={quality}
                                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-purple-500"
                                />
                            </div>
                        </div>

                        <div className="text-center text-sm text-zinc-300 bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
                            <span className="font-bold">Preview:</span> Will extract {duration.toFixed(1)} seconds from {startTime.toFixed(1)}s to {(startTime + duration).toFixed(1)}s at <span className="font-bold text-purple-400">{speed}x speed</span>
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
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-zinc-300 text-center">Converting... {Math.round(progress)}%</p>
                            </div>
                        )}

                        {status === 'success' && gifUrl && (
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-zinc-300 text-center">Generated GIF ({speed}x speed)</p>
                                <div className="rounded-xl overflow-hidden bg-black/30 border border-white/5 p-4 flex justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={gifUrl} alt="Generated GIF" className="max-w-full max-h-[300px] rounded-lg" />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-4 flex-wrap">
                            {status === 'success' ? (
                                <>
                                    <a
                                        href={gifUrl}
                                        download={`converted-${speed}x.gif`}
                                        className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center gap-3 cursor-pointer"
                                    >
                                        <Download size={20} /> Download GIF
                                    </a>
                                    <button onClick={() => { setGifUrl(null); setStatus('idle'); }} className="bg-zinc-800 text-white px-10 py-4 rounded-2xl font-bold cursor-pointer hover:bg-zinc-700 transition">Convert Again</button>
                                </>
                            ) : status === 'processing' ? (
                                <div className="flex items-center gap-3 text-white">
                                    <Loader2 size={24} className="animate-spin" />
                                    <span className="font-bold">Creating GIF...</span>
                                </div>
                            ) : (
                                <>
                                    <button onClick={convertToGif} className="bg-white text-zinc-900 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-purple-500 hover:text-white transition-all shadow-xl flex items-center gap-3 cursor-pointer">
                                        <Video size={20} /> Convert to GIF
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
