import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageItem } from '@/hooks/useStorage';
import { allTrackContent } from '@/data/content';
import type { UserProfile, DayEntry } from '@/types';
import { ChevronDown, TrendingUp, Frown, Smile, Meh } from 'lucide-react';

export default function History() {
  const profile = getStorageItem<UserProfile>('lt-profile');
  const entries = getStorageItem<DayEntry[]>('lt-entries') || [];
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  if (!profile) return null;
  const trackContent = allTrackContent[profile.track];

  // Build chart data
  const moodData = entries.map((e) => ({
    day: e.dayNumber,
    mood: e.checkInData?.mood || 0,
    anxiety: e.checkInData?.anxietyLevel || 0,
  }));

  const maxAnxiety = 10;
  const maxMood = 5;

  const toggleExpand = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="page-container pb-20">
      <h1 className="text-2xl font-bold text-[#3D322B] mb-2">Riwayat 14 Hari</h1>
      <p className="text-[#6B5B4F] text-sm mb-6">Perjalanan dan pola harianmu.</p>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center p-8 mt-12 bg-white rounded-3xl border border-[#E8E2D5] shadow-sm"
        >
          <div className="w-24 h-24 bg-[#E8E2D5] rounded-full flex items-center justify-center mb-6">
            <Smile size={48} className="text-[#8FBC8F]" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-[#3D322B] mb-3">Belum Ada Catatan</h2>
          <p className="text-[#6B5B4F] text-sm leading-relaxed">
            Perjalanan 14 harimu baru saja dimulai. Catatan harian dan tren mood-mu akan muncul di sini setelah kamu melakukan check-in pertamamu. 
            <br/><br/>
            Mari melangkah bersama, satu hari demi satu hari dengan perlahan.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Mini charts */}
      {moodData.length > 1 && (
        <div className="card-soft p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[#8FBC8F]" />
            <h2 className="text-sm font-bold text-[#3D322B]">Tren Mood & Anxiety</h2>
          </div>

          {/* Mood bars */}
          <div className="mb-4">
            <p className="text-xs text-[#6B5B4F] mb-2">Mood (1-5)</p>
            <div className="flex items-end gap-1 h-16">
              {moodData.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 bg-[#8FBC8F]/30 rounded-t-sm relative group"
                  style={{ height: `${(d.mood / maxMood) * 100}%` }}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-[#6B5B4F] opacity-0 group-hover:opacity-100">
                    {d.mood}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-[#6B5B4F] mt-1">
              <span>H1</span>
              <span>H{moodData[moodData.length - 1]?.day}</span>
            </div>
          </div>

          {/* Anxiety line (simple) */}
          <div>
            <p className="text-xs text-[#6B5B4F] mb-2">Anxiety (1-10)</p>
            <svg viewBox="0 0 100 40" className="w-full h-10">
              <polyline
                fill="none"
                stroke="#C4A484"
                strokeWidth="2"
                points={moodData
                  .map(
                    (d, i) =>
                      `${(i / (moodData.length - 1)) * 100},${40 - (d.anxiety / maxAnxiety) * 40}`
                  )
                  .join(' ')}
              />
              {moodData.map((d, i) => (
                <circle
                  key={i}
                  cx={(i / (moodData.length - 1)) * 100}
                  cy={40 - (d.anxiety / maxAnxiety) * 40}
                  r="2"
                  fill="#C4A484"
                />
              ))}
            </svg>
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
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      entry?.completed
                        ? 'bg-[#4A7C59] text-white'
                        : 'bg-[#E8E2D5] text-[#B5ADA0]'
                    }`}
                  >
                    {dayContent.dayNumber}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#3D322B]">{dayContent.title}</p>
                    <p className="text-xs text-[#6B5B4F]">
                      {entry?.completed ? 'Check-in selesai' : 'Belum check-in'}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#B5ADA0] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                    <div className="px-4 pb-4 pt-1 border-t border-[#E8E2D5]">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-[#F7F5F0] rounded-xl p-3">
                          <p className="text-xs text-[#B5ADA0] mb-1">Mood</p>
                          <div className="flex items-center gap-1">
                            {entry.checkInData.mood <= 2 ? (
                              <Frown size={16} className="text-[#C4A484]" />
                            ) : entry.checkInData.mood >= 4 ? (
                              <Smile size={16} className="text-[#8FBC8F]" />
                            ) : (
                              <Meh size={16} className="text-[#B5ADA0]" />
                            )}
                            <span className="font-bold text-[#3D322B]">{entry.checkInData.mood}/5</span>
                          </div>
                        </div>
                        <div className="bg-[#F7F5F0] rounded-xl p-3">
                          <p className="text-xs text-[#B5ADA0] mb-1">Anxiety</p>
                          <span className="font-bold text-[#C4A484]">{entry.checkInData.anxietyLevel}/10</span>
                        </div>
                      </div>

                      {entry.checkInData.symptoms && (
                        <div className="mb-3">
                          <p className="text-xs text-[#B5ADA0] mb-1">Gejala:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(entry.checkInData.symptoms)
                              .filter(([k, v]) => k !== 'none' && v)
                              .map(([k]) => (
                                <span
                                  key={k}
                                  className="px-2 py-1 bg-[#C4A484]/10 text-[#C4A484] text-xs rounded-full"
                                >
                                  {k === 'heartburn'
                                    ? 'Panas dada'
                                    : k === 'bloating'
                                    ? 'Kembung'
                                    : k === 'nausea'
                                    ? 'Mual'
                                    : k === 'chestTightness'
                                    ? 'Nyeri ulu hati'
                                    : 'Sulit menelan'}
                                </span>
                              ))}
                            {entry.checkInData.symptoms.none && (
                              <span className="px-2 py-1 bg-[#8FBC8F]/10 text-[#8FBC8F] text-xs rounded-full">
                                Tidak ada gejala
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {entry.checkInData.activities.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-[#B5ADA0] mb-1">Aktivitas:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.checkInData.activities.map((a) => (
                              <span
                                key={a}
                                className="px-2 py-1 bg-[#8FBC8F]/10 text-[#8FBC8F] text-xs rounded-full"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.checkInData.notes && (
                        <div className="bg-[#F7F5F0] rounded-xl p-3">
                          <p className="text-xs text-[#B5ADA0] mb-1">Catatan:</p>
                          <p className="text-sm text-[#3D322B] italic">"{entry.checkInData.notes}"</p>
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
