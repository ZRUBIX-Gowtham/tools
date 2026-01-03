"use client";
import { useState, useRef, useCallback, useEffect } from 'react';
import { Crop, Download, X, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

export default function ImageCropper() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState('idle');
    const [croppedUrl, setCroppedUrl] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [scale, setScale] = useState(1);

    // Crop area in percentage
    const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragType, setDragType] = useState(null); // 'move', 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [cropStart, setCropStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const fileInputRef = useRef(null);
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);
            setStatus('idle');
            setCroppedUrl(null);
            setCropArea({ x: 10, y: 10, width: 80, height: 80 });
        }
    };

    const handleImageLoad = (e) => {
        const img = e.target;
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });

        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            setContainerSize({ width: containerRect.width, height: containerRect.height });

            // Calculate scale to fit
            const scaleX = (containerRect.width - 40) / img.naturalWidth;
            const scaleY = (containerRect.height - 40) / img.naturalHeight;
            setScale(Math.min(scaleX, scaleY, 1));
        }
    };

    const getAbsoluteCropArea = () => {
        const displayWidth = imageSize.width * scale;
        const displayHeight = imageSize.height * scale;

        return {
            x: (cropArea.x / 100) * displayWidth,
            y: (cropArea.y / 100) * displayHeight,
            width: (cropArea.width / 100) * displayWidth,
            height: (cropArea.height / 100) * displayHeight,
        };
    };

    const handleMouseDown = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setDragType(type);
        setDragStart({ x: e.clientX, y: e.clientY });
        setCropStart({ ...cropArea });
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !dragType) return;

        const displayWidth = imageSize.width * scale;
        const displayHeight = imageSize.height * scale;

        const deltaX = ((e.clientX - dragStart.x) / displayWidth) * 100;
        const deltaY = ((e.clientY - dragStart.y) / displayHeight) * 100;

        let newCrop = { ...cropStart };
        const minSize = 5; // Minimum 5% size

        switch (dragType) {
            case 'move':
                newCrop.x = Math.max(0, Math.min(100 - cropStart.width, cropStart.x + deltaX));
                newCrop.y = Math.max(0, Math.min(100 - cropStart.height, cropStart.y + deltaY));
                break;
            case 'nw':
                newCrop.x = Math.max(0, Math.min(cropStart.x + cropStart.width - minSize, cropStart.x + deltaX));
                newCrop.y = Math.max(0, Math.min(cropStart.y + cropStart.height - minSize, cropStart.y + deltaY));
                newCrop.width = cropStart.width - (newCrop.x - cropStart.x);
                newCrop.height = cropStart.height - (newCrop.y - cropStart.y);
                break;
            case 'ne':
                newCrop.y = Math.max(0, Math.min(cropStart.y + cropStart.height - minSize, cropStart.y + deltaY));
                newCrop.width = Math.max(minSize, Math.min(100 - cropStart.x, cropStart.width + deltaX));
                newCrop.height = cropStart.height - (newCrop.y - cropStart.y);
                break;
            case 'sw':
                newCrop.x = Math.max(0, Math.min(cropStart.x + cropStart.width - minSize, cropStart.x + deltaX));
                newCrop.width = cropStart.width - (newCrop.x - cropStart.x);
                newCrop.height = Math.max(minSize, Math.min(100 - cropStart.y, cropStart.height + deltaY));
                break;
            case 'se':
                newCrop.width = Math.max(minSize, Math.min(100 - cropStart.x, cropStart.width + deltaX));
                newCrop.height = Math.max(minSize, Math.min(100 - cropStart.y, cropStart.height + deltaY));
                break;
            case 'n':
                newCrop.y = Math.max(0, Math.min(cropStart.y + cropStart.height - minSize, cropStart.y + deltaY));
                newCrop.height = cropStart.height - (newCrop.y - cropStart.y);
                break;
            case 's':
                newCrop.height = Math.max(minSize, Math.min(100 - cropStart.y, cropStart.height + deltaY));
                break;
            case 'e':
                newCrop.width = Math.max(minSize, Math.min(100 - cropStart.x, cropStart.width + deltaX));
                break;
            case 'w':
                newCrop.x = Math.max(0, Math.min(cropStart.x + cropStart.width - minSize, cropStart.x + deltaX));
                newCrop.width = cropStart.width - (newCrop.x - cropStart.x);
                break;
        }

        setCropArea(newCrop);
    }, [isDragging, dragType, dragStart, cropStart, imageSize, scale]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragType(null);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const crop = () => {
        if (!file || !preview) return;
        setStatus('processing');

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const actualX = (cropArea.x / 100) * img.width;
            const actualY = (cropArea.y / 100) * img.height;
            const actualWidth = (cropArea.width / 100) * img.width;
            const actualHeight = (cropArea.height / 100) * img.height;

            canvas.width = actualWidth;
            canvas.height = actualHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, actualX, actualY, actualWidth, actualHeight, 0, 0, actualWidth, actualHeight);

            setCroppedUrl(canvas.toDataURL(file.type || 'image/png'));
            setStatus('success');
        };
        img.src = preview;
    };

    const resetCrop = () => {
        setCropArea({ x: 10, y: 10, width: 80, height: 80 });
    };

    const absoluteCrop = getAbsoluteCropArea();

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Image Cropper</h1>
                <p className="text-slate-500 text-lg">Drag corners to crop your images - just like Canva!</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-3xl">
                        <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <Crop size={32} className="text-orange-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl cursor-pointer"
                        >
                            Select Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                        <p className="text-slate-400 mt-4 text-sm">Upload an image and drag corners to crop</p>
                    </div>
                ) : status === 'success' ? (
                    <div className="space-y-8">
                        <div className="text-center">
                            <p className="text-sm font-bold text-emerald-600 mb-4">✓ Cropped Successfully!</p>
                            <div className="rounded-xl overflow-hidden bg-slate-100 p-4 inline-block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={croppedUrl} alt="Cropped" className="max-w-full max-h-[400px] rounded-lg" />
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <a href={croppedUrl} download="cropped-image" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center gap-3 cursor-pointer">
                                <Download size={20} /> Download
                            </a>
                            <button onClick={() => setStatus('idle')} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-bold cursor-pointer">Crop Again</button>
                            <button onClick={() => { setFile(null); setStatus('idle'); }} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-bold cursor-pointer">New Image</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Crop Preview Area */}
                        <div
                            ref={containerRef}
                            className="relative bg-slate-900 rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center"
                            style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                        >
                            {/* Image */}
                            <div className="relative" style={{ width: imageSize.width * scale, height: imageSize.height * scale }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={imageRef}
                                    src={preview}
                                    alt="Preview"
                                    onLoad={handleImageLoad}
                                    className="block"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    draggable={false}
                                />

                                {/* Dark overlay outside crop area */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Top */}
                                    <div
                                        className="absolute left-0 right-0 top-0 bg-black/60"
                                        style={{ height: `${cropArea.y}%` }}
                                    />
                                    {/* Bottom */}
                                    <div
                                        className="absolute left-0 right-0 bottom-0 bg-black/60"
                                        style={{ height: `${100 - cropArea.y - cropArea.height}%` }}
                                    />
                                    {/* Left */}
                                    <div
                                        className="absolute left-0 bg-black/60"
                                        style={{
                                            top: `${cropArea.y}%`,
                                            width: `${cropArea.x}%`,
                                            height: `${cropArea.height}%`
                                        }}
                                    />
                                    {/* Right */}
                                    <div
                                        className="absolute right-0 bg-black/60"
                                        style={{
                                            top: `${cropArea.y}%`,
                                            width: `${100 - cropArea.x - cropArea.width}%`,
                                            height: `${cropArea.height}%`
                                        }}
                                    />
                                </div>

                                {/* Crop Selection Box */}
                                <div
                                    className="absolute border-2 border-white shadow-lg"
                                    style={{
                                        left: `${cropArea.x}%`,
                                        top: `${cropArea.y}%`,
                                        width: `${cropArea.width}%`,
                                        height: `${cropArea.height}%`,
                                    }}
                                >
                                    {/* Move handle - center */}
                                    <div
                                        className="absolute inset-0 cursor-move"
                                        onMouseDown={(e) => handleMouseDown(e, 'move')}
                                    />

                                    {/* Grid lines */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                                        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
                                    </div>

                                    {/* Corner handles */}
                                    <div
                                        className="absolute -top-2 -left-2 w-5 h-5 bg-white border-2 border-orange-500 rounded-sm cursor-nw-resize shadow-md"
                                        onMouseDown={(e) => handleMouseDown(e, 'nw')}
                                    />
                                    <div
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-white border-2 border-orange-500 rounded-sm cursor-ne-resize shadow-md"
                                        onMouseDown={(e) => handleMouseDown(e, 'ne')}
                                    />
                                    <div
                                        className="absolute -bottom-2 -left-2 w-5 h-5 bg-white border-2 border-orange-500 rounded-sm cursor-sw-resize shadow-md"
                                        onMouseDown={(e) => handleMouseDown(e, 'sw')}
                                    />
                                    <div
                                        className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-orange-500 rounded-sm cursor-se-resize shadow-md"
                                        onMouseDown={(e) => handleMouseDown(e, 'se')}
                                    />

                                    {/* Edge handles */}
                                    <div
                                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border border-orange-500 rounded-sm cursor-n-resize shadow-md"
                                        onMouseDown={(e) => handleMouseDown(e, 'n')}
                                    />
                                    <div
                                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border border-orange-500 rounded-sm cursor-s-resize shadow-md"
                                        onMouseDown={(e) => handleMouseDown(e, 's')}
                                    />
                                    <div
                                        className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-8 bg-white border border-orange-500 rounded-sm cursor-w-resize shadow-md"
                                        onMouseDown={(e) => handleMouseDown(e, 'w')}
                                    />
                                    <div
                                        className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-8 bg-white border border-orange-500 rounded-sm cursor-e-resize shadow-md"
                                        onMouseDown={(e) => handleMouseDown(e, 'e')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Info & Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="text-sm text-slate-600">
                                <span className="font-bold">Size:</span> {Math.round((cropArea.width / 100) * imageSize.width)} × {Math.round((cropArea.height / 100) * imageSize.height)} px
                            </div>
                            <button
                                onClick={resetCrop}
                                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 cursor-pointer"
                            >
                                <RotateCcw size={16} /> Reset
                            </button>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button onClick={crop} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-orange-600 transition-all shadow-xl flex items-center gap-3 cursor-pointer">
                                <Crop size={20} /> Crop Image
                            </button>
                            <button onClick={() => setFile(null)} className="bg-slate-100 text-slate-600 px-8 py-5 rounded-2xl font-bold cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
