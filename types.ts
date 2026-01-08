export type ScreenName = 'scanner' | 'map' | 'history' | 'guide' | 'about';

export interface EcoPoint {
  id: number;
  name: string;
  type: 'Recycling Station' | 'Medicine Disposal' | 'E-Waste' | 'General';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours: string;
}

export interface ScanResult {
  id: string;
  itemName: string;
  material: string;
  recyclability: 'Recyclable' | 'Non-Recyclable' | 'Organic' | 'Hazardous';
  disposalAdvice: string;
  confidence: number;
  imageUrl?: string;
  timestamp: number;
}

export interface GuideCard {
  id: string;
  title: string;
  category: string;
  color: string;
  description: string;
  icon: string;
}