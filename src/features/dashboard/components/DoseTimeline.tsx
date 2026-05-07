import { useDoseSchedule } from '@/hooks/useDoseSchedule';
import { cn } from '@/lib/utils';
import { Clock, Sprout, Info, ChevronDown, Sun, Moon, GlassWater, Leaf } from 'lucide-react';

// Custom Spoon SVG since some lucide-react versions don't have it
const SpoonIcon = ({ size = 24, className = '' }) => (
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
  >
    <path d="m16 8-8 8" />
    <path d="M15 4.5A2.5 2.5 0 0 1 17.5 7v1a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 11.5 8V7A2.5 2.5 0 0 1 14 4.5h1z" />
  </svg>
);

export function DoseTimeline({ currentDay }: { currentDay?: number }) {
  const { schedule, frekuensi, sendok, isFase3 } = useDoseSchedule(currentDay);

  const dayKey = currentDay || 1;

  return (
    <div className="bg-lt-bg-surface rounded-[2rem] p-4 sm:p-5 shadow-sm border border-lt-border-subtle">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-lt-color-primary"
          >
            <Clock size={20} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-lt-text-primary text-base leading-tight">Jadwal Walmagh</h3>
            <p className="text-[11px] text-lt-text-secondary mt-0.5 font-medium">
              Fase {isFase3 ? '3' : '1-2'} • {frekuensi}x Sehari • {sendok} sdm
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-lt-bg-subtle border border-lt-border-subtle px-3 py-1.5 rounded-full shrink-0">
          <span className="text-[10px] font-bold text-lt-color-primary">Hari ke-{dayKey}</span>
          <ChevronDown size={12} className="text-lt-color-primary" />
        </div>
      </div>

      {/* Info Message */}
      <div className="flex items-center gap-2.5 mb-5 bg-lt-bg-subtle/50 border border-lt-border-subtle p-2.5 rounded-xl">
        <div className="w-6 h-6 rounded-full bg-lt-bg-surface border border-lt-border-subtle flex items-center justify-center shrink-0">
          <Sprout size={14} className="text-lt-color-primary" />
        </div>
        <p className="text-[11px] text-lt-text-secondary flex-1 leading-snug font-medium">
          Pengingat jam minum walmagh hari ini.
        </p>
        <Info size={14} className="text-lt-color-primary opacity-50" />
      </div>

      {/* Grid Cards - Compact Reminder Style */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {schedule.map((jam, index) => {
          const isNight = jam >= 18 || jam < 4;
          const label = isNight ? 'Malam' : (jam >= 11 && jam < 15 ? 'Siang' : 'Pagi');
          const IconComp = isNight ? Moon : Sun;

          return (
            <div 
              key={index} 
              className="flex flex-col items-center pt-3 pb-2.5 px-2 rounded-2xl border border-lt-border-subtle bg-lt-bg-subtle/30"
            >
              {/* Top Section */}
              <div 
                className={cn("w-8 h-8 rounded-full flex items-center justify-center mb-2 shadow-sm border border-lt-border-subtle", isNight ? "bg-lt-bg-elevated text-lt-color-primary" : "bg-lt-bg-subtle text-lt-color-primary")}
              >
                <IconComp size={16} strokeWidth={2} />
              </div>
              
              <span className="font-extrabold text-base text-lt-text-primary leading-none mb-1.5">
                {jam.toString().padStart(2, '0')}.00
              </span>
              
              <div 
                className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full mb-3 border border-lt-border-subtle", isNight ? "bg-lt-bg-elevated text-lt-text-secondary" : "bg-lt-bg-subtle text-lt-text-secondary")}
              >
                {label}
              </div>

              <hr className="w-full border-lt-border-subtle mb-2.5" />

              <div className="flex items-center gap-1.5">
                <SpoonIcon size={14} className="text-lt-color-primary shrink-0 -rotate-45 opacity-80" />
                <span className="text-[10px] font-bold text-lt-text-primary leading-none">{sendok} sdm</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note - Compact */}
      <div className="flex items-center gap-3 p-3 bg-lt-bg-subtle border border-lt-border-subtle rounded-xl relative overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-lt-bg-surface border border-lt-border-subtle flex items-center justify-center shrink-0 z-10">
          <Clock size={14} className="text-lt-color-primary" strokeWidth={2} />
        </div>
        <div className="z-10 flex-1 pr-6">
          <p className="text-[11px] font-bold text-lt-color-primary leading-tight mb-0.5">
            Jarak antar dosis {isFase3 ? '12' : '8'} jam
          </p>
        </div>
        <div className="absolute -right-1 bottom-0 flex items-end opacity-20 pointer-events-none text-lt-color-primary">
          <GlassWater size={40} strokeWidth={1.5} className="mb-1" />
          <Leaf size={20} strokeWidth={1.5} className="-ml-4 mb-0.5 rotate-12" />
        </div>
      </div>

    </div>
  );
}

