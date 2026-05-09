import type { DayAudio, UniversalAudio, Track } from '@/types';

// Track A — Ketenangan (Anxiety)
export const TRACK_A: DayAudio[] = [
  { day: 0, track: 'A', morningAudioUrl: '/audio/A/0_morning.mp3', morningTitle: 'Menjemput Rasa Aman', isUnlocked: false },
  { day: 1, track: 'A', morningAudioUrl: '/audio/A/01_morning.mp3', morningTitle: 'Menjemput Rasa Aman', isUnlocked: false },
  { day: 2, track: 'A', morningAudioUrl: '/audio/A/2_morning.mp3', morningTitle: 'Memberi Izin untuk Lelah', isUnlocked: false },
  { day: 3, track: 'A', morningAudioUrl: '/audio/A/3_morning.mp3', morningTitle: 'Mengenal Sinyal, Bukan Ancaman', isUnlocked: false },
  { day: 4, track: 'A', morningAudioUrl: '/audio/A/4_morning.mp3', morningTitle: 'Menanam Akar di Bawah Tanah', isUnlocked: false },
  { day: 5, track: 'A', morningAudioUrl: '/audio/A/5_morning.mp3', morningTitle: 'Rahasia Otak Kedua', isUnlocked: false },
  { day: 6, track: 'A', morningAudioUrl: '/audio/A/6_morning.mp3', morningTitle: 'Gerak Sadar (Jalan Kaki sebagai Terapi)', isUnlocked: false },
  { day: 7, track: 'A', morningAudioUrl: '/audio/A/7_morning.mp3', morningTitle: 'Merayakan Jeda dan Kemenangan Kecil', isUnlocked: false },
  { day: 8, track: 'A', morningAudioUrl: '/audio/A/8_morning.mp3', morningTitle: 'Melepaskan Genggaman yang Melelahkan', isUnlocked: false },
  { day: 9, track: 'A', morningAudioUrl: '/audio/A/9_morning.mp3', morningTitle: 'Membangun Kembali Kepercayaan Diri', isUnlocked: false },
  { day: 10, track: 'A', morningAudioUrl: '/audio/A/10_morning.mp3', morningTitle: 'Membangun Benteng Harian', isUnlocked: false },
  { day: 11, track: 'A', morningAudioUrl: '/audio/A/11_morning.mp3', morningTitle: 'Menghadapi Badai yang Kembali Datang', isUnlocked: false },
  { day: 12, track: 'A', morningAudioUrl: '/audio/A/12_morning.mp3', morningTitle: 'Berteman dengan Ketidakpastian', isUnlocked: false },
  { day: 13, track: 'A', morningAudioUrl: '/audio/A/13_morning.mp3', morningTitle: 'Menemukan Versi Baru Dirimu', isUnlocked: false },
  { day: 14, track: 'A', morningAudioUrl: '/audio/A/14_morning.mp3', morningTitle: 'Perjalanan Pulang Menuju Tenang', isUnlocked: false },
];

// Track B — Kenyamanan (GERD)
export const TRACK_B: DayAudio[] = [
  { day: 0, track: 'B', morningAudioUrl: '/audio/G/0_morning.mp3', morningTitle: 'Lambungmu Bukan Musuhmu', isUnlocked: false },
  { day: 1, track: 'B', morningAudioUrl: '/audio/G/1_morning.mp3', morningTitle: 'Mengenal Cara Kerja Lambungmu', isUnlocked: false },
  { day: 2, track: 'B', morningAudioUrl: '/audio/G/2_morning.mp3', morningTitle: 'Hubungan Makanan dan Perasaanmu', isUnlocked: false },
  { day: 3, track: 'B', morningAudioUrl: '/audio/G/3_morning.mp3', morningTitle: 'Tiga Kebiasaan Kecil yang Besar Dampaknya', isUnlocked: false },
  { day: 4, track: 'B', morningAudioUrl: '/audio/G/4_morning.mp3', morningTitle: 'Makanan Teman dan Makanan Pemicu', isUnlocked: false },
  { day: 5, track: 'B', morningAudioUrl: '/audio/G/5_morning.mp3', morningTitle: 'Stres dan Asam Lambung — Koneksi Nyata', isUnlocked: false },
  { day: 6, track: 'B', morningAudioUrl: '/audio/G/6_morning.mp3', morningTitle: 'Tidur dan Lambung yang Tidak Bisa Dipisahkan', isUnlocked: false },
  { day: 7, track: 'B', morningAudioUrl: '/audio/G/7_morning.mp3', morningTitle: 'Separuh Jalan — Tubuhmu Sedang Berproses', isUnlocked: false },
  { day: 8, track: 'B', morningAudioUrl: '/audio/G/8_morning.mp3', morningTitle: 'Minuman yang Sering Dilupakan', isUnlocked: false },
  { day: 9, track: 'B', morningAudioUrl: '/audio/G/9_morning.mp3', morningTitle: 'Konsistensi Lebih Penting dari Kesempurnaan', isUnlocked: false },
  { day: 10, track: 'B', morningAudioUrl: '/audio/G/10_morning.mp3', morningTitle: 'Membangun Pola Makan Jangka Panjang', isUnlocked: false },
  { day: 11, track: 'B', morningAudioUrl: '/audio/G/11_morning.mp3', morningTitle: 'Ketika Gejala Kambuh — Ini yang Perlu Dilakukan', isUnlocked: false },
  { day: 12, track: 'B', morningAudioUrl: '/audio/G/12_morning.mp3', morningTitle: 'Suplemen dan Herbal — Memahami Perannya', isUnlocked: false },
  { day: 13, track: 'B', morningAudioUrl: '/audio/G/13_morning.mp3', morningTitle: 'Lambung yang Sembuh Adalah Lambung yang Dijaga', isUnlocked: false },
  { day: 14, track: 'B', morningAudioUrl: '/audio/G/14_morning.mp3', morningTitle: 'Terima Kasih Sudah Mempercayai Perjalanan Ini', isUnlocked: false },
];

