import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo page for side-by-side theme comparison
export default function ThemeDemo() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const colors = [
    { name: 'Background', var: 'background', class: 'bg-background' },
    { name: 'Foreground', var: 'foreground', class: 'bg-foreground' },
    { name: 'Primary (Coral)', var: 'primary', class: 'bg-primary' },
    { name: 'Card', var: 'card', class: 'bg-card' },
    { name: 'Muted', var: 'muted', class: 'bg-muted' },
    { name: 'Accent', var: 'accent', class: 'bg-accent' },
    { name: 'Border', var: 'border', class: 'bg-border' },
  ];

  const eventColors = [
    { name: 'Personal', class: 'bg-event-personal' },
    { name: 'Holiday', class: 'bg-event-holiday' },
    { name: 'Note', class: 'bg-event-note' },
    { name: 'Meeting', class: 'bg-event-meeting' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-2xl font-bold mb-6">Theme Comparison</h1>
      
      {/* Theme Switcher */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setTheme('light')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border-2 min-h-[48px]",
            theme === 'light' ? "border-primary bg-primary/10" : "border-border"
          )}
        >
          <Sun className="w-5 h-5" />
          Light
          {theme === 'light' && <Check className="w-4 h-4 text-primary" />}
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border-2 min-h-[48px]",
            theme === 'dark' ? "border-primary bg-primary/10" : "border-border"
          )}
        >
          <Moon className="w-5 h-5" />
          Dark
          {theme === 'dark' && <Check className="w-4 h-4 text-primary" />}
        </button>
      </div>

      {/* Color Tokens */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Core Design Tokens</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {colors.map(({ name, class: colorClass }) => (
            <div key={name} className="flex flex-col gap-2">
              <div 
                className={cn(
                  "w-full h-16 rounded-lg border border-border",
                  colorClass
                )}
              />
              <span className="text-xs font-medium text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Event Colors */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Event Type Colors</h2>
        <div className="grid grid-cols-4 gap-3">
          {eventColors.map(({ name, class: colorClass }) => (
            <div key={name} className="flex flex-col gap-2">
              <div 
                className={cn(
                  "w-full h-12 rounded-lg",
                  colorClass
                )}
              />
              <span className="text-xs font-medium text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Contrast Demo */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">WCAG Contrast Check</h2>
        <div className="space-y-3">
          <div className="bg-primary text-primary-foreground p-4 rounded-lg">
            <p className="font-semibold">Primary on Primary Foreground</p>
            <p className="text-sm opacity-90">Coral accent should have 4.5:1+ contrast ratio</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="font-semibold text-foreground">Card Surface</p>
            <p className="text-sm text-muted-foreground">Muted text on card background</p>
          </div>
          <div className="bg-accent text-accent-foreground p-4 rounded-lg">
            <p className="font-semibold">Accent Surface</p>
            <p className="text-sm opacity-90">Used for selected states</p>
          </div>
        </div>
      </section>

      {/* Calendar Sample */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Calendar Sample (Mobile View)</h2>
        <div className="bg-card border border-border rounded-xl p-4 max-w-sm">
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} className={cn(
                "py-1",
                (i === 0 || i === 6) ? "text-calendar-weekend-foreground" : "text-muted-foreground"
              )}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 3;
              const isToday = day === 16;
              const isWeekend = i % 7 === 0 || i % 7 === 6;
              const isCurrentMonth = day > 0 && day <= 31;
              
              return (
                <button
                  key={i}
                  className={cn(
                    "aspect-square flex items-center justify-center text-sm rounded-lg min-h-[44px]",
                    !isCurrentMonth && "opacity-40",
                    isWeekend && isCurrentMonth && "bg-calendar-weekend",
                    isToday && "bg-calendar-today text-calendar-today-foreground font-bold"
                  )}
                >
                  {isCurrentMonth ? day : ''}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
