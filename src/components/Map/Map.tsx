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
                color: activeLot.color, 
                fillColor: activeLot.fillColor, 
                fillOpacity: 0.2 
            }).addTo(mapInstance.current);
            mapInstance.current.fitBounds(polygonRef.current.getBounds(), { padding: [40, 40] });
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
                const icon = L.divIcon({
                    html: `<div class="glass-marker w-5 h-5 flex items-center justify-center rounded-full border border-white/60 text-[8px] ${itemDef.colorClass}">${itemDef.iconHtml}</div>`,
                    className: '',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
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

    return <div ref={mapRef} id="map" className="h-full w-full z-10 rounded-lg"></div>;
};

export default Map;
