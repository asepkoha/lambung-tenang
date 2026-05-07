export const MOOD_OPTIONS = [
  { value: 1, label: 'Sangat Buruk', emoji: '😫' },
  { value: 2, label: 'Buruk', emoji: '😔' },
  { value: 3, label: 'Biasa Saja', emoji: '😐' },
  { value: 4, label: 'Baik', emoji: '🙂' },
  { value: 5, label: 'Sangat Baik', emoji: '😊' },
];

export const SYMPTOM_LIST = [
  { id: 'nausea', label: 'Mual' },
  { id: 'bloating', label: 'Kembung' },
  { id: 'heartburn', label: 'Nyeri Ulu Hati' },
  { id: 'reflux', label: 'Asam Naik' },
  { id: 'none', label: 'Tidak Ada' },
];

export const ACTIVITY_LIST = [
  { id: 'napas', label: 'Latihan Napas' },
  { id: 'jalan', label: 'Jalan Santai' },
  { id: 'meditasi', label: 'Dzikir Pagi/Sore' },
  { id: 'musik', label: 'No Scrolling' },
  { id: 'none', label: 'Tidak Ada' },
];

export const WALMAGH_OPTIONS = [
  { id: 'sesuai', label: 'Sudah, Sesuai Dosis' },
  { id: 'tidak_sesuai', label: 'Sudah, Tidak Sesuai Dosis' },
  { id: 'belum', label: 'Belum' },
] as const;
