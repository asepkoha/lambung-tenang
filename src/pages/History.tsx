import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { useEntries } from '@/hooks/useEntries';
import { allTrackContent } from '@/data/content';
import { ChevronDown, TrendingUp, Smile, Frown, Meh } from 'lucide-react';

const symptomLabels: Record<string, string> = {
  heartburn: 'Nyeri Ulu Hati',
  bloating: 'Kembung',
  nausea: 'Mual',
  chestTightness: 'Asam Naik',
  swallowingDifficulty: 'Sulit menelan',
};

const activityLabels: Record<string, string> = {
  napas: 'Latihan Napas',
  jalan: 'Jalan Santai',
  meditasi: 'Dzikir Pagi/Sore',
  musik: 'No Scrolling',
  none: 'Tidak Ada',
};

const walmaghLabels: Record<string, { label: string; className: string }> = {
  sesuai: { label: 'Sudah, Sesuai Dosis', className: 'bg-lt-color-primary/10 text-lt-color-primary' },
  tidak_sesuai: { label: 'Sudah, Tidak Sesuai Dosis', className: 'bg-destructive/10 text-destructive' },
  belum: { label: 'Belum', className: 'bg-lt-text-muted/10 text-lt-text-muted' },
};

export default function History() {
  const { profile } = useProfile();
  const { entries } = useEntries();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  if (!profile) return null;
  const trackContent = allTrackContent[profile.track];

  // Build chart data — always 14 slots, fill missing days with 0
  const moodData = Array.from({ length: 14 }, (_, i) => {
    const day = i + 1;
    const entry = entries.find((e) => e.dayNumber === day);
    return {
      day,
      mood: entry?.checkInData?.mood ?? 0,
      anxiety: entry?.checkInData?.anxietyLevel ?? 0,
      completed: entry?.completed ?? false,
    };
  });


  const toggleExpand = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="page-container pb-20">
      <h1 className="text-2xl font-bold text-lt-text-primary mb-2">Riwayat 14 Hari</h1>
      <p className="text-lt-text-secondary text-sm mb-6">Perjalanan dan pola harianmu.</p>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center p-8 mt-12 bg-lt-bg-surface rounded-3xl border border-lt-border-subtle shadow-sm"
        >
          <div className="w-24 h-24 bg-lt-bg-subtle rounded-full flex items-center justify-center mb-6">
            <Smile size={48} className="text-lt-color-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-lt-text-primary mb-3">Belum Ada Catatan</h2>
          <p className="text-lt-text-secondary text-sm leading-relaxed">
            Perjalanan 14 harimu baru saja dimulai. Catatan harian dan tren mood-mu akan muncul di sini setelah kamu menyelesaikan misi pertamamu. 
            <br/><br/>
            Mari melangkah bersama, satu hari demi satu hari dengan perlahan.
          </p>
        </motion.div>
      ) : (
        <>
      {/* Mini charts - combined Mood & Anxiety */}
      {entries.length > 0 && (
        <div className="card-soft p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-lt-color-primary" />
            <h2 className="text-sm font-bold text-lt-text-primary">Tren Mood & Anxiety</h2>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-lt-color-primary/50" />
              <span className="text-[10px] text-lt-text-secondary">Mood (1-5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-destructive/50" />
              <span className="text-[10px] text-lt-text-secondary">Anxiety (1-10)</span>
            </div>
          </div>

          {/* Combined bar chart — 14 fixed slots */}
          <div className="flex items-end gap-0.5 h-20">
            {moodData.map((d) => (
              <div key={d.day} className="flex-1 flex items-end gap-px h-full">
                {/* Mood bar — scale: 1-5 → 20%-100% */}
                <div
                  className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: d.mood > 0 ? `${(d.mood / 5) * 100}%` : '2px',
                    backgroundColor: d.completed
                      ? 'var(--color-primary)'
                      : 'var(--bg-subtle)',
                    opacity: d.mood > 0 ? 0.7 : 0.2,
                  }}
                  title={d.mood > 0 ? `H${d.day} Mood: ${d.mood}/5` : `H${d.day} belum misi`}
                />
                {/* Anxiety bar — scale: 1-10 → 10%-100% */}
                <div
                  className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: d.anxiety > 0 ? `${(d.anxiety / 10) * 100}%` : '2px',
                    backgroundColor: d.completed ? '#F2D8C9' : 'var(--bg-subtle)',
                    opacity: d.anxiety > 0 ? 0.85 : 0.2,
                  }}
                  title={d.anxiety > 0 ? `H${d.day} Anxiety: ${d.anxiety}/10` : `H${d.day} belum misi`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[8px] text-lt-text-secondary mt-1">
            <span>H1</span>
            <span>H14</span>
          </div>
        </div>
      )}

      {/* Day list */}
      <div className="space-y-3">
        {trackContent.days.map((dayContent) => {
          const entry = entries.find((e) => e.dayNumber === dayContent.dayNumber);
          const isExpanded = expandedDay === dayContent.dayNumber;

          return (
            <div key={dayContent.dayNumber} className="card-soft overflow-hidden">
              <button
                onClick={() => toggleExpand(dayContent.dayNumber)}
                {...{ 'aria-expanded': isExpanded }}
                aria-label={`Lihat detail Hari ${dayContent.dayNumber}: ${dayContent.title}`}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      entry?.completed
                        ? 'bg-lt-color-primary text-white'
                        : 'bg-lt-bg-subtle text-lt-text-secondary'
                    }`}
                  >
                    {dayContent.dayNumber}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-lt-text-primary">{dayContent.title}</p>
                    <p className="text-xs text-lt-text-secondary">
                      {entry?.completed ? 'Misi selesai' : 'Belum misi'}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-lt-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && entry?.checkInData && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-lt-border-subtle">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-lt-bg-subtle rounded-xl p-3">
                          <p className="text-xs text-lt-text-secondary mb-1">Mood</p>
                          <div className="flex items-center gap-1">
                            {entry.checkInData.mood <= 2 ? (
                              <Frown size={16} className="text-destructive" />
                            ) : entry.checkInData.mood >= 4 ? (
                              <Smile size={16} className="text-lt-color-primary" />
                            ) : (
                              <Meh size={16} className="text-lt-text-secondary" />
                            )}
                            <span className="font-bold text-lt-text-primary">{entry.checkInData.mood}/5</span>
                          </div>
                        </div>
                        <div className="bg-lt-bg-subtle rounded-xl p-3">
                          <p className="text-xs text-lt-text-secondary mb-1">Anxiety</p>
                          <span className="font-bold text-destructive">{entry.checkInData.anxietyLevel}/10</span>
                        </div>
                      </div>

                      {entry.checkInData.walmagh && (
                        <div className="mb-3">
                          <p className="text-xs text-lt-text-secondary mb-1">Walmagh:</p>
                          <span
                            className={`px-2 py-1 text-xs rounded-full inline-block ${walmaghLabels[entry.checkInData.walmagh]?.className ?? ''}`}
                          >
                            {walmaghLabels[entry.checkInData.walmagh]?.label ?? entry.checkInData.walmagh}
                          </span>
                        </div>
                      )}

                      {entry.checkInData.symptoms && (
                        <div className="mb-3">
                          <p className="text-xs text-lt-text-secondary mb-1">Gejala:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(entry.checkInData.symptoms)
                              .filter(([k, v]) => k !== 'none' && v)
                              .map(([k]) => (
                                <span
                                  key={k}
                                  className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-full"
                                >
                                  {symptomLabels[k] ?? k}
                                </span>
                              ))}
                            {entry.checkInData.symptoms.none && (
                              <span className="px-2 py-1 bg-lt-color-primary/10 text-lt-color-primary text-xs rounded-full">
                                Tidak ada gejala
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {entry.checkInData.activities.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-lt-text-secondary mb-1">Aktivitas:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.checkInData.activities.map((a) => (
                              <span
                                key={a}
                                className="px-2 py-1 bg-lt-color-primary/10 text-lt-color-primary text-xs rounded-full"
                              >
                                {activityLabels[a] ?? a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.checkInData.notes && (
                        <div className="bg-lt-bg-subtle rounded-xl p-3">
                          <p className="text-xs text-lt-text-secondary mb-1">Catatan:</p>
                          <p className="text-sm text-lt-text-primary italic">"{entry.checkInData.notes}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}
