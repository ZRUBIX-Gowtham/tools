"use client";
import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Download,
    Upload,
    Type,
    Palette,
    Image as ImageIcon,
    RotateCcw,
    Layout,
    Layers,
    X,
    Check,
    Plus,
    Trash2,
    Move,
    Maximize2,
    Settings,
    ChevronLeft,
    ChevronRight,
    Type as TypeIcon,
    Undo2,
    Redo2,
    ZoomIn,
    ZoomOut,
    Eye,
    Shapes,
    Sparkles,
    MousePointer2,
    Copy,
    ClipboardPaste,
    Hand,
    MousePointer,
    ArrowUp,
    ArrowDown,
    Share2,
    Lock,
    Unlock,
    FileImage,
    Keyboard,
    Star,
    Triangle,
    Hexagon,
    BoxSelect
} from 'lucide-react';
import { toPng, toJpeg, toBlob, toCanvas } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';

const SHAPE_CLIPS = {
    rect: 'none',
    circle: 'none', // Uses border-radius
    triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    prism: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
};


import { PRESET_TEMPLATES } from './templates';

const RESIZE_HANDLES = [
    { pos: 'tl', cursor: 'nwse-resize', style: { top: -6, left: -6 } },
    { pos: 'tr', cursor: 'nesw-resize', style: { top: -6, right: -6 } },
    { pos: 'bl', cursor: 'nesw-resize', style: { bottom: -6, left: -6 } },
    { pos: 'br', cursor: 'nwse-resize', style: { bottom: -6, right: -6 } },
    { pos: 't', cursor: 'ns-resize', style: { top: -6, left: '50%', transform: 'translateX(-50%)' } },
    { pos: 'b', cursor: 'ns-resize', style: { bottom: -6, left: '50%', transform: 'translateX(-50%)' } },
    { pos: 'l', cursor: 'ew-resize', style: { left: -6, top: '50%', transform: 'translateY(-50%)' } },
    { pos: 'r', cursor: 'ew-resize', style: { right: -6, top: '50%', transform: 'translateY(-50%)' } },
];

export default function CanvasStudio() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading Canvas Studio...</div>}>
            <CanvasStudioContent />
        </Suspense>
    );
}

