import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { utmToLatLon } from '@/src/utils/coordinates';

const LandingMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: false,
                scrollWheelZoom: false,
                attributionControl: false
            }).setView([14.1130, -87.0375], 14);

            L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                maxZoom: 20
            }).addTo(mapInstance.current);

            // DATA aligned with lotes.ts
            const lots = [
                {
                    id: 'lote1',
                    label: 'Lote 1',
                    title: 'El Refugio Forestal',
                    utm: [494788, 1560199],
                    img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=400',
                    area: '2,762.75 m²'
                },
                {
                    id: 'lote2',
                    label: 'Lote 2',
                    title: 'La Gran Reserva',
                    utm: [494764, 1560281],
                    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400',
                    area: '6,165.16 m²'
                },
                {
                    id: 'lote3',
                    label: 'Lote 3',
                    title: 'Altos del Pino',
                    utm: [494767, 1560265],
                    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
                    area: '4,266.26 m²'
                }
            ];

            const createPillIcon = (label: string) => L.divIcon({
                html: `
                    <div class="relative flex flex-col items-center group">
                        <div class="absolute w-10 h-10 bg-purple-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div class="w-6 h-6 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10">
                            <i class="fa-solid fa-location-dot text-[10px] text-white"></i>
                        </div>
                        <div class="absolute -top-10 bg-slate-950/90 border border-white/10 px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-xl whitespace-nowrap z-20 group-hover:scale-110 transition-transform">
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]"></div>
                                <span class="text-[10px] font-black uppercase tracking-[0.15em] text-white">${label}</span>
                            </div>
                        </div>
                    </div>
                `,
                className: '',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            lots.forEach(lot => {
                const [lat, lon] = utmToLatLon(lot.utm[0], lot.utm[1]);
                const marker = L.marker([lat, lon], { icon: createPillIcon(lot.label) }).addTo(mapInstance.current!);

                marker.bindPopup(`
                    <div class="p-0 overflow-hidden rounded-2xl bg-slate-950 border border-white/10 shadow-3xl min-w-[200px]">
                        <img src="${lot.img}" class="w-full h-24 object-cover grayscale-[0.2]" />
                        <div class="p-4">
                            <p class="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1">${lot.label}</p>
                            <h4 class="text-white text-sm font-black mb-2">${lot.title}</h4>
                            <p class="text-white/40 text-[9px] font-bold uppercase">${lot.area}</p>
                        </div>
                    </div>
                `, {
                    className: 'custom-leaflet-popup',
                    closeButton: false,
                    offset: [0, -30]
                });
            });

            // HUB
            const valleIcon = L.divIcon({
                html: `
                    <div class="bg-slate-950 border border-white/20 px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-2xl cursor-pointer hover:bg-purple-600/20 transition-all group scale-110">
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7] animate-pulse"></div>
                            <span class="text-[12px] font-black uppercase tracking-[0.3em] text-white">Valle de Ángeles</span>
                            <i class="fa-solid fa-chevron-right text-[10px] text-white/30 group-hover:translate-x-1 transition-transform"></i>
                        </div>
                    </div>
                `,
                className: '',
                iconSize: [220, 48],
                iconAnchor: [110, 24]
            });

            const hubMarker = L.marker([14.1130, -87.0375], { icon: valleIcon }).addTo(mapInstance.current);

            hubMarker.bindPopup(`
                <div class="p-5 bg-slate-950 border border-white/20 rounded-[2.5rem] shadow-3xl min-w-[280px] backdrop-blur-3xl">
                    <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 text-center">Proyectos Disponibles</p>
                    <div class="space-y-3">
                        ${lots.map(lot => `
                            <div class="flex items-center gap-4 p-3.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-purple-600/20 transition-all cursor-pointer group/item" onclick="document.dispatchEvent(new CustomEvent('select-project', { detail: '${lot.id}' }))">
                                <div class="w-12 h-12 rounded-xl bg-cover bg-center border border-white/10" style="background-image: url('${lot.img}')"></div>
                                <div class="flex-1">
                                    <p class="text-[8px] font-black text-purple-400 uppercase tracking-widest">${lot.label}</p>
                                    <p class="text-white text-[11px] font-black leading-tight mt-1">${lot.title}</p>
                                </div>
                                <div class="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-purple-600 transition-colors">
                                    <i class="fa-solid fa-arrow-right text-[10px] text-white/40 group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `, {
                className: 'custom-leaflet-popup',
                closeButton: false,
                offset: [0, -40]
            });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full h-[650px] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-slate-900"
        >
            <style>
                {`
                    .custom-leaflet-popup .leaflet-popup-content-wrapper {
                        background: transparent !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                    .custom-leaflet-popup .leaflet-popup-tip {
                        display: none !important;
                    }
                    .leaflet-container {
                        background: #020617 !important;
                    }
                `}
            </style>
            <div ref={mapRef} className="w-full h-full grayscale-[0.2] contrast-[1.1]" />

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20" />

            <div className="absolute top-10 right-10 z-[1000] bg-slate-950/80 backdrop-blur-xl border border-white/10 p-7 rounded-[2rem] max-w-xs transition-transform group-hover:translate-x-[-10px] hidden md:block">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <i className="fa-solid fa-compass text-white text-xl"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-tight text-white">Exploración IA</h4>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Honduras, CA</p>
                    </div>
                </div>
                <p className="text-white/40 text-xs leading-relaxed font-bold italic">
                    "Haz clic en el núcleo de Valle de Ángeles para descubrir los lotes disponibles analizados por nuestra red neuronal."
                </p>
            </div>
        </motion.div>
    );
};

export default LandingMap;
