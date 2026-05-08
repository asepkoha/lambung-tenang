import type { DayAudio, UniversalAudio, ProgramTrack } from '@/types';

// Track A — Ketenangan (Anxiety)
export const TRACK_A: DayAudio[] = [
  { day: 0, track: 'ketenangan', morningAudioUrl: 'public/audio/A/0_morning.mp3', morningTitle: 'Menjemput Rasa Aman', isUnlocked: false },
  { day: 1, track: 'ketenangan', morningAudioUrl: 'public/audio/A/1_morning.mp3', morningTitle: 'Menjemput Rasa Aman', isUnlocked: false },
  { day: 2, track: 'ketenangan', morningAudioUrl: 'public/audio/A/2_morning.mp3', morningTitle: 'Memberi Izin untuk Lelah', isUnlocked: false },
  { day: 3, track: 'ketenangan', morningAudioUrl: 'public/audio/A/3_morning.mp3', morningTitle: 'Mengenal Sinyal, Bukan Ancaman', isUnlocked: false },
  { day: 4, track: 'ketenangan', morningAudioUrl: 'public/audio/A/4_morning.mp3', morningTitle: 'Menanam Akar di Bawah Tanah', isUnlocked: false },
  { day: 5, track: 'ketenangan', morningAudioUrl: 'public/audio/A/5_morning.mp3', morningTitle: 'Rahasia Otak Kedua', isUnlocked: false },
  { day: 6, track: 'ketenangan', morningAudioUrl: 'public/audio/A/6_morning.mp3', morningTitle: 'Gerak Sadar (Jalan Kaki sebagai Terapi)', isUnlocked: false },
  { day: 7, track: 'ketenangan', morningAudioUrl: 'public/audio/A/7_morning.mp3', morningTitle: 'Merayakan Jeda dan Kemenangan Kecil', isUnlocked: false },
  { day: 8, track: 'ketenangan', morningAudioUrl: 'public/audio/A/8_morning.mp3', morningTitle: 'Melepaskan Genggaman yang Melelahkan', isUnlocked: false },
  { day: 9, track: 'ketenangan', morningAudioUrl: 'public/audio/A/9_morning.mp3', morningTitle: 'Membangun Kembali Kepercayaan Diri', isUnlocked: false },
  { day: 10, track: 'ketenangan', morningAudioUrl: 'public/audio/A/10_morning.mp3', morningTitle: 'Membangun Benteng Harian', isUnlocked: false },
  { day: 11, track: 'ketenangan', morningAudioUrl: 'public/audio/A/11_morning.mp3', morningTitle: 'Menghadapi Badai yang Kembali Datang', isUnlocked: false },
  { day: 12, track: 'ketenangan', morningAudioUrl: 'public/audio/A/12_morning.mp3', morningTitle: 'Berteman dengan Ketidakpastian', isUnlocked: false },
  { day: 13, track: 'ketenangan', morningAudioUrl: 'public/audio/A/13_morning.mp3', morningTitle: 'Menemukan Versi Baru Dirimu', isUnlocked: false },
  { day: 14, track: 'ketenangan', morningAudioUrl: 'public/audio/A/14_morning.mp3', morningTitle: 'Perjalanan Pulang Menuju Tenang', isUnlocked: false },
];