function CanvasStudioContent() {
    const [viewMode, setViewMode] = useState('templates');
    const [canvasData, setCanvasData] = useState({ bg: '#000000', boxes: [], aspectRatio: 'aspect-[3/4]', width: 600, height: 800 });
    const [selectedBoxId, setSelectedBoxId] = useState(null);
    const [multiSelectedIds, setMultiSelectedIds] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
    const [pendingShapeType, setPendingShapeType] = useState(null);
    const [isAddingShape, setIsAddingShape] = useState(false);
    const [contentUpdateTargetId, setContentUpdateTargetId] = useState(null);
    const [activeTab, setActiveTab] = useState('add');
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

    // Zoom & Pan
    const [zoom, setZoom] = useState(0.5);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // History & Clipboard
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [clipboard, setClipboard] = useState(null);

    // Pinch to Zoom
    const [initialPinchDist, setInitialPinchDist] = useState(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    const viewportRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const shapeInputRef = useRef(null);

    const saveToHistory = useCallback((data) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(data)));
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const handleSelectTemplate = (template) => {
        if (!template) {
            window.open('/editing/canvas-studio?id=scratch', '_blank');
            return;
        }
        window.open(`/editing/canvas-studio?id=${template.id}`, '_blank');
    };

    useEffect(() => {
        const id = searchParams.get('id');
        if (id && viewMode === 'templates') {
            let initialData;
            if (id === 'scratch') {
                initialData = {
                    bg: '#141414',
                    boxes: [],
                    aspectRatio: 'custom',
                    width: 800,
                    height: 800
                };
            } else {
                const template = PRESET_TEMPLATES.find(t => t.id === id);
                if (template) {
                    const w = template.aspectRatio === 'aspect-square' ? 800 : (template.aspectRatio === 'aspect-[3/4]' ? 600 : 800);
                    const h = template.aspectRatio === 'aspect-square' ? 800 : (template.aspectRatio === 'aspect-[3/4]' ? 800 : 450);
                    initialData = {
                        bg: template.bg,
                        boxes: JSON.parse(JSON.stringify(template.boxes.map(b => ({ ...b, borderRadius: b.borderRadius || 0, locked: false })))),
                        aspectRatio: template.aspectRatio,
                        width: w,
                        height: h
                    };
                }
            }

            if (initialData) {
                setCanvasData(initialData);
                setHistory([JSON.parse(JSON.stringify(initialData))]);
                setHistoryIndex(0);
                setViewMode('editor');
            }
        }
    }, [searchParams, viewMode]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const prev = history[historyIndex - 1];
            setCanvasData(JSON.parse(JSON.stringify(prev)));
            setHistoryIndex(historyIndex - 1);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const next = history[historyIndex + 1];
            setCanvasData(JSON.parse(JSON.stringify(next)));
            setHistoryIndex(historyIndex + 1);
        }
    }, [history, historyIndex]);

    const handleBoxUpdate = (id, updates, commit = true) => {
        setCanvasData(prev => {
            const newData = {
                ...prev,
                boxes: prev.boxes.map(box => box.id === id ? { ...box, ...updates } : box)
            };
            if (commit) saveToHistory(newData);
            return newData;
        });
    };

    const handleBoxesUpdate = (updatesMap, commit = true) => {
        setCanvasData(prev => {
            const newData = {
                ...prev,
                boxes: prev.boxes.map(box => updatesMap[box.id] ? { ...box, ...updatesMap[box.id] } : box)
            };
            if (commit) saveToHistory(newData);
            return newData;
        });
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    if (e.shiftKey) redo(); else undo();
                } else if (e.key === 'Z') {
                    e.preventDefault();
                    redo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    redo();
                } else if (e.key === 'c' && selectedBoxId) {
                    const box = canvasData.boxes.find(b => b.id === selectedBoxId);
                    if (box) setClipboard(JSON.parse(JSON.stringify(box)));
                } else if (e.key === 'v' && clipboard) {
                    const id = `copy-${Date.now()}`;
                    const newBox = { ...clipboard, id, x: clipboard.x + 20, y: clipboard.y + 20 };
                    const newData = { ...canvasData, boxes: [...canvasData.boxes, newBox] };
                    setCanvasData(newData);
                    saveToHistory(newData);
                    setSelectedBoxId(id);
                    setMultiSelectedIds([]);
                }
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (multiSelectedIds.length > 0) {
                    const newData = { ...canvasData, boxes: canvasData.boxes.filter(box => !multiSelectedIds.includes(box.id)) };
                    setCanvasData(newData);
                    saveToHistory(newData);
                    setMultiSelectedIds([]);
                    setSelectedBoxId(null);
                } else if (selectedBoxId) {
                    const newData = { ...canvasData, boxes: canvasData.boxes.filter(box => box.id !== selectedBoxId) };
                    setCanvasData(newData);
                    saveToHistory(newData);
                    setSelectedBoxId(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedBoxId, multiSelectedIds, canvasData, clipboard, undo, redo, saveToHistory]);

    const deleteBox = (id) => {
        setCanvasData(prev => {
            const newData = { ...prev, boxes: prev.boxes.filter(box => box.id !== id) };
            saveToHistory(newData);
            return newData;
        });
        setSelectedBoxId(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && selectedBoxId) {
            const url = URL.createObjectURL(file);
            handleBoxUpdate(selectedBoxId, { content: url });
        }
    };

    const addNewBox = (type, shapeType = 'rect', initialMeta = {}) => {
        const id = `${type}-${Date.now()}`;
        let newBox;
        if (type === 'text') {
            newBox = { id, type: 'text', content: 'NEW TEXT', bg: 'transparent', color: '#ffffff', x: 100, y: 100, width: 250, height: 60, fontSize: 32, fontWeight: '800', textAlign: 'center', borderRadius: 0, locked: false, opacity: 1, letterSpacing: 0, lineHeight: 1.2 };
        } else if (type === 'image') {
            newBox = { id, type: 'image', content: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop', x: 100, y: 100, width: 300, height: 300, borderRadius: 12, locked: false, opacity: 1 };
        } else if (type === 'shape') {
            newBox = { id, type: 'shape', shapeType: shapeType, contentType: 'color', bg: '#3b82f6', content: '', x: 150, y: 150, width: 200, height: 200, borderRadius: 0, locked: false, opacity: 1, fontSize: 32, color: '#ffffff', fontWeight: '900', textAlign: 'center' };
        }
        const newData = { ...canvasData, boxes: [...canvasData.boxes, newBox] };
        setCanvasData(newData);
        saveToHistory(newData);
        setSelectedBoxId(id);
        setIsAddingShape(false);
    };

    const handleShapeImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        if (contentUpdateTargetId) {
            handleBoxUpdate(contentUpdateTargetId, { contentType: 'image', content: url, bg: 'transparent' });
            setContentUpdateTargetId(null);
        } else if (pendingShapeType) {
            addNewBox('shape', pendingShapeType, { content: url, contentType: 'image' });
            setPendingShapeType(null);
        }
        e.target.value = ''; // Reset to allow selecting same file again
    };

    const bringToFront = (id) => {
        const boxes = [...canvasData.boxes];
        const index = boxes.findIndex(b => b.id === id);
        if (index !== -1 && index < boxes.length - 1) {
            const [box] = boxes.splice(index, 1);
            boxes.push(box);
            const newData = { ...canvasData, boxes };
            setCanvasData(newData);
            saveToHistory(newData);
        }
    };

    const sendToBack = (id) => {
        const boxes = [...canvasData.boxes];
        const index = boxes.findIndex(b => b.id === id);
        if (index !== -1 && index > 0) {
            const [box] = boxes.splice(index, 1);
            boxes.unshift(box);
            const newData = { ...canvasData, boxes };
            setCanvasData(newData);
            saveToHistory(newData);
        }
    };

    const handleExport = async (format) => {
        if (!canvasRef.current) return;
        setIsSaving(true);
        const currentSid = selectedBoxId;
        setSelectedBoxId(null);

        try {
            await new Promise(r => setTimeout(r, 300));
            const options = {
                quality: 1,
                pixelRatio: 4,
                backgroundColor: format === 'transparent' ? null : (canvasData.bg || '#000000')
            };

            let dataUrl;
            if (format === 'png' || format === 'transparent') {
                dataUrl = await toPng(canvasRef.current, options);
            } else if (format === 'jpeg') {
                dataUrl = await toJpeg(canvasRef.current, options);
            } else if (format === 'webp') {
                const canvas = await toCanvas(canvasRef.current, options);
                dataUrl = canvas.toDataURL('image/webp', 1.0);
            } else if (format === 'pdf') {
                const imgData = await toPng(canvasRef.current, options);
                const link = document.createElement('a');
                link.download = `gowtham-design-${Date.now()}.png`;
                link.href = imgData;
                link.click();
                alert('Design exported as PNG. Note: PDF direct export requires jspdf library. Downloaded as high-res PNG instead.');
                return;
            }

            const link = document.createElement('a');
            link.download = `gowtham-design-${Date.now()}.${format === 'transparent' ? 'png' : format}`;
            link.href = dataUrl;
            link.click();
            setIsExportModalOpen(false);
        } catch (err) {
            console.error('Export error', err);
        } finally {
            setSelectedBoxId(currentSid);
            setIsSaving(false);
        }
    };

    const handlePointerDown = (e) => {
        setIsFocused(true);
        const isBackground = e.target === viewportRef.current || e.target === canvasRef.current;
        if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 0 && isBackground)) {
            setIsPanning(true);
            e.target.setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e) => {
        if (isPanning) {
            setPan(p => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
        }
    };

    const handlePointerUp = (e) => {
        setIsPanning(false);
    };

    const activeBox = canvasData.boxes.find(b => b.id === selectedBoxId);

    const renderSidebar = () => {
        if (!activeBox) {
            return (
                <div className="space-y-6">
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-white/10 shadow-xl">
                        <div className="flex items-center gap-2 mb-6">
                            <Plus className="text-blue-500" size={20} />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Add Element</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/5 mb-3">
                            <button onClick={() => addNewBox('text')} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-blue-600/20 rounded-2xl border border-white/5 transition-all text-zinc-400 hover:text-white cursor-pointer group">
                                <TypeIcon size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase">Text</span>
                            </button>
                            <button onClick={() => addNewBox('image')} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-blue-600/20 rounded-2xl border border-white/5 transition-all text-zinc-400 hover:text-white cursor-pointer group">
                                <ImageIcon size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase">Image</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {!isAddingShape ? (
                                <button onClick={() => setIsAddingShape(true)} className="flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-blue-600/20 rounded-2xl border border-white/5 transition-all text-zinc-400 hover:text-white cursor-pointer group">
                                    <Shapes size={20} className="group-hover:rotate-12 transition-transform" />
                                    <span className="text-[10px] font-black uppercase">Add Magic Shape</span>
                                </button>
                            ) : (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Select Shape</span>
                                        <button onClick={() => setIsAddingShape(false)} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase cursor-pointer">Cancel</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'rect', icon: <div className="w-5 h-5 border-2 border-current rounded-sm" />, label: 'Box' },
                                            { id: 'circle', icon: <div className="w-5 h-5 border-2 border-current rounded-full" />, label: 'Circle' },
                                            { id: 'triangle', icon: <Triangle size={18} />, label: 'Tri' },
                                            { id: 'star', icon: <Star size={18} />, label: 'Star' },
                                            { id: 'hexagon', icon: <Hexagon size={18} />, label: 'Hex' },
                                            { id: 'pentagon', icon: <div className="w-5 h-5" style={{ clipPath: SHAPE_CLIPS.pentagon, backgroundColor: 'currentColor' }} />, label: 'Pent' },
                                        ].map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => addNewBox('shape', s.id)}
                                                className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-blue-600 rounded-xl border border-white/10 transition-all text-zinc-400 hover:text-white cursor-pointer group"
                                            >
                                                {s.icon}
                                                <span className="text-[8px] font-black uppercase tracking-tighter">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-zinc-500 text-center font-bold">Select a shape to place it on the canvas</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-3xl p-6 border border-white/10 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Palette className="text-blue-500" size={20} />
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">Canvas</h2>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-xs font-bold text-zinc-400 uppercase">Background</span>
                                <input
                                    type="color"
                                    value={canvasData.bg || '#000000'}
                                    onChange={(e) => {
                                        const newData = { ...canvasData, bg: e.target.value };
                                        setCanvasData(newData);
                                        saveToHistory(newData);
                                    }}
                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase">Width (px)</label>
                                    <input
                                        type="number"
                                        value={canvasData.width || 800}
                                        onChange={(e) => {
                                            const newData = { ...canvasData, width: parseInt(e.target.value) || 1, aspectRatio: 'custom' };
                                            setCanvasData(newData);
                                            saveToHistory(newData);
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase">Height (px)</label>
                                    <input
                                        type="number"
                                        value={canvasData.height || 800}
                                        onChange={(e) => {
                                            const newData = { ...canvasData, height: parseInt(e.target.value) || 1, aspectRatio: 'custom' };
                                            setCanvasData(newData);
                                            saveToHistory(newData);
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="bg-zinc-900 rounded-3xl p-6 border border-blue-500/30 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <MousePointer2 className="text-blue-500" size={18} />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest">Element Settings</h2>
                        </div>
                        <button onClick={() => setSelectedBoxId(null)} className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {activeBox.type === 'text' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase">Text</label>
                                    <textarea
                                        value={activeBox.content || ''}
                                        onChange={(e) => handleBoxUpdate(activeBox.id, { content: e.target.value })}
                                        className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase">Size</label>
                                        <input
                                            type="number" value={activeBox.fontSize || 16}
                                            onChange={(e) => handleBoxUpdate(activeBox.id, { fontSize: parseInt(e.target.value) || 1 })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase">Color</label>
                                        <input
                                            type="color" value={activeBox.color || '#ffffff'}
                                            onChange={(e) => handleBoxUpdate(activeBox.id, { color: e.target.value })}
                                            className="w-full h-[46px] bg-black/40 border border-white/10 rounded-xl cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid grid-cols-2 gap-3 text-center">
                                        <button onClick={() => handleBoxUpdate(activeBox.id, { fontWeight: activeBox.fontWeight === '900' ? '400' : '900' })} className={`p-3 rounded-xl border ${activeBox.fontWeight === '900' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-zinc-500'} font-black text-sm transition-all cursor-pointer`}>BOLD</button>
                                        <button onClick={() => handleBoxUpdate(activeBox.id, { textAlign: activeBox.textAlign === 'center' ? 'left' : (activeBox.textAlign === 'left' ? 'right' : 'center') })} className="p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-500 hover:text-white text-sm font-black transition-all cursor-pointer">ALIGN</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase">Spacing</label>
                                            <input
                                                type="number" value={activeBox.letterSpacing || 0}
                                                onChange={(e) => handleBoxUpdate(activeBox.id, { letterSpacing: parseFloat(e.target.value) || 0 })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase">Line H</label>
                                            <input
                                                type="number" step="0.1" value={activeBox.lineHeight || 1.2}
                                                onChange={(e) => handleBoxUpdate(activeBox.id, { lineHeight: parseFloat(e.target.value) || 1 })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase">Background Color</label>
                                    <input
                                        type="color" value={activeBox.bg || '#000000'}
                                        onChange={(e) => handleBoxUpdate(activeBox.id, { bg: e.target.value })}
                                        className="w-full h-[46px] bg-black/40 border border-white/10 rounded-xl cursor-pointer"
                                    />
                                </div>
                            </>
                        )}

                        {activeBox.type === 'shape' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'rect', icon: <div className="w-5 h-5 border-2 border-current rounded-sm" />, label: 'Box' },
                                        { id: 'circle', icon: <div className="w-5 h-5 border-2 border-current rounded-full" />, label: 'Circle' },
                                        { id: 'triangle', icon: <Triangle size={16} />, label: 'Tri' },
                                        { id: 'star', icon: <Star size={16} />, label: 'Star' },
                                        { id: 'hexagon', icon: <Hexagon size={16} />, label: 'Hex' },
                                        { id: 'pentagon', icon: <div className="w-5 h-5" style={{ clipPath: SHAPE_CLIPS.pentagon, backgroundColor: 'currentColor' }} />, label: 'Pent' },
                                    ].map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleBoxUpdate(activeBox.id, { shapeType: s.id })}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${activeBox.shapeType === s.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-zinc-500'} cursor-pointer`}
                                        >
                                            {s.icon}
                                            <span className="text-[8px] font-black uppercase">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase">Fill Color / Background</label>
                                    <input
                                        type="color" value={activeBox.bg || '#3b82f6'}
                                        onChange={(e) => handleBoxUpdate(activeBox.id, { bg: e.target.value })}
                                        className="w-full h-12 bg-black/40 border border-white/10 rounded-xl cursor-pointer"
                                    />
                                </div>

                                <div className="pt-4 border-t border-white/10 space-y-4">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase">Insert Content</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                setContentUpdateTargetId(activeBox.id);
                                                shapeInputRef.current?.click();
                                            }}
                                            className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-blue-600/20 rounded-xl border border-white/5 text-zinc-400 hover:text-white cursor-pointer transition-all group shadow-lg shadow-black/20"
                                        >
                                            <ImageIcon size={16} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black uppercase">Image</span>
                                        </button>
                                        <button
                                            onClick={() => handleBoxUpdate(activeBox.id, { contentType: 'text', content: activeBox.content || 'NEW TEXT', bg: '#3b82f6' })}
                                            className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-blue-600/20 rounded-xl border border-white/5 text-zinc-400 hover:text-white cursor-pointer transition-all group shadow-lg shadow-black/20"
                                        >
                                            <TypeIcon size={16} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black uppercase">Text</span>
                                        </button>
                                    </div>

                                    {activeBox.contentType === 'text' && (
                                        <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2">
                                            <textarea
                                                value={activeBox.content || ''}
                                                onChange={(e) => handleBoxUpdate(activeBox.id, { content: e.target.value })}
                                                className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                                                placeholder="Type inside shape..."
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase">Size</label>
                                                    <input
                                                        type="number" value={activeBox.fontSize || 16}
                                                        onChange={(e) => handleBoxUpdate(activeBox.id, { fontSize: parseInt(e.target.value) || 12 })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase">Color</label>
                                                    <input
                                                        type="color" value={activeBox.color || '#ffffff'}
                                                        onChange={(e) => handleBoxUpdate(activeBox.id, { color: e.target.value })}
                                                        className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeBox.contentType === 'image' && (
                                        <div
                                            onClick={() => {
                                                setContentUpdateTargetId(activeBox.id);
                                                shapeInputRef.current?.click();
                                            }}
                                            className="p-4 border border-blue-500/30 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 cursor-pointer text-center group transition-all"
                                        >
                                            <Upload className="mx-auto text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={16} />
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Replace Mask Image</span>
                                        </div>
                                    )}

                                    {activeBox.contentType && activeBox.contentType !== 'color' && (
                                        <button
                                            onClick={() => handleBoxUpdate(activeBox.id, { contentType: 'color', content: '', bg: '#3b82f6' })}
                                            className="w-full py-2 text-[8px] font-black text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors"
                                        >
                                            Clear Content
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeBox.type === 'image' && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="p-8 border-2 border-dashed border-blue-500/30 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 cursor-pointer text-center group transition-all"
                            >
                                <Upload className="mx-auto text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
                                <span className="text-[10px] font-black text-white uppercase">Replace Photo</span>
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase">Opacity: {Math.round((activeBox.opacity || 1) * 100)}%</label>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={activeBox.opacity || 1}
                                onChange={(e) => handleBoxUpdate(activeBox.id, { opacity: parseFloat(e.target.value) })}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase">Border Radius: {activeBox.borderRadius || 0}px</label>
                            <input
                                type="range" min="0" max="100"
                                value={activeBox.borderRadius || 0}
                                onChange={(e) => handleBoxUpdate(activeBox.id, { borderRadius: parseInt(e.target.value) || 0 })}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                            <button onClick={() => bringToFront(activeBox.id)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase flex flex-col items-center gap-1 transition-all cursor-pointer">
                                <Layers size={14} className="text-blue-500" /> Front
                            </button>
                            <button onClick={() => sendToBack(activeBox.id)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase flex flex-col items-center gap-1 transition-all cursor-pointer">
                                <Layers size={14} className="text-zinc-500 rotate-180" /> Back
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleBoxUpdate(activeBox.id, { locked: !activeBox.locked })}
                                className={`flex-1 py-3 ${activeBox.locked ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-white'} rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer`}
                            >
                                {activeBox.locked ? <Lock size={14} /> : <Unlock size={14} />}
                                {activeBox.locked ? 'Unlock' : 'Lock'}
                            </button>
                            <button
                                onClick={() => deleteBox(activeBox.id)}
                                className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                            <button
                                onClick={() => {
                                    setClipboard(JSON.parse(JSON.stringify(activeBox)));
                                }}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Copy size={14} /> Copy
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="max-w-[1700px] mx-auto px-6 pt-15 pb-20">

                <AnimatePresence>
                    {isShortcutsOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[1001] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md"
                            onClick={() => setIsShortcutsOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black uppercase text-white tracking-widest flex items-center gap-3">
                                        <Keyboard size={24} className="text-blue-500" />
                                        Shortcuts
                                    </h2>
                                    <button onClick={() => setIsShortcutsOpen(false)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"><X size={18} /></button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { keys: ['Ctrl', 'Z'], desc: 'Undo ACTION' },
                                        { keys: ['Ctrl', 'Y'], desc: 'Redo ACTION' },
                                        { keys: ['Ctrl', 'C'], desc: 'Copy ELEMENT' },
                                        { keys: ['Ctrl', 'V'], desc: 'Paste ELEMENT' },
                                        { keys: ['Del'], desc: 'Delete SELECTED' },
                                        { keys: ['Shift', 'Click'], desc: 'Multi-SELECT' },
                                        { keys: ['Alt', 'Drag'], desc: 'Pan CANVAS' },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.desc}</span>
                                            <div className="flex gap-1">
                                                {s.keys.map((k, ki) => (
                                                    <span key={ki} className="px-2 py-1 bg-zinc-800 border border-white/10 rounded-lg text-[10px] font-black text-white min-w-[30px] text-center">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isExportModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-zinc-950/90 backdrop-blur-2xl"
                            onClick={() => setIsExportModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="bg-zinc-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-xl shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black uppercase text-white tracking-widest">Download Design</h2>
                                    <button onClick={() => setIsExportModalOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"><X size={20} /></button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'png', name: 'Standard PNG', icon: <ImageIcon size={20} />, desc: 'High Quality PNG' },
                                        { id: 'jpeg', name: 'JPEG Image', icon: <FileImage size={20} />, desc: 'Compressed Web Image' },
                                        { id: 'webp', name: 'WebP Format', icon: <Sparkles size={20} />, desc: 'Next-gen Web Format' },
                                        { id: 'transparent', name: 'Transparent', icon: <Layout size={20} />, desc: 'No background' },
                                        { id: 'pdf', name: 'PDF Document', icon: <Download size={20} />, desc: 'Print Ready File' }
                                    ].map((fmt) => (
                                        <button
                                            key={fmt.id}
                                            onClick={() => handleExport(fmt.id)}
                                            className="flex flex-col gap-3 p-6 bg-white/5 border border-white/5 hover:border-blue-500 hover:bg-blue-500/10 rounded-[2rem] transition-all text-left group cursor-pointer"
                                        >
                                            <div className="p-3 bg-white/5 rounded-xl text-blue-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all w-fit">
                                                {fmt.icon}
                                            </div>
                                            <div>
                                                <p className="text-white font-black uppercase text-xs tracking-widest">{fmt.name}</p>
                                                <p className="text-zinc-500 text-[10px] font-bold mt-1 group-hover:text-zinc-400">{fmt.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {isSaving && (
                                    <div className="mt-8 p-6 bg-blue-600/10 rounded-2xl flex items-center justify-center gap-4 text-blue-500 font-bold uppercase text-xs">
                                        <RotateCcw className="animate-spin" size={20} />
                                        Processing Design...
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {viewMode === 'templates' ? (
                        <motion.div key="templates" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-16">
                            <div className="text-center max-w-3xl mx-auto">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                                    <Sparkles className="text-blue-400" size={14} />
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Ready to Design</span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">Canvas <br /><span className="text-zinc-600">Studio</span></h1>
                                <p className="text-zinc-500 text-xl font-medium">Select a frame to begin. Drag, resize, and style anything.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                <button onClick={() => handleSelectTemplate(null)} className="group bg-zinc-900/40 rounded-[3rem] border border-dashed border-blue-500/30 p-8 hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover:shadow-2xl">
                                    <div className="w-full aspect-square bg-zinc-950/50 rounded-[2rem] mb-8 overflow-hidden relative border border-white/5 flex flex-col items-center justify-center p-6 gap-4">
                                        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                                            <Plus className="text-blue-400" size={40} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-black uppercase tracking-widest text-sm mb-1">Blank Canvas</p>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Start from scratch</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-2xl font-black uppercase text-white tracking-tight">New Design</h3>
                                        <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600 transition-colors"><ChevronRight size={20} /></div>
                                    </div>
                                </button>

                                {PRESET_TEMPLATES.map((t) => (
                                    <button key={t.id} onClick={() => handleSelectTemplate(t)} className="group bg-zinc-900/40 rounded-[3rem] border border-white/5 p-8 hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover:shadow-2xl">
                                        <div className="w-full aspect-square bg-zinc-950 rounded-[2rem] mb-8 overflow-hidden relative border border-white/5 flex items-center justify-center p-6">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={t.thumbnail} alt={t.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-2xl font-black uppercase text-white tracking-tight">{t.name}</h3>
                                            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600 transition-colors"><ChevronRight size={20} /></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div key="editor" className="grid grid-cols-1 lg:grid-cols-12 gap-10" onClick={() => setIsFocused(false)}>
                            <div className="lg:col-span-3 lg:sticky lg:top-8 lg:max-h-[85vh] lg:overflow-y-auto pr-2 custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                                {renderSidebar()}
                            </div>

                            <div className="lg:col-span-9 flex flex-col gap-6" onClick={(e) => { e.stopPropagation(); setIsFocused(true); }}>
                                {/* Global Action Toolbar (Outside Viewport) */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setViewMode('templates')}
                                            className="px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 transition-all flex items-center gap-3 cursor-pointer group shadow-xl"
                                        >
                                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                            <span>Library</span>
                                        </button>

                                        <div className="w-[1px] h-8 bg-white/10 mx-2" />

                                        <div className="flex gap-1 p-1 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl">
                                            <button onClick={undo} disabled={historyIndex <= 0} className="p-3 text-white hover:bg-blue-600 rounded-xl disabled:opacity-20 cursor-pointer transition-all"><Undo2 size={18} /></button>
                                            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-3 text-white hover:bg-blue-600 rounded-xl disabled:opacity-20 cursor-pointer transition-all"><Redo2 size={18} /></button>
                                            <button onClick={() => { setZoom(0.5); setPan({ x: 0, y: 0 }); }} className="p-3 text-white hover:bg-zinc-800 rounded-xl cursor-pointer transition-all"><RotateCcw size={18} /></button>
                                            <div className="w-[1px] h-4 bg-white/10 self-center mx-1" />
                                            <button
                                                onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
                                                className={`p-3 rounded-xl cursor-pointer transition-all ${isMultiSelectMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                                title={isMultiSelectMode ? "Multi-Select On" : "Multi-Select Off"}
                                            >
                                                <BoxSelect size={18} />
                                            </button>
                                            <div className="w-[1px] h-4 bg-white/10 self-center mx-1" />
                                            <button onClick={() => setIsShortcutsOpen(true)} className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-all"><Keyboard size={18} /></button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-3 bg-zinc-900 border border-white/10 p-1.5 rounded-2xl items-center shadow-xl">
                                            <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="p-2 text-zinc-400 hover:text-white cursor-pointer hover:bg-white/5 rounded-xl"><ZoomOut size={16} /></button>
                                            <span className="text-[10px] font-black bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
                                            <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-2 text-zinc-400 hover:text-white cursor-pointer hover:bg-white/5 rounded-xl"><ZoomIn size={16} /></button>
                                        </div>
                                        <button
                                            onClick={() => setIsExportModalOpen(true)}
                                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center gap-3 cursor-pointer border border-blue-400/20"
                                        >
                                            <Share2 size={18} />
                                            <span>Share Design</span>
                                        </button>
                                    </div>
                                </div>

                                <div className={`flex flex-col h-[500px] bg-zinc-950 rounded-[4rem] border relative overflow-hidden group/workspace ${isFocused ? 'border-white/20' : 'border-white/5'}`}>
                                    <div
                                        ref={viewportRef}
                                        className={`w-full h-[500px] flex items-center justify-center cursor-default ${isPanning ? 'cursor-grabbing' : ''}`}
                                        style={{ touchAction: 'none' }}
                                        onPointerDown={handlePointerDown}
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={handlePointerUp}
                                    >
                                        <div
                                            style={{
                                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                                transition: isPanning ? 'none' : 'transform 0.1s ease-out'
                                            }}
                                            className="relative origin-center"
                                        >
                                            <div
                                                ref={canvasRef}
                                                style={{
                                                    backgroundColor: canvasData.bg || '#000000',
                                                    width: `${canvasData.width || 800}px`,
                                                    height: `${canvasData.height || 800}px`,
                                                }}
                                                className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] cursor-default overflow-hidden z-10"
                                                onClick={() => { setSelectedBoxId(null); setMultiSelectedIds([]); }}
                                            >
                                                {canvasData.boxes.map((box, index) => {
                                                    const isSelected = selectedBoxId === box.id;
                                                    const isMultiSelected = multiSelectedIds.includes(box.id);

                                                    return (
                                                        <div
                                                            key={box.id}
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{
                                                                position: 'absolute', left: box.x, top: box.y, width: box.width,
                                                                height: box.height,
                                                                zIndex: index, touchAction: 'none',
                                                                cursor: isPanning ? 'grabbing' : (box.locked ? 'default' : 'move'),
                                                            }}
                                                            onPointerDown={(e) => {
                                                                if (e.target.closest('.resize-handle') || isPanning || box.locked) return;
                                                                e.stopPropagation();

                                                                if (e.shiftKey) {
                                                                    setMultiSelectedIds(prev => prev.includes(box.id) ? prev.filter(id => id !== box.id) : [...prev, box.id]);
                                                                    setSelectedBoxId(null);
                                                                } else if (!isMultiSelected) {
                                                                    setSelectedBoxId(box.id);
                                                                    setMultiSelectedIds([]);
                                                                }

                                                                e.target.setPointerCapture(e.pointerId);
                                                                const startX = e.clientX; const startY = e.clientY;
                                                                const moveSet = isMultiSelected ? multiSelectedIds : [box.id];
                                                                const initialPositions = canvasData.boxes.filter(b => moveSet.includes(b.id)).map(b => ({ id: b.id, x: b.x, y: b.y }));
                                                                const onMove = (mv) => {
                                                                    const dx = (mv.clientX - startX) / zoom;
                                                                    const dy = (mv.clientY - startY) / zoom;
                                                                    const updatesMap = {};
                                                                    initialPositions.forEach(pos => { updatesMap[pos.id] = { x: pos.x + dx, y: pos.y + dy }; });
                                                                    handleBoxesUpdate(updatesMap, false);
                                                                };
                                                                const onUp = () => {
                                                                    saveToHistory(canvasData);
                                                                    window.removeEventListener('pointermove', onMove);
                                                                    window.removeEventListener('pointerup', onUp);
                                                                };
                                                                window.addEventListener('pointermove', onMove);
                                                                window.addEventListener('pointerup', onUp);
                                                            }}
                                                        >
                                                            {/* Actual Design Content (Clipped) */}
                                                            <div style={{
                                                                width: '100%', height: '100%',
                                                                backgroundColor: box.bg,
                                                                opacity: box.opacity || 1,
                                                                borderRadius: box.type === 'shape' && box.shapeType === 'circle' ? '50%' : `${box.borderRadius}px`,
                                                                clipPath: box.type === 'shape' ? SHAPE_CLIPS[box.shapeType] || 'none' : 'none',
                                                                overflow: 'hidden',
                                                                display: 'flex', alignItems: 'center', justifyContent: box.textAlign === 'center' ? 'center' : (box.textAlign === 'right' ? 'flex-end' : 'flex-start'),
                                                                padding: box.type === 'text' ? '12px' : '0',
                                                                border: (isSelected || isMultiSelected) ? '2px solid #3b82f6' : 'none',
                                                            }}>
                                                                {box.type === 'image' || (box.type === 'shape' && box.contentType === 'image') ? (
                                                                    // eslint-disable-next-line @next/next/no-img-element
                                                                    <img src={box.content} alt="" className="w-full h-full object-cover pointer-events-none" />
                                                                ) : (box.type === 'text' || (box.type === 'shape' && box.contentType === 'text')) ? (
                                                                    <div
                                                                        className="w-full whitespace-pre-wrap leading-tight pointer-events-none px-4"
                                                                        style={{ color: box.color, fontSize: `${box.fontSize || 16}px`, fontWeight: box.fontWeight, textAlign: box.textAlign, letterSpacing: `${box.letterSpacing || 0}px`, lineHeight: box.lineHeight || 1.2 }}
                                                                    >
                                                                        {box.content}
                                                                    </div>
                                                                ) : null}
                                                            </div>

                                                            {box.locked && <div className="absolute top-2 right-2 p-1 bg-orange-500 rounded-lg shadow-xl text-white z-[200]"><Lock size={12} /></div>}

                                                            {isSelected && !box.locked && (
                                                                <div className="absolute -inset-2 pointer-events-none border border-blue-500 z-[100]">
                                                                    {RESIZE_HANDLES.map(h => (
                                                                        <div
                                                                            key={h.pos}
                                                                            className="resize-handle absolute w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full pointer-events-auto shadow-xl z-[110] hover:scale-110 active:scale-95 transition-transform"
                                                                            style={{ ...h.style, cursor: h.cursor, top: h.style.top === -6 ? -8 : h.style.top, left: h.style.left === -6 ? -8 : h.style.left, right: h.style.right === -6 ? -8 : h.style.right, bottom: h.style.bottom === -6 ? -8 : h.style.bottom }}
                                                                            onPointerDown={(e) => {
                                                                                e.stopPropagation();
                                                                                e.target.setPointerCapture(e.pointerId);
                                                                                const sX = e.clientX; const sY = e.clientY;
                                                                                const startW = box.width; const startH = box.height;
                                                                                const startXP = box.x; const startYP = box.y;

                                                                                const onResizeMove = (mv) => {
                                                                                    const dx = (mv.clientX - sX) / zoom; const dy = (mv.clientY - sY) / zoom;
                                                                                    let updates = {};
                                                                                    if (h.pos.includes('r')) updates.width = Math.max(20, startW + dx);
                                                                                    if (h.pos.includes('l')) { const newW = Math.max(20, startW - dx); updates.width = newW; updates.x = startXP + (startW - newW); }
                                                                                    if (h.pos.includes('b')) updates.height = Math.max(20, startH + dy);
                                                                                    if (h.pos.includes('t')) { const newH = Math.max(20, startH - dy); updates.height = newH; updates.y = startYP + (startH - newH); }
                                                                                    handleBoxUpdate(box.id, updates, false);
                                                                                };
                                                                                const onResizeUp = () => {
                                                                                    saveToHistory(canvasData);
                                                                                    window.removeEventListener('pointermove', onResizeMove);
                                                                                    window.removeEventListener('pointerup', onResizeUp);
                                                                                };
                                                                                window.addEventListener('pointermove', onResizeMove);
                                                                                window.addEventListener('pointerup', onResizeUp);
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="absolute inset-0 pointer-events-none transition-opacity">
                                                {canvasData.boxes.map((box) => (
                                                    (selectedBoxId === box.id || multiSelectedIds.includes(box.id)) && (
                                                        <div key={`ghost-${box.id}`} style={{ position: 'absolute', left: box.x, top: box.y, width: box.width, height: box.height, borderRadius: `${box.borderRadius}px`, opacity: 0.3, border: '1px dashed white' }} />
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                [style*="cursor: move"] { cursor: grab !important; }
                [style*="cursor: move"]:active { cursor: grabbing !important; }
            `}</style>
            <input type="file" ref={shapeInputRef} onChange={handleShapeImageUpload} className="hidden" accept="image/*" />
        </div>
    );
}
