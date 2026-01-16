import { Moon, Star, Clock, Sparkles, Sun, AlertTriangle } from 'lucide-react';
import type { CulturalDayMetadata } from '@/types/culturalMetadata';
import { useCalendarMode } from '@/contexts/CalendarModeContext';
import { cn } from '@/lib/utils';

interface CulturalInsightsProps {
  metadata: CulturalDayMetadata | null;
  className?: string;
}

export function CulturalInsights({ metadata, className }: CulturalInsightsProps) {
  const { mode } = useCalendarMode();
  
  if (!metadata) {
    return (
      <div className={cn("px-4 py-4 bg-secondary/30 border-b border-border", className)}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Cultural Insights</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-3 animate-pulse">
              <div className="h-3 bg-muted rounded w-16 mb-2" />
              <div className="h-4 bg-muted rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { tithi, nakshatra, auspiciousTimes, rahukaal, tamilCycle, festival, isPurnima, isAmavasya, isEkadashi } = metadata;

  // Get display names based on mode
  const tithiDisplay = mode === 'BS' && tithi?.nameNp ? tithi.nameNp : tithi?.name;
  const nakshatraDisplay = mode === 'BS' && nakshatra?.nameNp ? nakshatra.nameNp : nakshatra?.name;
  const pakshaDisplay = mode === 'BS' 
    ? (tithi?.paksha === 'Shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष')
    : (tithi?.paksha === 'Shukla' ? 'Shukla Paksha' : 'Krishna Paksha');

  // Find the best auspicious time to display
  const primaryAuspicious = auspiciousTimes?.find(t => t.type === 'amrit' || t.type === 'shubh');

  return (
    <div className={cn("px-4 py-4 bg-gradient-to-b from-accent/40 to-background border-b border-border", className)}>
      {/* Header with special day badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {mode === 'BS' ? 'पञ्चाङ्ग' : 'Panchang'}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {isPurnima && (
            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-2xs font-medium rounded-full flex items-center gap-1">
              <Moon className="w-3 h-3" />
              {mode === 'BS' ? 'पूर्णिमा' : 'Purnima'}
            </span>
          )}
          {isAmavasya && (
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-2xs font-medium rounded-full flex items-center gap-1">
              <Moon className="w-3 h-3" />
              {mode === 'BS' ? 'औंसी' : 'Amavasya'}
            </span>
          )}
          {isEkadashi && (
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-2xs font-medium rounded-full">
              {mode === 'BS' ? 'एकादशी' : 'Ekadashi'}
            </span>
          )}
          {festival && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-2xs font-medium rounded-full">
              {festival}
            </span>
          )}
        </div>
      </div>

      {/* Main metadata grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Tithi */}
        <div className="bg-card rounded-xl p-3 shadow-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Moon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wide">
              {mode === 'BS' ? 'तिथि' : 'Tithi'}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate" title={tithiDisplay}>
            {tithiDisplay || '—'}
          </p>
          <p className="text-2xs text-muted-foreground">
            {pakshaDisplay}
          </p>
        </div>

        {/* Nakshatra */}
        <div className="bg-card rounded-xl p-3 shadow-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wide">
              {mode === 'BS' ? 'नक्षत्र' : 'Nakshatra'}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate flex items-center gap-1" title={nakshatraDisplay}>
            {nakshatra?.symbol && <span>{nakshatra.symbol}</span>}
            {nakshatraDisplay || '—'}
          </p>
          <p className="text-2xs text-muted-foreground">
            {nakshatra?.lord || '—'}
          </p>
        </div>

        {/* Auspicious Time */}
        <div className="bg-card rounded-xl p-3 shadow-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wide">
              {mode === 'BS' ? 'शुभ समय' : 'Shubh'}
            </span>
          </div>
          {primaryAuspicious ? (
            <>
              <p className="text-sm font-semibold text-foreground truncate">
                {primaryAuspicious.name}
              </p>
              <p className="text-2xs text-muted-foreground">
                {primaryAuspicious.startTime} - {primaryAuspicious.endTime}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-muted-foreground">—</p>
              <p className="text-2xs text-muted-foreground">No data</p>
            </>
          )}
        </div>
      </div>

      {/* Secondary info row */}
      <div className="flex items-center justify-between text-xs">
        {/* Tamil Year (when relevant) */}
        {tamilCycle && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Sun className="w-3.5 h-3.5" />
            <span>
              {mode === 'BS' ? 'वर्ष' : 'Year'}: <span className="font-medium text-foreground">{tamilCycle.year}</span>
            </span>
          </div>
        )}

        {/* Rahukaal warning */}
        {rahukaal && (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-2xs">
              {mode === 'BS' ? 'राहु काल' : 'Rahukaal'}: {rahukaal.start} - {rahukaal.end}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
