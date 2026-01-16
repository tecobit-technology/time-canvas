// Bikram Sambat (BS) Calendar Adapter
// This provides conversion utilities between AD (Gregorian) and BS calendars

export type CalendarMode = 'AD' | 'BS';

// Nepali month names
export const BS_MONTHS = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan',
  'Bhadra', 'Ashwin', 'Kartik', 'Mangsir',
  'Poush', 'Magh', 'Falgun', 'Chaitra'
];

// Nepali month names in Devanagari
export const BS_MONTHS_NP = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण',
  'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर',
  'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
];

// Nepali weekday names (Sunday first)
export const BS_WEEKDAYS = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];
export const BS_WEEKDAYS_SHORT = ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'];
export const BS_WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Nepali numerals
const NP_NUMERALS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

// BS calendar data - days in each month for years 2000-2100 BS
// This is a simplified version. In production, you'd have complete data.
const BS_CALENDAR_DATA: Record<number, number[]> = {
  2080: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2023-2024 AD
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2024-2025 AD
  2082: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2025-2026 AD
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2026-2027 AD
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2027-2028 AD
};

// Reference point: 2000/01/01 BS = 1943/04/14 AD
const BS_REF_YEAR = 2000;
const AD_REF_DATE = new Date(1943, 3, 14); // April 14, 1943

interface BSDate {
  year: number;
  month: number; // 0-indexed (0 = Baisakh)
  day: number;
}

// Convert number to Nepali numerals
export function toNepaliNumeral(num: number): string {
  return String(num)
    .split('')
    .map(digit => NP_NUMERALS[parseInt(digit)] || digit)
    .join('');
}

// Simplified AD to BS conversion
// In production, use a complete lookup table
export function adToBS(adDate: Date): BSDate {
  // Approximate conversion (simplified for demo)
  // BS year is approximately AD year + 56 years and 8 months
  const adYear = adDate.getFullYear();
  const adMonth = adDate.getMonth();
  const adDay = adDate.getDate();
  
  // Rough conversion - Nepali new year starts mid-April
  let bsYear = adYear + 57;
  let bsMonth = (adMonth + 9) % 12; // Shift by ~9 months
  
  // Adjust year if we're before Baisakh (mid-April)
  if (adMonth < 3 || (adMonth === 3 && adDay < 14)) {
    bsYear -= 1;
  }
  
  // Adjust month more precisely based on approximate boundaries
  const monthBoundaries = [14, 15, 15, 16, 17, 17, 17, 17, 16, 15, 14, 14];
  
  if (adDay < monthBoundaries[adMonth]) {
    bsMonth = (bsMonth + 11) % 12;
    if (bsMonth === 11) bsYear -= 1;
  }
  
  return {
    year: bsYear,
    month: bsMonth,
    day: Math.min(adDay, 32), // BS months can have up to 32 days
  };
}

// Get days in BS month
export function getDaysInBSMonth(year: number, month: number): number {
  if (BS_CALENDAR_DATA[year]) {
    return BS_CALENDAR_DATA[year][month];
  }
  // Default fallback (approximate)
  const defaultDays = [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30];
  return defaultDays[month];
}

// Format BS date
export function formatBSDate(bsDate: BSDate, format: 'full' | 'short' | 'month-year' = 'full'): string {
  switch (format) {
    case 'full':
      return `${BS_MONTHS[bsDate.month]} ${bsDate.day}, ${bsDate.year}`;
    case 'short':
      return `${bsDate.day} ${BS_MONTHS[bsDate.month]}`;
    case 'month-year':
      return `${BS_MONTHS[bsDate.month]} ${bsDate.year}`;
  }
}

// Get the Gregorian equivalent text for a BS date
export function getGregorianEquivalent(adDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    year: 'numeric' 
  };
  return adDate.toLocaleDateString('en-US', options);
}
