import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '@/src/store';
import { utmToLatLon } from '@/src/utils/coordinates';
import { itemDefs } from '@/src/data/lotes';

const Map = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const polygonRef = useRef<L.Polygon | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});
    const { activeLotId, getActiveLot, activeMarkers } = useStore();

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([14.1130, -87.0375], 18);
            L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                maxZoom: 21,
                attribution: '© Google Earth'
            }).addTo(mapInstance.current);
        }
    }, []);

    useEffect(() => {
        const activeLot = getActiveLot();
        if (mapInstance.current) {
            if (polygonRef.current) {
                mapInstance.current.removeLayer(polygonRef.current);
            }
            const latlngs = activeLot.coordenadas_utm.map(coord => utmToLatLon(coord[0], coord[1]));
            polygonRef.current = L.polygon(latlngs, {
                color: '#a855f7',
                fillColor: '#a855f7',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 10'
            }).addTo(mapInstance.current);
            mapInstance.current.fitBounds(polygonRef.current.getBounds(), { padding: [60, 60] });
        }
    }, [activeLotId]);

    useEffect(() => {
        if (!mapInstance.current) return;

        // Remove old markers
        Object.keys(markersRef.current).forEach(markerId => {
            if (!activeMarkers.find(m => m.id === markerId)) {
                mapInstance.current?.removeLayer(markersRef.current[markerId]);
                delete markersRef.current[markerId];
            }
        });

        // Add new markers
        activeMarkers.forEach(markerData => {
            if (!markersRef.current[markerData.id]) {
                const itemDef = itemDefs[markerData.type];
                const itemName = useStore.getState().currentLang === 'es' ? itemDef.nameEs : itemDef.nameEn;
                const icon = L.divIcon({
                    html: `
                        <div class="relative flex flex-col items-center group">
                            <div class="absolute w-8 h-8 bg-purple-500/20 rounded-full animate-ping opacity-40 group-hover:opacity-100 transition-opacity"></div>
                            <div class="w-6 h-6 bg-slate-950 rounded-full border border-white/20 shadow-2xl flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                                ${itemDef.iconHtml.replace('text-lg', 'text-[10px] text-white')}
                            </div>
                            <div class="absolute -top-10 bg-slate-950/90 border border-white/10 px-3 py-1 rounded-full shadow-2xl backdrop-blur-xl scale-0 group-hover:scale-100 transition-all origin-bottom whitespace-nowrap">
                                <span class="text-[8px] font-black uppercase tracking-widest text-white">${itemName}</span>
                            </div>
                        </div>
                    `,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
                const marker = L.marker([markerData.lat, markerData.lng], { icon, draggable: true }).addTo(mapInstance.current!);
                marker.on('dragend', (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    useStore.getState().updateMarkerPosition(markerData.id, lat, lng);
                });
                markersRef.current[markerData.id] = marker;
            }
        });
    }, [activeMarkers]);

    return (
        <div className="h-full w-full relative">
            <style>
                {`
                    .leaflet-container { background: #020617 !important; }
                    .leaflet-interactive { cursor: grab !important; }
                    .leaflet-interactive:active { cursor: grabbing !important; }
                `}
            </style>
            <div ref={mapRef} id="map" className="h-full w-full z-10 grayscale-[0.1] contrast-[1.1]"></div>

            {/* Topography AI Overlay */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-slate-950/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_#a855f7]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Análisis Topográfico IA Activo</span>
            </div>
        </div>
    );
};

export default Map;
