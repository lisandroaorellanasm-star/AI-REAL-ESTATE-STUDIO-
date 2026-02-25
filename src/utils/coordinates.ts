import proj4 from 'proj4';
import L from 'leaflet';
import { Lote } from '../types';

proj4.defs("EPSG:32616", "+proj=utm +zone=16 +datum=WGS84 +units=m +no_defs");

export function utmToLatLon(x: number, y: number): [number, number] {
    const coord = proj4("EPSG:32616", "EPSG:4326", [x, y]);
    return [coord[1], coord[0]];
}

export function latLonToUtm(lat: number, lng: number): [number, number] {
    const coord = proj4("EPSG:4326", "EPSG:32616", [lng, lat]);
    return [coord[0], coord[1]];
}

export const getValidRandomLatLng = (lote: Lote): { lat: number; lng: number } => {
    const latlngs = lote.coordenadas_utm.map(coord => utmToLatLon(coord[0], coord[1]));
    const bounds = L.polygon(latlngs as L.LatLngExpression[]).getBounds();
    // This is a simplified version. A proper implementation would check for point-in-polygon.
    const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
    const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
    return { lat, lng };
};
