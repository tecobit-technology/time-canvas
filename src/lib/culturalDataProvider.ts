import { addDays, startOfDay } from 'date-fns';
import type { CulturalDayMetadata, TithiInfo, NakshatraInfo, AuspiciousTime } from '@/types/culturalMetadata';

// Tithi names (15 lunar days in each paksha)
const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

const TITHI_NAMES_NP = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/औंसी'
];

// 27 Nakshatras
const NAKSHATRA_DATA = [
  { name: 'Ashwini', nameNp: 'अश्विनी', lord: 'Ketu', symbol: '🐴' },
  { name: 'Bharani', nameNp: 'भरणी', lord: 'Venus', symbol: '🔱' },
  { name: 'Krittika', nameNp: 'कृत्तिका', lord: 'Sun', symbol: '🔥' },
  { name: 'Rohini', nameNp: 'रोहिणी', lord: 'Moon', symbol: '🐂' },
  { name: 'Mrigashira', nameNp: 'मृगशिरा', lord: 'Mars', symbol: '🦌' },
  { name: 'Ardra', nameNp: 'आर्द्रा', lord: 'Rahu', symbol: '💧' },
  { name: 'Punarvasu', nameNp: 'पुनर्वसु', lord: 'Jupiter', symbol: '🏹' },
  { name: 'Pushya', nameNp: 'पुष्य', lord: 'Saturn', symbol: '🌸' },
  { name: 'Ashlesha', nameNp: 'आश्लेषा', lord: 'Mercury', symbol: '🐍' },
  { name: 'Magha', nameNp: 'मघा', lord: 'Ketu', symbol: '👑' },
  { name: 'Purva Phalguni', nameNp: 'पूर्वा फाल्गुनी', lord: 'Venus', symbol: '🛏️' },
  { name: 'Uttara Phalguni', nameNp: 'उत्तरा फाल्गुनी', lord: 'Sun', symbol: '☀️' },
  { name: 'Hasta', nameNp: 'हस्त', lord: 'Moon', symbol: '✋' },
  { name: 'Chitra', nameNp: 'चित्रा', lord: 'Mars', symbol: '💎' },
  { name: 'Swati', nameNp: 'स्वाती', lord: 'Rahu', symbol: '🌱' },
  { name: 'Vishakha', nameNp: 'विशाखा', lord: 'Jupiter', symbol: '🎯' },
  { name: 'Anuradha', nameNp: 'अनुराधा', lord: 'Saturn', symbol: '🪷' },
  { name: 'Jyeshtha', nameNp: 'ज्येष्ठा', lord: 'Mercury', symbol: '☂️' },
  { name: 'Mula', nameNp: 'मूल', lord: 'Ketu', symbol: '🌿' },
  { name: 'Purva Ashadha', nameNp: 'पूर्वाषाढा', lord: 'Venus', symbol: '🌊' },
  { name: 'Uttara Ashadha', nameNp: 'उत्तराषाढा', lord: 'Sun', symbol: '🐘' },
  { name: 'Shravana', nameNp: 'श्रवण', lord: 'Moon', symbol: '👂' },
  { name: 'Dhanishta', nameNp: 'धनिष्ठा', lord: 'Mars', symbol: '🥁' },
  { name: 'Shatabhisha', nameNp: 'शतभिषा', lord: 'Rahu', symbol: '⭕' },
  { name: 'Purva Bhadrapada', nameNp: 'पूर्वाभाद्रपदा', lord: 'Jupiter', symbol: '⚡' },
  { name: 'Uttara Bhadrapada', nameNp: 'उत्तराभाद्रपदा', lord: 'Saturn', symbol: '🐍' },
  { name: 'Revati', nameNp: 'रेवती', lord: 'Mercury', symbol: '🐟' },
];

