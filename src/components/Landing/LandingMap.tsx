import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

const LandingMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            // Center in Valle de Angeles area
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: false,
                scrollWheelZoom: false,
                attributionControl: false
            }).setView([14.1130, -87.0375], 11);

            // High quality hybrid layer
            L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                maxZoom: 20
            }).addTo(mapInstance.current);

            // Custom Marker Icon
            const createCustomIcon = (active = false) => L.divIcon({
                html: `
                    <div class="relative flex items-center justify-center">
                        <div class="absolute w-12 h-12 bg-purple-500/20 rounded-full animate-ping"></div>
                        <div class="w-6 h-6 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                            <i class="fa-solid fa-mountain text-[10px] text-white"></i>
                        </div>
                        ${active ? `
                        <div class="absolute -top-10 bg-slate-900 border border-white/10 px-3 py-1 rounded-lg shadow-2xl backdrop-blur-md whitespace-nowrap">
                            <span class="text-[10px] font-black uppercase tracking-widest text-white">Valle de Ángeles</span>
                        </div>` : ''}
                    </div>
                `,
                className: '',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            // Primary Project Marker
            L.marker([14.1130, -87.0375], { icon: createCustomIcon(true) }).addTo(mapInstance.current);

            // Future/Placeholder Markers
            const secondaryIcon = L.divIcon({
                html: `
                    <div class="w-4 h-4 bg-white/40 rounded-full border border-white/20 shadow-lg flex items-center justify-center">
                        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                `,
                className: '',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            L.marker([14.1500, -87.1000], { icon: secondaryIcon }).addTo(mapInstance.current); // Santa Lucia area
            L.marker([14.0500, -87.2000], { icon: secondaryIcon }).addTo(mapInstance.current); // Near Tegucigalpa
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
            className="w-full h-[600px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group"
        >
            <div ref={mapRef} className="w-full h-full grayscale-[0.2] contrast-[1.1]" />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

            {/* Floating Info */}
            <div className="absolute top-10 right-10 z-[1000] bg-slate-950/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl max-w-xs transition-transform group-hover:translate-x-[-10px]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-location-dot text-white"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-tight">Zona de Impacto</h4>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Honduras, CA</p>
                    </div>
                </div>
                <p className="text-white/50 text-xs leading-relaxed font-medium">
                    Nuestros algoritmos de IA analizan la topografía de Valle de Ángeles para maximizar la sostenibilidad y el retorno de inversión.
                </p>
            </div>
        </motion.div>
    );
};

export default LandingMap;
