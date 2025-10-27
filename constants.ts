
import { Grandeur, Unit } from './types';

export const GRANDEURS: { id: Grandeur; name: string }[] = [
  { id: 'longueurs', name: 'Longueurs' },
  { id: 'masses', name: 'Masses' },
  { id: 'capacités', name: 'Capacités' },
  { id: 'aires', name: 'Aires' },
  { id: 'volumes', name: 'Volumes' },
];

export const UNITS: Record<Grandeur, Unit[]> = {
  longueurs: [
    { symbol: 'km', name: 'kilomètre' },
    { symbol: 'hm', name: 'hectomètre' },
    { symbol: 'dam', name: 'décamètre' },
    { symbol: 'm', name: 'mètre' },
    { symbol: 'dm', name: 'décimètre' },
    { symbol: 'cm', name: 'centimètre' },
    { symbol: 'mm', name: 'millimètre' },
  ],
  masses: [
    { symbol: 't', name: 'tonne' },
    { symbol: 'q', name: 'quintal' },
    { symbol: ' ', name: ' ' }, // Placeholder for 10kg
    { symbol: 'kg', name: 'kilogramme' },
    { symbol: 'hg', name: 'hectogramme' },
    { symbol: 'dag', name: 'décagramme' },
    { symbol: 'g', name: 'gramme' },
    { symbol: 'dg', name: 'décigramme' },
    { symbol: 'cg', name: 'centigramme' },
    { symbol: 'mg', name: 'milligramme' },
  ],
  capacités: [
    { symbol: 'hl', name: 'hectolitre' },
    { symbol: 'dal', name: 'décalitre' },
    { symbol: 'L', name: 'litre' },
    { symbol: 'dL', name: 'décilitre' },
    { symbol: 'cL', name: 'centilitre' },
    { symbol: 'mL', name: 'millilitre' },
  ],
  aires: [
    { symbol: 'km²', name: 'kilomètre carré' },
    { symbol: 'hm²', name: 'hectomètre carré' },
    { symbol: 'dam²', name: 'décamètre carré' },
    { symbol: 'm²', name: 'mètre carré' },
    { symbol: 'dm²', name: 'décimètre carré' },
    { symbol: 'cm²', name: 'centimètre carré' },
    { symbol: 'mm²', name: 'millimètre carré' },
  ],
  volumes: [
    { symbol: 'km³', name: 'kilomètre cube' },
    { symbol: 'hm³', name: 'hectomètre cube' },
    { symbol: 'dam³', name: 'décamètre cube' },
    { symbol: 'm³', name: 'mètre cube' },
    { symbol: 'dm³', name: 'décimètre cube' },
    { symbol: 'cm³', name: 'centimètre cube' },
    { symbol: 'mm³', name: 'millimètre cube' },
  ],
};
