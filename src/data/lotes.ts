import { Lote, ItemDef } from '@/src/types';

export const lotes: Lote[] = [
    {
        id: 'lote1',
        nameKey: 'Lote 1 (4 Puntos)',
        areaM2: 2762.75,
        color: '#ef4444',
        fillColor: '#fca5a5',
        coordenadas_utm: [[494788.13, 1560199.09], [494797.75, 1560153.32], [494855.27, 1560160.07], [494836.11, 1560213.33]],
        descKey: 'lote1Desc'
    },
    {
        id: 'lote2',
        nameKey: 'Lote 2 (22 Puntos)',
        areaM2: 6165.16,
        color: '#3b82f6',
        fillColor: '#93c5fd',
        coordenadas_utm: [[494764.54, 1560281.55], [494752.68, 1560293.20], [494744.86, 1560299.47], [494735.51, 1560306.78], [494730.41, 1560312.74], [494723.76, 1560320.97], [494716.33, 1560340.24], [494723.86, 1560344.44], [494737.00, 1560348.42], [494753.49, 1560353.07], [494761.97, 1560353.26], [494770.87, 1560353.25], [494787.68, 1560351.45], [494795.87, 1560354.20], [494804.52, 1560347.83], [494813.74, 1560339.68], [494828.21, 1560325.51], [494825.29, 1560311.09], [494820.58, 1560293.60], [494818.92, 1560287.39], [494816.61, 1560280.48], [494778.64, 1560277.09]],
        descKey: 'lote2Desc'
    },
    {
        id: 'lote3',
        nameKey: 'Lote 3 (Contiguo)',
        areaM2: 4266.26,
        color: '#10b981',
        fillColor: '#6ee7b7',
        coordenadas_utm: [[494767.62, 1560265.19], [494755.72, 1560261.04], [494738.35, 1560256.83], [494717.49, 1560250.18], [494695.73, 1560240.93], [494691.64, 1560234.90], [494691.39, 1560221.16], [494695.88, 1560208.73], [494696.71, 1560206.63], [494698.23, 1560199.23], [494704.98, 1560197.20], [494717.32, 1560193.79], [494725.51, 1560194.15], [494743.25, 1560200.25], [494775.03, 1560210.46], [494774.24, 1560220.39], [494771.98, 1560238.09]],
        descKey: 'lote3Desc'
    }
];

export const itemDefs: { [key: string]: ItemDef } = {
    cabana: { nameEs: 'Cabaña', nameEn: 'Cabin', iconHtml: '<i class="fa-solid fa-house-chimney"></i>', colorClass: 'bg-red-500 text-white', colorHex: 0xf87171, cost: 45000, type: 'cabana', size: [6, 6, 6], constructionM2: 60 },
    piscina: { nameEs: 'Piscina', nameEn: 'Pool', iconHtml: '<i class="fa-solid fa-water"></i>', colorClass: 'bg-blue-500 text-white', colorHex: 0x38bdf8, cost: 18000, type: 'cylinder', size: [6, 0.6, 6], constructionM2: 25 },
    yoga: { nameEs: 'Yoga', nameEn: 'Yoga', iconHtml: '<i class="fa-solid fa-om"></i>', colorClass: 'bg-purple-500 text-white', colorHex: 0xa855f7, cost: 10000, type: 'deck', size: [8, 0.2, 8], constructionM2: 20 },
    hotel: { nameEs: 'Hotel', nameEn: 'Hotel', iconHtml: '<i class="fa-solid fa-hotel"></i>', colorClass: 'bg-yellow-500 text-yellow-900', colorHex: 0xfacc15, cost: 150000, type: 'largebox', size: [20, 12, 15], constructionM2: 250 },
    parqueo: { nameEs: 'Parqueo', nameEn: 'Parking', iconHtml: '<i class="fa-solid fa-car"></i>', colorClass: 'bg-slate-700 text-white', colorHex: 0x64748b, cost: 5000, type: 'flat', size: [12, 0.1, 10], constructionM2: 150 },
    hierbas: { nameEs: 'Hierbas', nameEn: 'Herbs', iconHtml: '<i class="fa-solid fa-leaf"></i>', colorClass: 'bg-lime-500 text-white', colorHex: 0x84cc16, cost: 3000, type: 'flat', size: [5, 0.1, 5], constructionM2: 15 }
};