// Track G — Kenyamanan (GERD)
export const TRACK_G: DayAudio[] = [
  { day: 0, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/0_morning.mp3', morningTitle: 'Lambungmu Bukan Musuhmu', isUnlocked: false },
  { day: 1, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/1_morning.mp3', morningTitle: 'Mengenal Cara Kerja Lambungmu', isUnlocked: false },
  { day: 2, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/2_morning.mp3', morningTitle: 'Hubungan Makanan dan Perasaanmu', isUnlocked: false },
  { day: 3, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/3_morning.mp3', morningTitle: 'Tiga Kebiasaan Kecil yang Besar Dampaknya', isUnlocked: false },
  { day: 4, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/4_morning.mp3', morningTitle: 'Makanan Teman dan Makanan Pemicu', isUnlocked: false },
  { day: 5, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/5_morning.mp3', morningTitle: 'Stres dan Asam Lambung — Koneksi Nyata', isUnlocked: false },
  { day: 6, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/6_morning.mp3', morningTitle: 'Tidur dan Lambung yang Tidak Bisa Dipisahkan', isUnlocked: false },
  { day: 7, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/7_morning.mp3', morningTitle: 'Separuh Jalan — Tubuhmu Sedang Berproses', isUnlocked: false },
  { day: 8, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/8_morning.mp3', morningTitle: 'Minuman yang Sering Dilupakan', isUnlocked: false },
  { day: 9, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/9_morning.mp3', morningTitle: 'Konsistensi Lebih Penting dari Kesempurnaan', isUnlocked: false },
  { day: 10, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/10_morning.mp3', morningTitle: 'Membangun Pola Makan Jangka Panjang', isUnlocked: false },
  { day: 11, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/11_morning.mp3', morningTitle: 'Ketika Gejala Kambuh — Ini yang Perlu Dilakukan', isUnlocked: false },
  { day: 12, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/12_morning.mp3', morningTitle: 'Suplemen dan Herbal — Memahami Perannya', isUnlocked: false },
  { day: 13, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/13_morning.mp3', morningTitle: 'Lambung yang Sembuh Adalah Lambung yang Dijaga', isUnlocked: false },
  { day: 14, track: 'kenyamanan', morningAudioUrl: 'public/audio/G/14_morning.mp3', morningTitle: 'Terima Kasih Sudah Mempercayai Perjalanan Ini', isUnlocked: false },
];

// Track M — Pulih Seutuhnya (Mix A + G)
// Ganjil → Track A, Genap → Track G
export const TRACK_M: DayAudio[] = [
  { day: 0,  track: 'pulih', morningAudioUrl: 'public/audio/A/0_morning.mp3', morningTitle: 'Menjemput Rasa Aman', isUnlocked: false },
  { day: 1,  track: 'pulih', morningAudioUrl: 'public/audio/A/1_morning.mp3', morningTitle: 'Menjemput Rasa Aman', isUnlocked: false },
  { day: 2,  track: 'pulih', morningAudioUrl: 'public/audio/G/2_morning.mp3', morningTitle: 'Hubungan Makanan dan Perasaanmu', isUnlocked: false },
  { day: 3,  track: 'pulih', morningAudioUrl: 'public/audio/A/3_morning.mp3', morningTitle: 'Mengenal Sinyal, Bukan Ancaman', isUnlocked: false },
  { day: 4,  track: 'pulih', morningAudioUrl: 'public/audio/G/4_morning.mp3', morningTitle: 'Makanan Teman dan Makanan Pemicu', isUnlocked: false },
  { day: 5,  track: 'pulih', morningAudioUrl: 'public/audio/A/5_morning.mp3', morningTitle: 'Rahasia Otak Kedua', isUnlocked: false },
  { day: 6,  track: 'pulih', morningAudioUrl: 'public/audio/G/6_morning.mp3', morningTitle: 'Tidur dan Lambung yang Tidak Bisa Dipisahkan', isUnlocked: false },
  { day: 7,  track: 'pulih', morningAudioUrl: 'public/audio/A/7_morning.mp3', morningTitle: 'Merayakan Jeda dan Kemenangan Kecil', isUnlocked: false },
  { day: 8,  track: 'pulih', morningAudioUrl: 'public/audio/G/8_morning.mp3', morningTitle: 'Minuman yang Sering Dilupakan', isUnlocked: false },
  { day: 9,  track: 'pulih', morningAudioUrl: 'public/audio/A/9_morning.mp3', morningTitle: 'Membangun Kembali Kepercayaan Diri', isUnlocked: false },
  { day: 10, track: 'pulih', morningAudioUrl: 'public/audio/G/10_morning.mp3', morningTitle: 'Membangun Pola Makan Jangka Panjang', isUnlocked: false },
  { day: 11, track: 'pulih', morningAudioUrl: 'public/audio/A/11_morning.mp3', morningTitle: 'Menghadapi Badai yang Kembali Datang', isUnlocked: false },
  { day: 12, track: 'pulih', morningAudioUrl: 'public/audio/G/12_morning.mp3', morningTitle: 'Suplemen dan Herbal — Memahami Perannya', isUnlocked: false },
  { day: 13, track: 'pulih', morningAudioUrl: 'public/audio/A/13_morning.mp3', morningTitle: 'Menemukan Versi Baru Dirimu', isUnlocked: false },
  { day: 14, track: 'pulih', morningAudioUrl: 'public/audio/G/14_morning.mp3', morningTitle: 'Terima Kasih Sudah Mempercayai Perjalanan Ini', isUnlocked: false },
];

// Universal Audio — shared semua track
export const UNIVERSAL_AUDIO: Record<'acknowledge'|'comfort'|'celebrate', UniversalAudio[]> = {
  acknowledge: [
    { type:'acknowledge', variant:1, audioUrl:'public/audio/universal/ack-1.mp3', label:'Aku dengar kamu — hari ini memang berat' },
    { type:'acknowledge', variant:2, audioUrl:'public/audio/universal/ack-2.mp3', label:'Wajar kalau hari ini terasa sulit' },
    { type:'acknowledge', variant:3, audioUrl:'public/audio/universal/ack-3.mp3', label:'Kamu tidak sendirian dalam perjalanan ini' },
  ],
  comfort: [
    { type:'comfort', variant:1, audioUrl:'public/audio/universal/com-1.mp3', label:'Kamu sudah melakukan yang terbaik hari ini' },
    { type:'comfort', variant:2, audioUrl:'public/audio/universal/com-2.mp3', label:'Langkah kecil tetap langkah maju' },
    { type:'comfort', variant:3, audioUrl:'public/audio/universal/com-3.mp3', label:'Tubuhmu sedang bekerja keras untukmu' },
  ],
  celebrate: [
    { type:'celebrate', variant:1, audioUrl:'public/audio/universal/cel-1.mp3', label:'Luar biasa — energimu hari ini terasa!' },
    { type:'celebrate', variant:2, audioUrl:'public/audio/universal/cel-2.mp3', label:'Ini yang kita tunggu — terus jaga ini' },
    { type:'celebrate', variant:3, audioUrl:'public/audio/universal/cel-3.mp3', label:'Perjalananmu hari ini sungguh membanggakan' },
  ],
};

// Helper: ambil audio berdasarkan track + hari
export function getTrackAudio(
  track: ProgramTrack, day: number
): DayAudio | undefined {
  if (track === 'ketenangan') 
    return TRACK_A.find(d => d.day === day);
  if (track === 'kenyamanan') 
    return TRACK_G.find(d => d.day === day);
  if (track === 'pulih') 
    return TRACK_M.find(d => d.day === day);
}