export type Grandeur = 'longueurs' | 'masses' | 'capacités' | 'aires' | 'volumes';

export interface Unit {
  symbol: string;
  name: string;
}

export interface Exercise {
  id: number;
  grandeur: Grandeur;
  statement: string;
  value: number;
  startUnit: string;
  targetUnit: string;
  solution: number;
}

export interface PlacedDigit {
  digit: string;
  isUnit: boolean;
  colIndex: number;
  subColIndex: number;
}