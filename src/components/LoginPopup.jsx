"use client";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPopup({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-md bg-[#0F0F12] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Top Bar */}
                        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all z-10 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                                    {isLogin ? 'Welcome Back' : 'Get Started'}
                                </h2>
                                <p className="text-zinc-400">
                                    {isLogin
                                        ? 'Access your tools and manage your assets'
                                        : 'Create your account to unlock full access'}
                                </p>
                            </div>

                            {/* Social Login Buttons (Optional enhancement for "proper design") */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer">
                                    <Github size={18} />
                                    <span>Github</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer">
                                    <Chrome size={18} />
                                    <span>Google</span>
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#0F0F12] text-zinc-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Form */}
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                {!isLogin && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full bg-[#1A1A1E] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#202025] transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="w-full bg-[#1A1A1E] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#202025] transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-[#1A1A1E] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#202025] transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {isLogin && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline cursor-pointer">
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2 cursor-pointer">
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-zinc-500 text-sm font-medium">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="ml-2 text-white font-bold hover:text-blue-400 transition-colors cursor-pointer"
                                    >
                                        {isLogin ? 'Sign Up' : 'Log In'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