// Track C — Pulih Seutuhnya (Mix A + B)
// Ganjil → Track A, Genap → Track B
export const TRACK_C: DayAudio[] = [
  { day: 0,  track: 'C', morningAudioUrl: '/audio/A/0_morning.mp3', morningTitle: 'Menjemput Rasa Aman', isUnlocked: false },
  { day: 1,  track: 'C', morningAudioUrl: '/audio/A/01_morning.mp3', morningTitle: 'Menjemput Rasa Aman', isUnlocked: false },
  { day: 2,  track: 'C', morningAudioUrl: '/audio/G/2_morning.mp3', morningTitle: 'Hubungan Makanan dan Perasaanmu', isUnlocked: false },
  { day: 3,  track: 'C', morningAudioUrl: '/audio/A/3_morning.mp3', morningTitle: 'Mengenal Sinyal, Bukan Ancaman', isUnlocked: false },
  { day: 4,  track: 'C', morningAudioUrl: '/audio/G/4_morning.mp3', morningTitle: 'Makanan Teman dan Makanan Pemicu', isUnlocked: false },
  { day: 5,  track: 'C', morningAudioUrl: '/audio/A/5_morning.mp3', morningTitle: 'Rahasia Otak Kedua', isUnlocked: false },
  { day: 6,  track: 'C', morningAudioUrl: '/audio/G/6_morning.mp3', morningTitle: 'Tidur dan Lambung yang Tidak Bisa Dipisahkan', isUnlocked: false },
  { day: 7,  track: 'C', morningAudioUrl: '/audio/A/7_morning.mp3', morningTitle: 'Merayakan Jeda dan Kemenangan Kecil', isUnlocked: false },
  { day: 8,  track: 'C', morningAudioUrl: '/audio/G/8_morning.mp3', morningTitle: 'Minuman yang Sering Dilupakan', isUnlocked: false },
  { day: 9,  track: 'C', morningAudioUrl: '/audio/A/9_morning.mp3', morningTitle: 'Membangun Kembali Kepercayaan Diri', isUnlocked: false },
  { day: 10, track: 'C', morningAudioUrl: '/audio/G/10_morning.mp3', morningTitle: 'Membangun Pola Makan Jangka Panjang', isUnlocked: false },
  { day: 11, track: 'C', morningAudioUrl: '/audio/A/11_morning.mp3', morningTitle: 'Menghadapi Badai yang Kembali Datang', isUnlocked: false },
  { day: 12, track: 'C', morningAudioUrl: '/audio/G/12_morning.mp3', morningTitle: 'Suplemen dan Herbal — Memahami Perannya', isUnlocked: false },
  { day: 13, track: 'C', morningAudioUrl: '/audio/A/13_morning.mp3', morningTitle: 'Menemukan Versi Baru Dirimu', isUnlocked: false },
  { day: 14, track: 'C', morningAudioUrl: '/audio/G/14_morning.mp3', morningTitle: 'Terima Kasih Sudah Mempercayai Perjalanan Ini', isUnlocked: false },
];

// Universal Audio — shared semua track
export const UNIVERSAL_AUDIO: Record<'acknowledge'|'comfort'|'celebrate', UniversalAudio[]> = {
  acknowledge: [
    { type:'acknowledge', variant:1, audioUrl:'/audio/universal/ack-1.mp3', label:'Aku dengar kamu — hari ini memang berat' },
    { type:'acknowledge', variant:2, audioUrl:'/audio/universal/ack-2.mp3', label:'Wajar kalau hari ini terasa sulit' },
    { type:'acknowledge', variant:3, audioUrl:'/audio/universal/ack-3.mp3', label:'Kamu tidak sendirian dalam perjalanan ini' },
  ],
  comfort: [
    { type:'comfort', variant:1, audioUrl:'/audio/universal/com-1.mp3', label:'Kamu sudah melakukan yang terbaik hari ini' },
    { type:'comfort', variant:2, audioUrl:'/audio/universal/com-2.mp3', label:'Langkah kecil tetap langkah maju' },
    { type:'comfort', variant:3, audioUrl:'/audio/universal/com-3.mp3', label:'Tubuhmu sedang bekerja keras untukmu' },
  ],
  celebrate: [
    { type:'celebrate', variant:1, audioUrl:'/audio/universal/cel-1.mp3', label:'Luar biasa — energimu hari ini terasa!' },
    { type:'celebrate', variant:2, audioUrl:'/audio/universal/cel-2.mp3', label:'Ini yang kita tunggu — terus jaga ini' },
    { type:'celebrate', variant:3, audioUrl:'/audio/universal/cel-3.mp3', label:'Perjalananmu hari ini sungguh membanggakan' },
  ],
};

// Helper: ambil audio berdasarkan track + hari
export function getTrackAudio(
  track: Track, day: number
): DayAudio | undefined {
  if (track === 'A')
    return TRACK_A.find(d => d.day === day);
  if (track === 'B')
    return TRACK_B.find(d => d.day === day);
  if (track === 'C')
    return TRACK_C.find(d => d.day === day);
}