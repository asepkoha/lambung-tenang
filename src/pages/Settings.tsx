import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStorageItem, setStorageItem, exportData, importData, clearAllData } from '@/hooks/useStorage';
import { useNotification } from '@/hooks/useAudio';
import type { AppSettings, UserProfile, DayEntry, VoiceContext } from '@/types';
import { Bell, Download, Upload, Trash2, Info, ChevronRight, Leaf, Clock, FlaskConical, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useDoseSchedule } from '@/hooks/useDoseSchedule';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const defaultSettings: AppSettings = {
  reminderEnabled: false,
  reminderTime: '08:00',
  autoPlayVoice: false,
  onboardingDone: true,
};

// Generate time options with 30-minute intervals from 06:00 to 22:00
const generateTimeOptions = () => {
  const options: { value: string; label: string }[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (const minute of [0, 30]) {
      const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayLabel = `${hour.toString().padStart(2, '0')}.${minute.toString().padStart(2, '0')}`;
      options.push({ value: timeValue, label: displayLabel });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export default function Settings() {
  const notification = useNotification();
  const { isDark, toggleTheme } = useTheme();
  const { offset, setOffset, schedule, frekuensi } = useDoseSchedule();
  const [settings, setSettings] = useState<AppSettings>(() => {
    return getStorageItem<AppSettings>('lt-settings') || defaultSettings;
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importError, setImportError] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationBlocked, setNotificationBlocked] = useState(false);

  useEffect(() => {
    setStorageItem('lt-settings', settings);
  }, [settings]);

  // Save notification time separately
  useEffect(() => {
    setStorageItem('notificationTime', settings.reminderTime);
  }, [settings.reminderTime]);

  const toggleReminder = () => {
    if (!settings.reminderEnabled) {
      // Show custom modal instead of native prompt
      setShowNotificationModal(true);
    } else {
      setSettings((s) => ({ ...s, reminderEnabled: false }));
    }
  };

  const handleAllowNotification = async () => {
    setShowNotificationModal(false);
    // Request permission silently
    const granted = await notification.requestPermission();
    if (granted) {
      setSettings((s) => ({ ...s, reminderEnabled: true }));
      notification.sendNotification('Pengingat aktif', 'Lambung Tenang akan mengingatkanmu setiap hari.');
    } else {
      setNotificationBlocked(true);
    }
  };

  const handleDenyNotification = () => {
    setShowNotificationModal(false);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lambung-tenang-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        if (importData(text)) {
          setImportError('');
          window.location.reload();
        } else {
          setImportError('File tidak valid.');
        }
      } catch {
        setImportError('Gagal membaca file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = () => {
    clearAllData();
    window.location.href = '/';
  };

  // Simulate 14 days of check-in data (dev helper)
  const simulate14Days = () => {
    const profile = getStorageItem<UserProfile>('lt-profile');
    if (!profile) {
      alert('Buat profil dulu sebelum simulasi');
      return;
    }

    const entries: DayEntry[] = [];
    const today = new Date();

    for (let day = 1; day <= 14; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (14 - day));

      // Random realistic data
      const mood = Math.floor(Math.random() * 5) + 1;
      const anxietyLevel = Math.floor(Math.random() * 10) + 1;
      const walmaghOptions: ('sesuai' | 'tidak_sesuai' | 'belum')[] = ['sesuai', 'tidak_sesuai', 'belum'];
      const activitiesPool = ['napas', 'jalan', 'meditasi', 'musik', 'none'];
      const symptomsPool = ['heartburn', 'bloating', 'nausea', 'reflux', 'none'];

      entries.push({
        dayNumber: day,
        date: date.toISOString(),
        completed: true,
        checkInData: {
          mood,
          anxietyLevel,
          symptoms: {
            heartburn: symptomsPool[Math.floor(Math.random() * symptomsPool.length)] === 'heartburn',
            bloating: symptomsPool[Math.floor(Math.random() * symptomsPool.length)] === 'bloating',
            nausea: symptomsPool[Math.floor(Math.random() * symptomsPool.length)] === 'nausea',
            chestTightness: symptomsPool[Math.floor(Math.random() * symptomsPool.length)] === 'reflux',
            swallowingDifficulty: false,
            none: symptomsPool[Math.floor(Math.random() * symptomsPool.length)] === 'none',
          },
          triggers: Math.random() > 0.5 ? ['kopi'] : [],
          sleepHours: Math.floor(Math.random() * 4) + 5, // 5-8 hours
          sleepQuality: Math.floor(Math.random() * 3) + 2, // 2-4
          activities: activitiesPool.slice(0, Math.floor(Math.random() * 2) + 1),
          notes: 'Simulasi harian ' + day,
          walmagh: walmaghOptions[Math.floor(Math.random() * walmaghOptions.length)],
        },
        voiceNotePlayed: true,
        voiceNoteContext: ['morning', 'comfort', 'celebrate', 'acknowledge'][Math.floor(Math.random() * 4)] as VoiceContext,
      });
    }

    // Update startDate to 14 days ago so currentDay becomes 15 (isComplete = true)
    const newStartDate = new Date(today);
    newStartDate.setDate(newStartDate.getDate() - 14);
    
    setStorageItem('lt-entries', entries);
    setStorageItem('lt-profile', {
      ...profile,
      startDate: newStartDate.toISOString(),
    });
    
    window.location.reload();
  };

  const profile = getStorageItem<UserProfile>('lt-profile');

  return (
    <div className="page-container pb-20 dark:text-dark-text">
      <h1 className="text-2xl font-bold text-sage-text dark:text-dark-text mb-6">Pengaturan</h1>

      {/* Profile card */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft p-5 mb-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center">
            <Leaf size={24} className="text-sage" />
          </div>
          <div>
            <p className="font-bold text-sage-text dark:text-dark-text">{profile.name}</p>
            <p className="text-xs text-sage-muted dark:text-dark-muted">
              {profile.track === 'A' ? 'Jalur Ketenangan' : profile.track === 'B' ? 'Jalur Fisik' : 'Jalur Berat Bersama'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Mode Malam */}
      <div className="card-soft p-5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon size={20} className="text-sage dark:text-dark-primary-light" />
            <div>
              <p className="font-medium text-sage-text dark:text-dark-text">Mode Malam</p>
              <p className="text-xs text-sage-muted dark:text-dark-muted">Tampilan gelap untuk malam hari</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              isDark ? 'bg-dark-primary' : 'bg-sage-light'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                isDark ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reminder */}
      <div className="card-soft p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-sage" />
            <div>
              <p className="font-medium text-sage-text dark:text-dark-text">Pengingat Harian</p>
              <p className="text-xs text-sage-muted dark:text-dark-muted">Kami ingatkan dengan lembut</p>
            </div>
          </div>
          <button
            onClick={toggleReminder}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              settings.reminderEnabled ? 'bg-sage' : 'bg-sage-light dark:bg-dark-disabled'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                settings.reminderEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {settings.reminderEnabled && (
          <div className="pt-3 border-t border-sage-light dark:border-dark-disabled">
            <label className="text-xs text-sage-muted dark:text-dark-muted mb-2 block">Waktu pengingat</label>
            <div className="relative">
              <Select
                value={settings.reminderTime}
                onValueChange={(value) => setSettings((s) => ({ ...s, reminderTime: value }))}
              >
                <SelectTrigger className="w-full h-11 px-3 rounded-xl border-sage bg-white text-sage-text focus:ring-sage focus:ring-offset-0">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-sage" />
                    <SelectValue placeholder="Pilih waktu" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-sage bg-white">
                  {timeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="focus:bg-sage-light focus:text-sage cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {notificationBlocked && (
          <div className="pt-3 border-t border-sage-light">
            <p className="text-xs text-destructive">
              Notifikasi diblokir. Buka pengaturan browser untuk mengizinkan.
            </p>
          </div>
        )}
      </div>

      {/* Pengaturan Dosis Walmagh */}
      <div className="card-soft p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-sage dark:text-dark-primary-light" />
          <div>
            <p className="font-medium text-sage-text dark:text-dark-text">Jadwal Minum Walmagh</p>
            <p className="text-xs text-sage-muted dark:text-dark-muted">Sesuaikan jam dosis ke rutinitas harianmu</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-sage-light/30 dark:bg-dark-disabled/30 p-1 rounded-xl mb-4">
          {[-2, -1, 0, 1, 2].map((val) => (
            <button
              key={val}
              onClick={() => setOffset(val)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                offset === val 
                  ? 'bg-white dark:bg-dark-surface shadow-sm text-sage-text dark:text-dark-text' 
                  : 'text-sage-muted dark:text-dark-muted hover:bg-white/50 dark:hover:bg-dark-surface/50'
              }`}
            >
              {val === 0 ? 'Default' : val > 0 ? `+${val} jam` : `${val} jam`}
            </button>
          ))}
        </div>
        
        <div className="pt-3 border-t border-sage-light dark:border-dark-disabled">
          <p className="text-[11px] text-sage-muted dark:text-dark-muted mb-2">Preview Jadwal ({frekuensi}x sehari):</p>
          <div className="flex gap-2 flex-wrap">
            {schedule.map((jam, i) => (
              <span key={i} className="text-xs font-medium text-sage-text dark:text-dark-text bg-sage/10 px-2 py-1 rounded-md">
                {i === 0 ? 'Pagi' : i === 1 && frekuensi === 3 ? 'Siang' : 'Malam'}: {jam.toString().padStart(2, '0')}.00
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Data management */}
      <div className="card-soft overflow-hidden mb-4">
        <button
          onClick={handleExport}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-sage-light/50 dark:hover:bg-dark-disabled/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Download size={20} className="text-sage dark:text-dark-primary-light" />
            <span className="text-sage-text dark:text-dark-text">Export Data</span>
          </div>
          <ChevronRight size={18} className="text-sage-muted dark:text-dark-muted" />
        </button>

        <label className="w-full p-4 flex items-center justify-between text-left hover:bg-sage-light/50 dark:hover:bg-dark-disabled/50 transition-colors cursor-pointer border-t border-sage-light dark:border-dark-disabled">
          <div className="flex items-center gap-3">
            <Upload size={20} className="text-destructive" />
            <span className="text-sage-text dark:text-dark-text">Import Data</span>
          </div>
          <ChevronRight size={18} className="text-sage-muted dark:text-dark-muted" />
          <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </label>

        {importError && (
          <p className="px-4 pb-3 text-xs text-destructive">{importError}</p>
        )}
      </div>

      {/* Dev Tools - Only for Kang AsepDev */}
      {profile?.name === 'Kang AsepDev' && (
        <div className="card-soft overflow-hidden mb-6">
          <button
            onClick={simulate14Days}
            className="w-full p-4 flex items-center gap-3 text-left hover:bg-sage-light/50 transition-colors text-sage"
          >
            <FlaskConical size={20} />
            <span>Simulasi Selesai 14 Hari (Dev)</span>
          </button>
        </div>
      )}

      {/* Danger zone */}
      <div className="card-soft overflow-hidden mb-6">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-sage-light/50 dark:hover:bg-dark-disabled/50 transition-colors text-destructive"
        >
          <Trash2 size={20} />
          <span>Hapus Semua Data</span>
        </button>
      </div>

      {/* About */}
      <div className="card-soft p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Info size={20} className="text-sage-muted dark:text-dark-muted" />
          <h3 className="font-bold text-sage-text dark:text-dark-text">Tentang</h3>
        </div>
        <p className="text-xs text-sage-muted dark:text-dark-muted leading-relaxed mb-3">
          Lambung Tenang adalah aplikasi pendamping untuk perjalanan 14 hari ikhtiar pemulihan GERD-Anxiety.
          Dibuat dari pengalaman pribadi, bukan pengganti medis.
        </p>
        <p className="text-xs text-sage-muted dark:text-dark-muted leading-relaxed">
          Semua data tersimpan lokal di perangkatmu. Tidak ada server, tidak ada yang mengintai.
          Kamu punya kendali penuh atas data dan suaramu.
        </p>
      </div>

      <p className="text-center text-xs text-sage-muted/50 dark:text-dark-muted/50">Lambung Tenang v1.0</p>

      {/* Notification permission modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-sage-text dark:text-dark-text mb-2">Izinkan Pengingat?</h3>
            <p className="text-sm text-sage-muted dark:text-dark-muted mb-6">
              Kami akan mengingatkan Anda untuk check-in setiap hari melalui notifikasi aplikasi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDenyNotification}
                className="btn-secondary flex-1 text-sm h-12"
              >
                Nanti
              </button>
              <button
                onClick={handleAllowNotification}
                className="btn-primary flex-1 text-sm h-12"
              >
                Izinkan
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-surface rounded-3xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-sage-text dark:text-dark-text mb-2">Hapus Semua Data?</h3>
            <p className="text-sm text-sage-muted dark:text-dark-muted mb-6">
              Tindakan ini tidak bisa dibatalkan. Semua check-in, profil, dan pengaturan akan hilang.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1 text-sm h-12"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 h-12 bg-destructive text-white rounded-full font-semibold text-sm active:scale-[0.98] transition-all"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}