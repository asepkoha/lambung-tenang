import { useDoseSchedule } from '@/hooks/useDoseSchedule';
import { Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DoseTimeline({ currentDay }: { currentDay?: number }) {
  const { schedule, frekuensi, sendok, isFase3 } = useDoseSchedule(currentDay);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-4 sm:p-5 shadow-sm border border-sage-light dark:border-dark-disabled">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sage-text dark:text-dark-text text-base sm:text-lg">Jadwal Walmagh</h3>
          <p className="text-xs sm:text-sm text-sage-muted dark:text-dark-muted">
            Fase {isFase3 ? '3' : '1-2'} • {frekuensi}x Sehari • {sendok} sdm
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 relative">
        {/* Garis vertikal timeline */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-sage-light/50 dark:bg-dark-disabled/50 z-0"></div>

        {schedule.map((jam, index) => {
          const doseTimeInMinutes = jam * 60;
          
          let diff = currentTimeInMinutes - doseTimeInMinutes;
          // Handle wrap around for diff (misal jam 23 vs jam 1)
          if (diff > 12 * 60) diff -= 24 * 60;
          if (diff < -12 * 60) diff += 24 * 60;

          const isNow = Math.abs(diff) <= 30; // Rentang ±30 menit
          const isPassed = !isNow && diff > 30; // Sudah terlewat lebih dari 30 menit

          return (
            <div key={index} className="flex gap-3 relative z-10">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 bg-white dark:bg-dark-bg transition-colors",
                isNow ? "border-sage text-sage shadow-md" : 
                isPassed ? "border-sage-muted text-sage-muted" : "border-sage-light text-sage-light"
              )}>
                {isPassed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
              </div>
              
              <div className={cn(
                "flex-1 p-3 rounded-xl border transition-colors",
                isNow ? "border-sage bg-sage/5" : "border-sage-light/50 bg-white dark:bg-dark-card"
              )}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sage-text dark:text-dark-text text-sm sm:text-base">
                      {jam.toString().padStart(2, '0')}.00
                    </span>
                    {isNow && (
                      <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-sage text-white uppercase tracking-wide">
                        Sekarang
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isNow ? "text-sage" : isPassed ? "text-sage-muted" : "text-sage-muted/60"
                  )}>
                    {isPassed ? "Sudah" : isNow ? "Waktunya" : "Belum"}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-sage-muted dark:text-dark-muted">
                  Dosis {index + 1} • {sendok} sdm
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-sage-light/50 dark:border-dark-disabled/50 text-center">
        <p className="text-[11px] sm:text-xs text-sage-muted dark:text-dark-muted font-medium italic">
          {isFase3 
            ? "Jarak antar dosis minimal 12 jam" 
            : "Jarak antar dosis minimal 8 jam"}
        </p>
      </div>
    </div>
  );
}
