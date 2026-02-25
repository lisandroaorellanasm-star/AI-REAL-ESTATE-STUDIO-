export interface Lote {
    id: string;
    nameKey: string;
    areaM2: number;
    color: string;
    fillColor: string;
    coordenadas_utm: number[][];
    descKey: string;
}

export interface ItemDef {
    nameEs: string;
    nameEn: string;
    iconHtml: string;
    colorClass: string;
    colorHex: number;
    cost: number;
    type: string;
    size: [number, number, number];
    constructionM2?: number;
}

export interface Idea {
    id: string;
    title: string;
    summary: string;
    elements: string[];
}

export interface ActiveMarker {
    id: string;
    type: string;
    lat: number;
    lng: number;
}

export type ViewType = '3d' | 'render' | 'roi' | 'marketing';
