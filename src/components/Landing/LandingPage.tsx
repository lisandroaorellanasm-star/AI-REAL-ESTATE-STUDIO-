import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthForm from './AuthForm';
import LandingMap from './LandingMap';
import { useStore } from '@/src/store';

const LandingPage = () => {
    const { setActiveLotId } = useStore();

    useEffect(() => {
        const handleSelectProject = (e: any) => {
            const lotId = e.detail;
            setActiveLotId(lotId);
            // Scroll to HERO/Login
            const hero = document.getElementById('hero');
            if (hero) {
                hero.scrollIntoView({ behavior: 'smooth' });
            }
        };

        document.addEventListener('select-project', handleSelectProject);
        return () => document.removeEventListener('select-project', handleSelectProject);
    }, [setActiveLotId]);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-950 text-white selection:bg-purple-500/30">
            {/* Parallax Background - Fixed */}
            <div className="fixed inset-0 z-0">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950"
                />
                <motion.div
                    animate={{ x: [0, -20, 0], y: [0, 5, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 w-[120%] h-1/2 bg-cover bg-bottom opacity-30"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070")' }}
                />
                <motion.div
                    animate={{ x: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 w-[150%] h-[60%] bg-cover bg-bottom opacity-50 contrast-125"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2071")' }}
                />
            </div>

            {/* Hero Section */}
            <div id="hero" className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10">
                <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-8 backdrop-blur-md">
                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <i className="fa-solid fa-mountain-sun text-lg text-white"></i>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Eco-Intelligence Studio</span>
                            </div>

                            <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                                <span className="block italic font-light text-purple-400">Diseña el</span>
                                <span className="block">Futuro Eco</span>
                            </h1>

                            <p className="text-xl text-white/50 max-w-xl mb-10 leading-relaxed font-medium">
                                Transforma terrenos vírgenes en visiones arquitectónicas sostenibles con el poder de la Inteligencia Artificial.
                            </p>

                            <div className="flex items-center gap-8 text-white/30 text-xs font-bold uppercase tracking-widest border-t border-white/5 pt-8">
                                <div><span className="block text-white text-lg">Honduras</span>Ubicación</div>
                                <div><span className="block text-white text-lg">8K</span>Renderizado</div>
                                <div><span className="block text-white text-lg">AI</span>Motor Generativo</div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full max-w-md"
                    >
                        <AuthForm />
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-20 text-white/20 text-2xl"
                >
                    <i className="fa-solid fa-chevron-down"></i>
                </motion.div>
            </div>

            {/* Projects Section (Mountain Lots) */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center lg:text-left"
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Proyectos de Montaña</h2>
                    <p className="text-white/40 max-w-2xl text-lg font-medium">
                        Explora los terrenos exclusivos listos para ser transformados en Valle de Ángeles.
                        Cabañas sustentables, piscinas infinitas y naturaleza pura.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Lote 1 */}
                    <ProjectCard
                        id="lote1"
                        title="El Refugio Forestal"
                        lot="Lote 1"
                        area="2,762.75 m²"
                        img="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1000"
                        tag="Residencial"
                    />

                    {/* Lote 2 */}
                    <ProjectCard
                        id="lote2"
                        title="La Gran Reserva"
                        lot="Lote 2"
                        area="6,165.16 m²"
                        img="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000"
                        tag="Turístico"
                        delay={0.2}
                    />

                    {/* Lote 3 */}
                    <ProjectCard
                        id="lote3"
                        title="Altos del Pino"
                        lot="Lote 3"
                        area="4,266.26 m²"
                        img="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"
                        tag="Sostenible"
                        delay={0.4}
                    />
                </div>
            </section>

            {/* Strategic Map Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
                <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center lg:text-left"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Localización Estratégica</h2>
                        <p className="text-white/40 max-w-xl text-lg font-medium">
                            Nuestra expansión se centra en zonas de alta plusvalía y baja densidad demográfica,
                            asegurando la privacidad y la preservación del ecosistema.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10"
                    >
                        <div className="text-right">
                            <p className="text-white font-black text-sm tracking-tight text-purple-400">Valle de Ángeles</p>
                            <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Sede Principal</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <i className="fa-solid fa-map-pin text-white"></i>
                        </div>
                    </motion.div>
                </div>

                <LandingMap />
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-20 border-t border-white/5 text-center">
                <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em]">
                    AI Real Estate Studio © 2026 • Valle de Ángeles, Honduras
                </p>
            </footer>
        </div>
    );
};

const ProjectCard = ({ id, title, lot, area, img, tag, delay = 0 }: any) => {
    const handleClick = () => {
        document.dispatchEvent(new CustomEvent('select-project', { detail: id }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            onClick={handleClick}
            className="group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 active:scale-[0.98] transition-all cursor-pointer shadow-2xl"
        >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${img})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10">
                    {tag}
                </span>
                <span className="bg-purple-600/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10">
                    AI Ready
                </span>
            </div>

            <div className="absolute bottom-10 left-10 right-10">
                <p className="text-purple-400 font-black text-xs uppercase tracking-widest mb-2">{lot}</p>
                <h3 className="text-3xl font-black mb-4 leading-none tracking-tighter">{title}</h3>
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <div className="text-white/40 text-xs font-bold uppercase overflow-hidden">
                        <span className="block text-white text-lg leading-none mb-1 font-black">{area}</span>
                        Superficie Total
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-purple-500 transition-colors shadow-xl">
                        <i className="fa-solid fa-arrow-right text-slate-950 group-hover:text-white transition-colors"></i>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LandingPage;
