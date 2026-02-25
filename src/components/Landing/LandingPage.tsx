import React from 'react';
import { motion } from 'framer-motion';
import AuthForm from './AuthForm';

const LandingPage = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4">
            {/* Background Layers for Animation */}
            <div className="absolute inset-0 z-0">
                {/* Layer 1: Sky/Mist */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950"
                />

                {/* Layer 2: Distant Mountains (Animated) */}
                <motion.div
                    animate={{ x: [0, -20, 0], y: [0, 5, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 w-[120%] h-1/2 bg-cover bg-bottom opacity-30"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070")' }}
                />

                {/* Layer 3: Pine Forests (Typical of Valle de Angeles) */}
                <motion.div
                    animate={{ x: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 w-[150%] h-[60%] bg-cover bg-bottom opacity-50 contrast-125"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2071")' }}
                />

                {/* Layer 4: Cabins in the Mist */}
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-cover bg-center opacity-40 mix-blend-screen"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2070")' }}
                />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                <div className="flex-1 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
                                <i className="fa-solid fa-microchip text-2xl text-white"></i>
                            </div>
                            <span className="text-white font-black tracking-widest uppercase text-xs">AI Real Estate Studio</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                            Diseña el futuro en <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Valle de Ángeles</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/60 font-medium max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                            Potencia tus proyectos inmobiliarios con inteligencia artificial generativa. Visualización 3D fotorrealista, análisis financiero y diseño eco-turístico en segundos.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <p className="text-white font-bold text-sm">+500 Arquitectos</p>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">Ya están diseñando</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="shrink-0"
                >
                    <AuthForm />
                </motion.div>
            </div>

            {/* Interactive Particle Effect (Subtle) */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [-20, 20, -20],
                            x: [-10, 10, -10],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
