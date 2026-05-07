import { useDoseSchedule } from '@/hooks/useDoseSchedule';
import { Clock, Sprout, Info, ChevronDown, Sun, Moon, GlassWater, Leaf } from 'lucide-react';

// Custom Spoon SVG since some lucide-react versions don't have it
const SpoonIcon = ({ size = 24, className = '', style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className} 
    style={style}
  >
    <path d="m16 8-8 8" />
    <path d="M15 4.5A2.5 2.5 0 0 1 17.5 7v1a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 11.5 8V7A2.5 2.5 0 0 1 14 4.5h1z" />
  </svg>
);

export function DoseTimeline({ currentDay }: { currentDay?: number }) {
  const { schedule, frekuensi, sendok, isFase3 } = useDoseSchedule(currentDay);

  // Brand Colors from agents.md
  const BRAND = {
    PRIMARY: '#8fcf97', // New Sage Green
    ACCENT: '#C4A484',  // Tan/Brown
  };

  const dayKey = currentDay || 1;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-[2rem] p-4 sm:p-5 shadow-sm border border-sage-light dark:border-dark-disabled/30">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: BRAND.PRIMARY }}
          >
            <Clock size={20} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-sage-text dark:text-dark-text text-base leading-tight">Jadwal Walmagh</h3>
            <p className="text-[11px] text-sage-muted dark:text-dark-muted mt-0.5 font-medium">
              Fase {isFase3 ? '3' : '1-2'} • {frekuensi}x Sehari • {sendok} sdm
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#F1F6F2] dark:bg-dark-surface-3 px-3 py-1.5 rounded-full shrink-0">
          <span className="text-[10px] font-bold" style={{ color: BRAND.PRIMARY }}>Hari ke-{dayKey}</span>
          <ChevronDown size={12} style={{ color: BRAND.PRIMARY }} />
        </div>
      </div>

      {/* Info Message */}
      <div className="flex items-center gap-2.5 mb-5 bg-sage-light/30 dark:bg-dark-surface-2 p-2.5 rounded-xl border border-sage-light/50 dark:border-dark-disabled/10">
        <div className="w-6 h-6 rounded-full bg-[#F1F6F2] dark:bg-dark-surface-3 flex items-center justify-center shrink-0">
          <Sprout size={14} style={{ color: BRAND.PRIMARY }} />
        </div>
        <p className="text-[11px] text-sage-muted dark:text-dark-muted flex-1 leading-snug font-medium">
          Pengingat jam minum walmagh hari ini.
        </p>
        <Info size={14} style={{ color: BRAND.PRIMARY }} className="opacity-50" />
      </div>

      {/* Grid Cards - Compact Reminder Style */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {schedule.map((jam, index) => {
          const isNight = jam >= 18 || jam < 4;
          const label = isNight ? 'Malam' : (jam >= 11 && jam < 15 ? 'Siang' : 'Pagi');
          const IconComp = isNight ? Moon : Sun;

          const badgeBg = isNight ? '#F8F4F0' : '#FDF4EC'; // Changed lavender to light tan
          const badgeText = isNight ? '#C4A484' : '#F97316'; // Changed lavender to tan primary

          return (
            <div 
              key={index} 
              className="flex flex-col items-center pt-3 pb-2.5 px-2 rounded-2xl border border-gray-100 dark:border-dark-disabled/20 bg-[#faf9f7] dark:bg-dark-surface-2"
            >
              {/* Top Section */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: badgeBg, color: badgeText }}
              >
                <IconComp size={16} strokeWidth={2} />
              </div>
              
              <span className="font-extrabold text-base text-sage-text dark:text-dark-text leading-none mb-1.5">
                {jam.toString().padStart(2, '0')}.00
              </span>
              
              <div 
                className="text-[9px] font-bold px-2 py-0.5 rounded-full mb-3"
                style={{ backgroundColor: badgeBg, color: badgeText }}
              >
                {label}
              </div>

              <hr className="w-full border-gray-200 dark:border-dark-disabled/30 mb-2.5" />

              {/* Dosis Info */}
              <div className="flex items-center gap-1.5">
                <SpoonIcon size={14} style={{ color: BRAND.PRIMARY }} className="shrink-0 -rotate-45 opacity-80" />
                <span className="text-[10px] font-bold text-sage-text dark:text-dark-text leading-none">{sendok} sdm</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note - Compact */}
      <div className="flex items-center gap-3 p-3 bg-[#F1F6F2] dark:bg-dark-surface-2 rounded-xl relative overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-[#E3EFE5] dark:bg-dark-surface-3 flex items-center justify-center shrink-0 z-10">
          <Clock size={14} style={{ color: BRAND.PRIMARY }} strokeWidth={2} />
        </div>
        <div className="z-10 flex-1 pr-6">
          <p className="text-[11px] font-bold text-sage-text dark:text-dark-text leading-tight mb-0.5" style={{ color: BRAND.PRIMARY }}>
            Jarak antar dosis {isFase3 ? '12' : '8'} jam
          </p>
        </div>
        <div className="absolute -right-1 bottom-0 flex items-end opacity-40 dark:opacity-20 pointer-events-none">
          <GlassWater size={40} strokeWidth={1.5} style={{ color: BRAND.PRIMARY }} className="mb-1" />
          <Leaf size={20} strokeWidth={1.5} style={{ color: BRAND.PRIMARY }} className="-ml-4 mb-0.5 rotate-12" />
        </div>
      </div>

    </div>
  );
}

