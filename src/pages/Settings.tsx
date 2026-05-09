import { useState } from 'react';
import { motion } from 'framer-motion';
import { exportData, importData, clearAllData } from '@/hooks/useStorage';
import { useNotification } from '@/hooks/useNotification';
import type { DayEntry, VoiceContext } from '@/types';
import { Bell, Download, Upload, Trash2, Info, ChevronRight, Leaf, Clock, FlaskConical, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useDoseSchedule } from '@/hooks/useDoseSchedule';
import { useProfile } from '@/hooks/useProfile';
import { useEntries } from '@/hooks/useEntries';
import { useSettings } from '@/hooks/useSettings';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Generate time options with 30-minute intervals from 06:00 to 22:00
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
  const { settings, setSettings } = useSettings();
  const { profile, updateProfile } = useProfile();
  const { setEntries } = useEntries();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importError, setImportError] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationBlocked, setNotificationBlocked] = useState(false);

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
    
    setEntries(entries);
    updateProfile({
      ...profile,
      startDate: newStartDate.toISOString(),
    });
    
    window.location.reload();
  };



  return (
    <div className="page-container pb-20 dark:text-lt-text-primary">
      <h1 className="text-2xl font-bold text-lt-text-primary mb-6">Pengaturan</h1>

      {/* Profile card */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft p-5 mb-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-lt-color-primary/10 rounded-full flex items-center justify-center">
            <Leaf size={24} className="text-lt-color-primary" />
          </div>
          <div>
            <p className="font-bold text-lt-text-primary">{profile.name}</p>
            <p className="text-xs text-lt-text-secondary">
              {((profile.track as string) === 'A' || (profile.track as string) === 'ketenangan') ? 'Jalur Ketenangan' :
               ((profile.track as string) === 'B' || (profile.track as string) === 'kenyamanan') ? 'Jalur Kenyamanan' : 'Jalur Pulih Menyeluruh'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Mode Malam */}
      <div className="card-soft p-5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon size={20} className="text-lt-color-primary" />
            <div>
              <p className="font-medium text-lt-text-primary">Mode Malam</p>
              <p className="text-xs text-lt-text-secondary">Tampilan gelap untuk malam hari</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Malam"}
            title={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Malam"}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              isDark ? 'bg-lt-color-primary' : 'bg-lt-bg-subtle'
            }`}
          >
            <div
              className={`w-5 h-5 bg-lt-bg-surface rounded-full absolute top-1 transition-all shadow-sm ${
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
            <Bell size={20} className="text-lt-color-primary" />
            <div>
              <p className="font-medium text-lt-text-primary">Pengingat Harian</p>
              <p className="text-xs text-lt-text-secondary">Kami ingatkan dengan lembut</p>
            </div>
          </div>
          <button
            onClick={toggleReminder}
            aria-label={settings.reminderEnabled ? "Matikan Pengingat" : "Aktifkan Pengingat"}
            title={settings.reminderEnabled ? "Matikan Pengingat" : "Aktifkan Pengingat"}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              settings.reminderEnabled ? 'bg-lt-color-primary' : 'bg-lt-bg-subtle'
            }`}
          >
            <div
              className={`w-5 h-5 bg-lt-bg-surface rounded-full absolute top-1 transition-all shadow-sm ${
                settings.reminderEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {settings.reminderEnabled && (
          <div className="pt-3 border-t border-lt-border-subtle">
            <label className="text-xs text-lt-text-secondary mb-2 block">Waktu pengingat</label>
            <div className="relative">
              <Select
                value={settings.reminderTime}
                onValueChange={(value) => setSettings((s) => ({ ...s, reminderTime: value }))}
              >
                <SelectTrigger className="w-full h-11 px-3 rounded-xl border-lt-border-subtle bg-lt-bg-surface text-lt-text-primary focus:ring-lt-color-primary focus:ring-offset-0">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-lt-color-primary" />
                    <SelectValue placeholder="Pilih waktu" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-lt-border-subtle bg-lt-bg-surface">
                  {timeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="focus:bg-lt-bg-subtle focus:text-lt-color-primary cursor-pointer"
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
          <div className="pt-3 border-t border-lt-border-subtle">
            <p className="text-xs text-destructive">
              Notifikasi diblokir. Buka pengaturan browser untuk mengizinkan.
            </p>
          </div>
        )}
      </div>

      {/* Pengaturan Dosis Walmagh */}
      <div className="card-soft p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-lt-color-primary" />
          <div>
            <p className="font-medium text-lt-text-primary">Jadwal Minum Walmagh</p>
            <p className="text-xs text-lt-text-secondary">Sesuaikan jam dosis ke rutinitas harianmu</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-lt-bg-subtle/30 p-1 rounded-xl mb-4">
          {[-2, -1, 0, 1, 2].map((val) => (
            <button
              key={val}
              onClick={() => setOffset(val)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                offset === val 
                  ? 'bg-lt-bg-surface shadow-sm text-lt-text-primary' 
                  : 'text-lt-text-secondary hover:bg-lt-bg-surface/50'
              }`}
            >
              {val === 0 ? 'Default' : val > 0 ? `+${val} jam` : `${val} jam`}
            </button>
          ))}
        </div>
        
        <div className="pt-3 border-t border-lt-border-subtle">
          <p className="text-[11px] text-lt-text-secondary mb-2">Preview Jadwal ({frekuensi}x sehari):</p>
          <div className="flex gap-2 flex-wrap">
            {schedule.map((jam, i) => (
              <span key={i} className="text-xs font-medium text-lt-text-primary bg-lt-color-primary/10 px-2 py-1 rounded-md">
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
          className="w-full p-4 flex items-center justify-between text-left hover:bg-lt-bg-subtle/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Download size={20} className="text-lt-color-primary" />
            <span className="text-lt-text-primary">Export Data</span>
          </div>
          <ChevronRight size={18} className="text-lt-text-secondary" />
        </button>

        <label className="w-full p-4 flex items-center justify-between text-left hover:bg-lt-bg-subtle/50 transition-colors cursor-pointer border-t border-lt-border-subtle">
          <div className="flex items-center gap-3">
            <Upload size={20} className="text-destructive" />
            <span className="text-lt-text-primary">Import Data</span>
          </div>
          <ChevronRight size={18} className="text-lt-text-secondary" />
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
            className="w-full p-4 flex items-center gap-3 text-left hover:bg-lt-color-primary/10 transition-colors text-lt-color-primary"
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
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-lt-bg-subtle/50 transition-colors text-destructive"
        >
          <Trash2 size={20} />
          <span>Hapus Semua Data</span>
        </button>
      </div>

      {/* About */}
      <div className="card-soft p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Info size={20} className="text-lt-text-secondary" />
          <h3 className="font-bold text-lt-text-primary">Tentang</h3>
        </div>
        <p className="text-xs text-lt-text-secondary leading-relaxed mb-3">
          Lambung Tenang adalah aplikasi pendamping untuk perjalanan 14 hari ikhtiar pemulihan GERD-Anxiety.
          Dibuat dari pengalaman pribadi, bukan pengganti medis.
        </p>
        <p className="text-xs text-lt-text-secondary leading-relaxed">
          Semua data tersimpan lokal di perangkatmu. Tidak ada server, tidak ada yang mengintai.
          Kamu punya kendali penuh atas data dan suaramu.
        </p>
      </div>

      <p className="text-center text-xs text-lt-text-muted/30">Lambung Tenang v1.0</p>

      {/* Notification permission modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-lt-bg-surface rounded-2xl shadow-lg p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-lt-text-primary mb-2">Izinkan Pengingat?</h3>
            <p className="text-sm text-lt-text-secondary mb-6">
              Kami akan mengingatkan Anda untuk menyelesaikan misi setiap hari melalui notifikasi aplikasi.
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
            className="bg-lt-bg-surface rounded-3xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-lt-text-primary mb-2">Hapus Semua Data?</h3>
            <p className="text-sm text-lt-text-secondary mb-6">
              Tindakan ini tidak bisa dibatalkan. Semua misi, profil, dan pengaturan akan hilang.
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