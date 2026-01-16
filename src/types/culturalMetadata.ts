// Cultural Metadata types for Panchang and Tamil calendar systems

export interface TithiInfo {
  name: string;
  nameNp?: string; // Nepali name
  paksha: 'Shukla' | 'Krishna'; // Bright/Dark fortnight
  day: number; // 1-15
}

export interface NakshatraInfo {
  name: string;
  nameNp?: string;
  lord: string; // Ruling deity/planet
  symbol?: string;
}

export interface YogaInfo {
  name: string;
  nameNp?: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
}

export interface KaranaInfo {
  name: string;
  nameNp?: string;
}

export interface AuspiciousTime {
  name: string;
  startTime: string;
  endTime: string;
  type: 'shubh' | 'labh' | 'amrit' | 'rog' | 'kaal';
}

export interface TamilCycleInfo {
  year: string; // e.g., "Krodhi"
  month: string; // Tamil month name
  day: number;
}

export interface CulturalDayMetadata {
  date: Date;
  
  // Panchang elements
  tithi?: TithiInfo;
  nakshatra?: NakshatraInfo;
  yoga?: YogaInfo;
  karana?: KaranaInfo;
  
  // Auspicious times
  auspiciousTimes?: AuspiciousTime[];
  rahukaal?: { start: string; end: string };
  
  // Tamil calendar
  tamilCycle?: TamilCycleInfo;
  
  // Special day markers
  isEkadashi?: boolean;
  isPurnima?: boolean;
  isAmavasya?: boolean;
  isSankranti?: boolean;
  
  // Festival/Event
  festival?: string;
}
