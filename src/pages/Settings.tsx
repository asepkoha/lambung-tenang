import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStorageItem, setStorageItem, exportData, importData, clearAllData } from '@/hooks/useStorage';
import { useNotification } from '@/hooks/useAudio';
import type { AppSettings, UserProfile } from '@/types';
import { Bell, Download, Upload, Trash2, Info, ChevronRight, Leaf, Clock } from 'lucide-react';
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

  const profile = getStorageItem<UserProfile>('lt-profile');

  return (
    <div className="page-container pb-20">
      <h1 className="text-2xl font-bold text-[#3D322B] mb-6">Pengaturan</h1>

      {/* Profile card */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft p-5 mb-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-[#8FBC8F]/10 rounded-full flex items-center justify-center">
            <Leaf size={24} className="text-[#8FBC8F]" />
          </div>
          <div>
            <p className="font-bold text-[#3D322B]">{profile.name}</p>
            <p className="text-xs text-[#6B5B4F]">
              {profile.track === 'A' ? 'Jalur Perasaan' : profile.track === 'B' ? 'Jalur Fisik' : 'Jalur Berat Bersama'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Reminder */}
      <div className="card-soft p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-[#8FBC8F]" />
            <div>
              <p className="font-medium text-[#3D322B]">Pengingat Harian</p>
              <p className="text-xs text-[#6B5B4F]">Kami ingatkan dengan lembut</p>
            </div>
          </div>
          <button
            onClick={toggleReminder}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              settings.reminderEnabled ? 'bg-[#6B8E5A]' : 'bg-[#EDE9E3]'
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
          <div className="pt-3 border-t border-[#F7F5F0]">
            <label className="text-xs text-[#6B5B4F] mb-2 block">Waktu pengingat</label>
            <div className="relative">
              <Select
                value={settings.reminderTime}
                onValueChange={(value) => setSettings((s) => ({ ...s, reminderTime: value }))}
              >
                <SelectTrigger className="w-full h-11 px-3 rounded-xl border-[#6B8E5A] bg-white text-[#2D2D2D] focus:ring-[#6B8E5A] focus:ring-offset-0">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#6B8E5A]" />
                    <SelectValue placeholder="Pilih waktu" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#6B8E5A] bg-white">
                  {timeOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="focus:bg-[#E8F0E3] focus:text-[#6B8E5A] cursor-pointer"
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
          <div className="pt-3 border-t border-[#F7F5F0]">
            <p className="text-xs text-[#C4A484]">
              Notifikasi diblokir. Buka pengaturan browser untuk mengizinkan.
            </p>
          </div>
        )}
      </div>

      {/* Data management */}
      <div className="card-soft overflow-hidden mb-4">
        <button
          onClick={handleExport}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7F5F0] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Download size={20} className="text-[#8FBC8F]" />
            <span className="text-[#3D322B]">Export Data</span>
          </div>
          <ChevronRight size={18} className="text-[#B5ADA0]" />
        </button>

        <label className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7F5F0] transition-colors cursor-pointer border-t border-[#F7F5F0]">
          <div className="flex items-center gap-3">
            <Upload size={20} className="text-[#C4A484]" />
            <span className="text-[#3D322B]">Import Data</span>
          </div>
          <ChevronRight size={18} className="text-[#B5ADA0]" />
          <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </label>

        {importError && (
          <p className="px-4 pb-3 text-xs text-[#C4A484]">{importError}</p>
        )}
      </div>

      {/* Danger zone */}
      <div className="card-soft overflow-hidden mb-6">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-[#F7F5F0] transition-colors text-[#C4A484]"
        >
          <Trash2 size={20} />
          <span>Hapus Semua Data</span>
        </button>
      </div>

      {/* About */}
      <div className="card-soft p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Info size={20} className="text-[#B5ADA0]" />
          <h3 className="font-bold text-[#3D322B]">Tentang</h3>
        </div>
        <p className="text-xs text-[#6B5B4F] leading-relaxed mb-3">
          Lambung Tenang adalah aplikasi pendamping untuk perjalanan 14 hari ikhtiar pemulihan GERD-Anxiety. 
          Dibuat dari pengalaman pribadi, bukan pengganti medis.
        </p>
        <p className="text-xs text-[#6B5B4F] leading-relaxed">
          Semua data tersimpan lokal di perangkatmu. Tidak ada server, tidak ada yang mengintai. 
          Kamu punya kendali penuh atas data dan suaramu.
        </p>
      </div>

      <p className="text-center text-xs text-[#6B5B4F]/50">Lambung Tenang v1.0</p>

      {/* Notification permission modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">Izinkan Pengingat?</h3>
            <p className="text-sm text-[#6B6B6B] mb-6">
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
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-[#3D322B] mb-2">Hapus Semua Data?</h3>
            <p className="text-sm text-[#6B5B4F] mb-6">
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
                className="flex-1 h-12 bg-[#C4A484] text-white rounded-full font-semibold text-sm active:scale-[0.98] transition-all"
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