// Tamil calendar year names (60-year cycle)
const TAMIL_YEARS = [
  'Prabhava', 'Vibhava', 'Shukla', 'Pramodoota', 'Prajothpatti',
  'Angirasa', 'Srimukha', 'Bhava', 'Yuva', 'Dhatu',
  'Eeshwara', 'Vehudhanya', 'Pramathi', 'Vikrama', 'Vrishu',
  'Chitrabhanu', 'Subhanu', 'Dharana', 'Parthiva', 'Vyaya',
  'Sarvajith', 'Sarvadhari', 'Virodhi', 'Vikrithi', 'Khara',
  'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi',
  'Hevilambi', 'Vilambi', 'Vikari', 'Sharvari', 'Plava',
  'Shubhakrithu', 'Shobhakrithu', 'Krodhi', 'Vishvavasu', 'Parabhava',
  // ... continues to 60
];

// Generate mock cultural metadata for a date
export function getCulturalMetadata(date: Date): CulturalDayMetadata {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate mock tithi (changes every ~24 hours in reality)
  const tithiIndex = dayOfYear % 15;
  const paksha: 'Shukla' | 'Krishna' = Math.floor(dayOfYear / 15) % 2 === 0 ? 'Shukla' : 'Krishna';
  
  const tithi: TithiInfo = {
    name: TITHI_NAMES[tithiIndex],
    nameNp: TITHI_NAMES_NP[tithiIndex],
    paksha,
    day: tithiIndex + 1,
  };
  
  // Calculate mock nakshatra (changes every ~24 hours)
  const nakshatraIndex = dayOfYear % 27;
  const nakshatra: NakshatraInfo = NAKSHATRA_DATA[nakshatraIndex];
  
  // Generate auspicious times
  const auspiciousTimes: AuspiciousTime[] = [];
  
  // Brahma Muhurta (always present)
  auspiciousTimes.push({
    name: 'Brahma Muhurta',
    startTime: '04:24',
    endTime: '05:12',
    type: 'amrit',
  });
  
  // Add some based on day
  if (dayOfYear % 3 === 0) {
    auspiciousTimes.push({
      name: 'Abhijit Muhurta',
      startTime: '11:48',
      endTime: '12:36',
      type: 'shubh',
    });
  }
  
  if (dayOfYear % 5 === 0) {
    auspiciousTimes.push({
      name: 'Vijay Muhurta',
      startTime: '14:00',
      endTime: '14:48',
      type: 'labh',
    });
  }
  
  // Rahukaal (varies by day of week)
  const rahukaalTimes: Record<number, { start: string; end: string }> = {
    0: { start: '16:30', end: '18:00' }, // Sunday
    1: { start: '07:30', end: '09:00' }, // Monday
    2: { start: '15:00', end: '16:30' }, // Tuesday
    3: { start: '12:00', end: '13:30' }, // Wednesday
    4: { start: '13:30', end: '15:00' }, // Thursday
    5: { start: '10:30', end: '12:00' }, // Friday
    6: { start: '09:00', end: '10:30' }, // Saturday
  };
  
  // Tamil year (simplified calculation)
  const tamilYearIndex = (date.getFullYear() - 2000 + 17) % 60;
  
  // Special days
  const isEkadashi = tithiIndex === 10;
  const isPurnima = tithiIndex === 14 && paksha === 'Shukla';
  const isAmavasya = tithiIndex === 14 && paksha === 'Krishna';
  
  // Mock festivals
  let festival: string | undefined;
  const month = date.getMonth();
  const day = date.getDate();
  
  if (month === 9 && day >= 15 && day <= 24) festival = 'Dashain';
  if (month === 10 && day >= 1 && day <= 5) festival = 'Tihar';
  if (month === 0 && day === 14) festival = 'Maghe Sankranti';
  if (month === 2 && day >= 20 && day <= 28) festival = 'Holi';
  
  return {
    date: startOfDay(date),
    tithi,
    nakshatra,
    yoga: {
      name: 'Shubha',
      nameNp: 'शुभ',
      nature: 'auspicious',
    },
    karana: {
      name: 'Bava',
      nameNp: 'बव',
    },
    auspiciousTimes,
    rahukaal: rahukaalTimes[date.getDay()],
    tamilCycle: {
      year: TAMIL_YEARS[tamilYearIndex] || 'Krodhi',
      month: 'Thai', // Simplified
      day: day,
    },
    isEkadashi,
    isPurnima,
    isAmavasya,
    isSankranti: day === 14 || day === 15,
    festival,
  };
}
