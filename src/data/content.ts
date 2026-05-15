import type { Track, TrackContent, VoiceContext, DayContent } from '@/types';
import { getTrackAudio } from './voiceNotes';

export const assessmentQuestions = [
  {
    id: 1,
    question: 'Saat bangun pagi, yang paling kamu rasakan adalah...',
    options: [
      { text: 'Pikiran yang berputar dan khawatir', score: { A: 3, B: 0, C: 2 } },
      { text: 'Perut tidak nyaman atau mual', score: { A: 0, B: 3, C: 2 } },
      { text: 'Keduanya, sama kuatnya', score: { A: 1, B: 1, C: 3 } },
      { text: 'Tidak ada yang signifikan', score: { A: 0, B: 0, C: 0 } },
    ],
  },
  {
    id: 2,
    question: 'Kapan gejala paling sering muncul?',
    options: [
      { text: 'Saat stres atau cemas', score: { A: 3, B: 0, C: 1 } },
      { text: 'Setelah makan tertentu', score: { A: 0, B: 3, C: 1 } },
      { text: 'Kapan saja, tidak bisa diprediksi', score: { A: 1, B: 1, C: 3 } },
      { text: 'Hanya sesekali', score: { A: 0, B: 0, C: 0 } },
    ],
  },
  {
    id: 3,
    question: 'Bagaimana tidurmu akhir-akhir ini?',
    options: [
      { text: 'Sulit tidur karena pikiran', score: { A: 3, B: 0, C: 1 } },
      { text: 'Bangun karena perut tidak nyaman', score: { A: 0, B: 3, C: 1 } },
      { text: 'Tidur terus-terusan tapi tetap lelah', score: { A: 1, B: 1, C: 2 } },
      { text: 'Tidur cukup nyenyak', score: { A: 0, B: 0, C: 0 } },
    ],
  },
  {
    id: 4,
    question: 'Apa yang paling ingin kamu ubah dari tubuhmu sekarang?',
    options: [
      { text: 'Agar pikiranku lebih tenang', score: { A: 3, B: 0, C: 1 } },
      { text: 'Agar perutku nyaman makan apa pun', score: { A: 0, B: 3, C: 1 } },
      { text: 'Agar aku merasa utuh lagi', score: { A: 1, B: 1, C: 3 } },
      { text: 'Hanya ingin lebih sehat secara umum', score: { A: 0, B: 0, C: 0 } },
    ],
  },
  {
    id: 5,
    question: 'Seberapa sering kamu memeriksa gejala secara berlebihan?',
    options: [
      { text: 'Sangat sering, Googling terus', score: { A: 3, B: 0, C: 2 } },
      { text: 'Kadang, kalau gejala muncul', score: { A: 1, B: 2, C: 1 } },
      { text: 'Jarang, cukup tahu ini GERD', score: { A: 0, B: 2, C: 0 } },
      { text: 'Hampir tidak pernah', score: { A: 0, B: 0, C: 0 } },
    ],
  },
  {
    id: 6,
    question: 'Bagaimana reaksimu saat gejala muncul tiba-tiba?',
    options: [
      { text: 'Panik, takut ada yang serius', score: { A: 3, B: 0, C: 1 } },
      { text: 'Frustasi, sudah hati-hati makan', score: { A: 0, B: 3, C: 1 } },
      { text: 'Down, capek banget', score: { A: 1, B: 1, C: 3 } },
      { text: 'Tenang, ini biasa saja', score: { A: 0, B: 0, C: 0 } },
    ],
  },
  {
    id: 7,
    question: 'Seberapa besar anxiety-mu memengaruhi makan?',
    options: [
      { text: 'Sangat besar, makan jadi beban', score: { A: 3, B: 0, C: 2 } },
      { text: 'Sedang, kadang nafsu makan turun', score: { A: 1, B: 1, C: 1 } },
      { text: 'Minimal, aku tetap makan normal', score: { A: 0, B: 2, C: 0 } },
      { text: 'Tidak ada hubungannya', score: { A: 0, B: 0, C: 0 } },
    ],
  },
];

export const trackInfo: Record<Track, { name: string; description: string; image: string; color: string; bg: string }> = {
  A: {
    name: 'Jalur Ketenangan',
    description: 'Fokus pada pola pikiran dan manajemen anxiety',
    image: 'track-a.webp',
    color: '#8FBC8F',
    bg: '#EDF1F6',
  },
  B: {
    name: 'Jalur Kenyamanan',
    description: 'Fokus pada kenyamanan fisik dan pencernaan',
    image: 'track-b.webp',
    color: '#F4A460',
    bg: '#E8F0E8',
  },
  C: {
    name: 'Jalur Pulih Menyeluruh',
    description: 'Pendekatan intensif menggabungkan pola pikir dan fisik',
    image: 'track-c.webp',
    color: '#D4A373',
    bg: '#F0EBF4',
  },
};

function makeDay(
  day: number,
  title: string,
  subtitle: string,
  mission: string[],
  material: string,
  voiceNotes: Record<VoiceContext, string>
): DayContent {
  return { dayNumber: day, title, subtitle, mission, material, voiceNotes };
}

function buildTrackContent(track: Track, days: DayContent[]): TrackContent {
  return {
    track,
    name: trackInfo[track].name,
    description: trackInfo[track].description,
    image: trackInfo[track].image,
    color: trackInfo[track].color,
    days,
  };
}

// === TRACK A: Jalur Ketenangan ===
const trackADays: DayContent[] = [
  makeDay(1, 'Mengenali Suara Tubuh', 'Tanpa men-judge', ['Tulis 3 gejala yang muncul hari ini tanpa kata "buruk"', 'Minum air hangat setelah bangun tidur'],
    'Aku tahu rasanya bangun dengan perut tidak tenang dan pikiran yang sudah berlari. GERD-anxiety bukan "kelemahan"mu. Tubuhmu sedang berusaha komunikasi. Hari ini, kita hanya menulis apa yang ada. Tidak perlu memperbaiki.',
    { morning: 'Selamat pagi. Hari pertama perjalanan kita. Aku tahu rasanya bangun dengan perut yang tidak tenang dan pikiran yang berlari. Hari ini, kita tidak perlu buru-buru. Cukup sadar bahwa kamu sudah melangkah ke sini. Itu cukup.', comfort: 'Hari ini berat, ya? Aku dengar. Perutmu kembali bicara keras, dan pikiranmu ikut berisik. Ambil napas pelan-pelan. Ini akan lewat. Kamu sudah pernah melewati ini. Duduklah, minum air hangat, dan ingat: kamu aman.', celebrate: 'Hari pertamamu berjalan dengan baik! Aku senang kamu memilih untuk hadir hari ini. Satu langkah kecil sudah cukup untuk hari ini. Tidur nyenyak malam ini, ya.', acknowledge: 'Aku catat ada gejala baru hari ini. Itu normal. Tubuhmu sedang beradaptasi. Jangan panik. Amati saja, dan kita akan bicarakan besok.' }),

  makeDay(2, 'Napas Sebelum Semua', 'Satu alat yang selalu ada', ['Lakukan 5 napas perut, 4 detik tarik — 6 detik hembus', 'Catat: bagaimana perutmu sebelum dan sesudah napas'],
    'Ketika anxiety naik, napas menjadi dangkal. Perut menegang. Gejala GERD ikut memuncak. Kita punya alat paling sederhana: napas perut. Tidak memerlukan aplikasi, tidak memerlukan waktu lama. Cukup 5 siklus.',
    { morning: 'Pagi. Hari kedua. Kemarin kamu sudah mulai mendengar tubuhmu. Hari ini, kita belajar napas perut. Iya, terdengar klise. Tapi napas adalah jembatan antara pikiranmu dan perutmu. Ayo coba 5 kali.', comfort: 'Jika pagi ini terasa berat, mulailah dari napas. Tidak perlu berdiri. Tidak perlu sempurna. Tarik napas perlahan, rasakan perutmu mengembang. Kamu punya kendali, meski terasa kecil.', celebrate: 'Kamu sudah mencoba napas perut! Itu alat paling powerful yang sering dilupakan. Setiap kali kamu napas dengan sadar, kamu memberi isyarat aman ke otakmu.', acknowledge: 'Ada gejala yang berbeda hari ini? Amati tanpa panik. Napas bisa membantu tubuh menenangkan respons terhadap gejala baru. Coba 5 siklus sekarang.' }),

  makeDay(3, 'Pola Pikiran yang Berputar', 'Mengenali loop', ['Tulis pikiran yang muncul saat gejala ada', 'Tanyakan pada diri: "Ini fakta atau khawatiranku?"'],
    'Siklus GERD-anxiety: gejala muncul → "Ada apa?" → Googling → anxiety naik → perut menegang → gejala memuncak. Loop ini nyata. Tapi sadar loop adalah langkah pertama melepaskan diri dari loop.',
    { morning: 'Hari ketiga. Hari ini kita bicara tentang loop pikiran. Gejala muncul, pikiran panik, perut makin tegang, gejala makin parah. Kamu tidak sendiri. Mari kita pelajari cara mengenali loop ini.', comfort: 'Loop pikiranmu mungkin sedang aktif hari ini. Gejala muncul, lalu pikiranmu langsung "what if". Aku mengerti. Coba tanyakan: ini fakta, atau khawatiranku saja?', celebrate: 'Kamu mulai mengenali loop pikiranmu! Itu kemenangan besar. Sadar adalah setengah dari perubahan. Hari ini, perutmu mungkin lebih tenang karena pikiranmu sedikit lebih tenang.', acknowledge: 'Pikiranmu mungkin sedang aktif karena gejala baru. Ingat: satu gejala baru tidak berarti ada hal buruk. Tulis saja. Kita amati bersama.' }),

  makeDay(4, 'Makan Tanpa Takut', 'Kembali ke meja makan', ['Makan satu kali dengan penuh perhatian, tanpa HP', 'Catat rasanya setelah makan'],
    'Banyak penderita GERD-anxiety takut makan. Makan jadi beban. Tapi tubuh butuh nutrisi untuk pulih. Hari ini, kita coba makan satu kali dengan penuh perhatian — tanpa multitasking, tanpa Google di samping.',
    { morning: 'Hari keempat. Aku tahu makan bisa jadi momen menakutkan. "Apa ini bakal memperburuk?" Hari ini, coba satu kali makan dengan penuh perhatian. Lihat warnanya. Cium aromanya. Kunyah pelan.', comfort: 'Jika makan hari ini terasa menakutkan, ingat: takut juga membuat perut menegang. Ambil napas. Mulai dengan sesuatu yang lembut. Kamu tidak harus sempurna.', celebrate: 'Kamu berhasil makan dengan sadar! Itu langkah besar. Setiap gigitan dengan tenang adalah pesan ke tubuhmu bahwa ini aman.', acknowledge: 'Gejala baru setelah makan? Jangan langsung salahkan makanan. Tubuhmu sedang sensitif. Beri waktu. Catat, lalu tenang.' }),

  makeDay(5, 'Tidur sebagai Obat', 'Membangun ritual malam', ['Matikan layar 30 menit sebelum tidur', 'Tulis satu hal yang baik hari ini sebelum tidur'],
    'Tidur adalah saat tubuh memperbaiki lambung. Tapi anxiety sering menjaga mata terbuka. Malam ini, kita bangun ritual sederhana: matikan layar, tulis satu hal baik, lalu tarik napas panjang.',
    { morning: 'Hari kelima. Tidur adalah waktu tubuhmu memperbaiki diri. Tapi anxiety sering mengganggu. Malam ini, coba ritual baru. Matikan layar 30 menit sebelum tidur. Tulis satu hal baik dari hari ini.', comfort: 'Kalau semalam tidurmu tidak nyenyak, aku mengerti. Anxiety sering datang malam. Malam ini, jangan memaksakan tidur. Coba ritual kecil: tulis, napas, lalu biarkan.', celebrate: 'Tidur lebih nyenyak? Itu tanda tubuhmu mulai percaya lagi. Lanjutkan ritual malam ini. Satu hal baik setiap malam.', acknowledge: 'Mimpi buruk atau bangun tengah malam? Anxiety bisa muncul saat tubuh lelah. Jangan panik. Minum air hangat, duduk sejenak, lalu coba tidur lagi.' }),

  makeDay(6, 'Jalan Kaki sebagai Terapi', 'Gerak yang tidak menuntut', ['Jalan 10 menit, tanpa target, tanpa Spotify', 'Perhatikan sensasi tubuh saat jalan'],
    'Gerakan ringan membantu pencernaan dan menurunkan kortisol. Tapi bukan olahraga berat. Jalan kaki santai — tanpa target, tanpa Spotify — adalah meditasi bergerak. Tubuhmu butuh gerakan yang tidak menuntut.',
    { morning: 'Hari keenam. Tubuhmu butuh gerakan, tapi bukan olahraga berat. Jalan kaki 10 menit saja cukup. Tanpa target, tanpa podcast. Hanya berjalan dan merasakan.', comfort: 'Hari ini tidak harus jauh. Jalan di sekitar rumah 5 menit juga cukup. Yang penting tubuhmu tahu bahwa dia masih bisa bergerak dengan aman.', celebrate: 'Kamu sudah berjalan! Gerakan ringan itu sinyal ke tubuh: aku aman, aku tidak terancam. Perutmu merespons itu.', acknowledge: 'Gejala muncul saat berjalan? Jangan khawatir. Mungkin perutmu sedang beradaptasi. Pelan-pelan. Duduk jika perlu.' }),

  makeDay(7, 'Refleksi Minggu Pertama', 'Melihat jejak', ['Buka riwayat 7 hari ini', 'Tulis: satu hal yang aku pelajari tentang diriku'],
    'Satu minggu sudah. Mungkin gejala belum hilang sepenuhnya, dan itu normal. Tapi lihat jejakmu: kamu sudah menulis, napas, makan dengan sadar, tidur lebih baik. Itu fondasi.',
    { morning: 'Satu minggu! Aku bangga kamu masih di sini. Mungkin gejala belum hilang, tapi lihat jejakmu. Kamu sudah belajar napas, makan dengan sadar, dan mendengar tubuhmu. Itu fondasi.', comfort: 'Minggu ini terasa berat? Aku mengerti. Recovery bukan garis lurus. Tapi kamu masih di sini. Itu artinya kamu lebih kuat dari yang kamu kira.', celebrate: 'Minggu pertama selesai dengan baik! Perhatikan pola di riwayatmu. Mungkin ada hari yang lebih baik. Itu bukan kebetulan — itu usahamu.', acknowledge: 'Ada gejala yang berubah minggu ini? Normal. Tubuhmu sedang menyeimbangkan kembali. Terus amati.' }),

  makeDay(8, 'Batasan yang Sehat', 'Mengatakan tidak', ['Identifikasi satu hal yang memicu stress minggu ini', 'Rencanakan cara menghadapinya besok'],
    'Anxiety sering datang dari boundary yang kabur. Terlalu banyak berita, terlalu banyak komitmen, terlalu banyak scrolling. Hari ini, kita belajar mengatakan "tidak" pada satu hal kecil.',
    { morning: 'Hari kedelapan. Anxiety sering datang dari boundary yang kabur. Terlalu banyak informasi, terlalu banyak komitmen. Hari ini, pilih satu hal kecil yang bisa kamu batasi.', comfort: 'Hari ini mungkin penuh tuntutan. Ingat: kamu punya hak untuk mengatakan tidak. Bahkan pada hal kecil. Boundary adalah bentuk self-care.', celebrate: 'Kamu sudah menetapkan satu batasan! Itu keterampilan yang akan membantu seumur hidup. Perutmu merasakan ketegangan yang berkurang.', acknowledge: 'Gejala muncul saat kamu merasa terbebani? Itu sinyal boundary. Catat momennya.' }),

  makeDay(9, 'Melepaskan Kontrol', 'Yang tidak bisa kita atur', ['Tulis satu hal di luar kendalimu', 'Tulis satu hal di dalam kendalimu hari ini'],
    'Anxiety loves control. Tapi kita tidak bisa mengontrol gejala 100%. Yang bisa kita kontrol: reaksi kita, napas kita, pilihan makan dan tidur. Pemisahan ini membantu melepaskan beban.',
    { morning: 'Hari kesembilan. Anxiety suka kontrol. Tapi kita tidak bisa mengontrol gejala sepenuhnya. Yang bisa kita kontrol: napas, pilihan makan, reaksi. Pemisahan ini melepaskan beban.', comfort: 'Hari ini kamu mungkin ingin mengontrol semua gejala. Aku mengerti. Tapi lepaskan sedikit. Kontrol penuh justru menambah anxiety. Fokus pada apa yang bisa kamu lakukan.', celebrate: 'Kamu mulai membedakan kontrol dan kepasrahan. Itu bijaksana. Perutmu merasakan ketika pikiranmu lebih lega.', acknowledge: 'Gejala tidak terduga muncul? Itu di luar kontrol. Tapi reaksimu bisa kamu pilih. Napas. Catat. Lepaskan.' }),

  makeDay(10, 'Mendengarkan dengan Empati', 'Menjadi teman bagi diri sendiri', ['Saat gejala muncul, ucapkan pada diri: "Aku mengerti, ini sulit"', 'Catat perubahan suasana hati setelahnya'],
    'Kita sering marah pada diri sendiri saat gejala muncul. "Kenapa lagi?" Tapi self-compassion lebih efektif daripada self-criticism. Ucapkan kata lembut pada tubuhmu. Dia sedang berusaha.',
    { morning: 'Hari kesepuluh. Saat gejala muncul, apa yang kamu katakan pada diri? "Kenapa lagi?" Coba ubah: "Aku mengerti, ini sulit." Self-compassion lebih menyembuhkan dari kritik.', comfort: 'Hari ini mungkin ada gejala yang membuatmu marah pada diri. Aku mengerti. Tapi tubuhmu sedang berusaha. Ucapkan kata lembut. Dia butuh dukungan, bukan hukuman.', celebrate: 'Kamu berhasil menunjukkan empati pada diri sendiri! Itu keterampilan yang menyembuhkan. Perutmu merasakan kelembutan itu.', acknowledge: 'Gejala baru membuatmu frustrasi? Wajar. Tapi jangan salahkan diri. Frustrasi adalah bagian dari proses. Lalu lepaskan.' }),

  makeDay(11, 'Mengisi Ulang Energi', 'Rest is productive', ['Istirahat 20 menit siang, tanpa produktivitas', 'Catat bagaimana perutmu setelah istirahat'],
    'Kita hidup dalam kultur yang menghargai produktivitas. Tapi tubuh yang recovery butuh istirahat yang benar — tanpa rasa bersalah. Istirahat 20 menit siang bukan kemalasan. Itu investasi.',
    { morning: 'Hari kesebelas. Istirahat bukan kemalasan. Tubuhmu recovery butuh energi. Coba istirahat 20 menit siang. Tanpa produktivitas. Tanpa rasa bersalah.', comfort: 'Hari ini mungkin kamu merasa harus sibuk terus. Aku mengerti tekanannya. Tapi istirahat adalah bagian dari penyembuhan. Beri izin pada diri untuk tidak produktif sejenak.', celebrate: 'Kamu sudah beristirahat dengan sengaja! Itu pilihan yang dewasa. Perutmu butuh energi untuk memperbaiki diri.', acknowledge: 'Gejala muncul saat lelah? Tubuhmu minta istirahat. Dengarkan. Bukan dengan khawatir, tapi dengan action.' }),

  makeDay(12, 'Menerima Ketidakpastian', 'Hidup di zona abu-abu', ['Tulis satu ketakutan tentang masa depan', 'Tulis satu hal yang tetap baik meski masa depan tidak pasti'],
    'Anxiety sering datang dari ketakutan akan "bagaimana kalau...". Tapi kita tidak pernah tahu masa depan. Yang bisa kita lakukan: hadapi hari ini dengan alat yang sudah kita bangun.',
    { morning: 'Hari kedua belas. Anxiety sering datang dari ketakutan "bagaimana kalau..." Masa depan tidak pasti. Tapi hari ini bisa kita hadapi. Dengan napas, dengan makan yang baik, dengan tidur.', comfort: 'Hari ini mungkin pikiranmu melayang ke masa depan. Aku mengerti. Tapi bawa kembali ke sekarang. Sekarang, kamu aman. Sekarang, kamu punya alat.', celebrate: 'Kamu mulai menemukan stabilitas di ketidakpastian! Itu tanda pertumbuhan. Perutmu merasakan ketika pikiranmu lebih grounded.', acknowledge: 'Ketakutan masa depan muncul karena gejala? Normal. Tapi gejala hari ini tidak menentukan besok. Catat, lalu lepaskan.' }),

  makeDay(13, 'Mempersiapkan Lanjutan', 'Setelah 14 hari', ['Tulis tiga alat yang paling membantumu', 'Rencanakan cara menggunakannya minggu depan'],
    'Besok adalah hari terakhir formal. Tapi perjalananmu tidak berakhir. Kamu sudah membangun toolkit: napas, mindful eating, boundary, self-compassion. Hari ini, kita susun rencana lanjutan.',
    { morning: 'Hari ketiga belas. Besok hari terakhir formal, tapi perjalananmu baru mulai. Hari ini, tulis tiga alat yang paling membantu. Rencanakan cara memakainya ke depan.', comfort: 'Khawatir tentang hari terakhir? Aku mengerti. Tapi ending formal bukan berakhirnya dukungan. Kamu sudah punya alat. Kamu sudah lebih kuat.', celebrate: 'Lihat toolkit yang kamu bangun! Napas, boundary, empati, istirahat. Itu milikmu sekarang. Perutmu merasakan kekuatan itu.', acknowledge: 'Gejala sebelum hari terakhir? Normal. Tubuhmu tidak tahu jadwal. Tapi kamu sudah punya cara menanganinya.' }),

  makeDay(14, 'Perpisahan yang Lembut', 'Kamu sudah cukup', ['Tulis surat untuk diri sendiri 14 hari lalu', 'Beri diri satu janji yang realistis untuk bulan depan'],
    '14 hari lalu kamu memilih untuk hadir. Hari ini, kamu pergi dengan toolkit baru. Recovery bukan garis lurus. Akan ada hari berat. Tapi sekarang kamu tahu: kamu bisa melewatinya. Satu napas. Satu gigitan. Satu langkah.',
    { morning: 'Hari terakhir. 14 hari lalu kamu memilih hadir. Hari ini, kamu pergi dengan alat baru. Recovery bukan garis lurus. Tapi sekarang kamu tahu: kamu bisa melewatinya. Satu napas. Satu langkah.', comfort: 'Hari terakhir terasa berat? Aku mengerti. Tapi kamu tidak perlu sempurna untuk selesai. Kamu cukup. Kamu sudah cukup.', celebrate: '14 hari! Kamu melakukannya! Aku bangga. Lihat jejakmu. Kamu tidak sama dengan orang yang memulai. Perutmu merasakan perubahan itu.', acknowledge: 'Gejala di hari terakhir? Itu tidak mengurangi apa yang kamu capai. Recovery bukan zero gejala. Recovery adalah cara kita merespons.' }),
];

// === TRACK B: Jalur Kenyamanan ===
const trackBDays: DayContent[] = [
  makeDay(1, 'Mengenali Perutmu', 'Tanpa men-judge', ['Tulis 3 gejala yang muncul hari ini', 'Minum air hangat setelah bangun tidur'],
    'GERD bukan "kelemahan" pencernaanmu. Lambungmu sedang sensitif. Hari ini, kita hanya menulis apa yang ada. Tidak perlu menyalahkan makanan kemarin. Observasi saja.',
    { morning: 'Selamat pagi. Hari pertama program ini. Aku tahu rasanya bangun dengan perut yang tidak tenang. Hari ini, kita tidak buru-buru memperbaiki. Cukup amati dan catat. Itu sudah cukup.', comfort: 'Hari ini gejalanya cukup aktif, ya? Aku mengerti. Perutmu sedang bicara. Duduklah, minum air hangat, dan ingat: ini adalah sinyal, bukan musuh.', celebrate: 'Hari pertamamu berjalan lancar! Aku senang kamu memilih untuk hadir. Satu langkah kecil sudah cukup untuk hari ini.', acknowledge: 'Ada gejala baru? Jangan panik. Tubuhmu sedang beradaptasi. Catat, amati, dan kita akan bicarakan besok.' }),

  makeDay(2, 'Kunyah dengan Sengaja', 'Pencernaan dimulai dari mulut', ['Makan satu kali dengan kunyah 20 kali per gigitan', 'Matikan layar saat makan'],
    'Pencernaan dimulai dari mulut. Enzim amilase di saliva memecah karbohidrat. Kunyah pelan juga memberi sinyat kenyang ke otak. GERD sering datang dari makan terlalu cepat.',
    { morning: 'Pagi. Hari kedua. Perutmu sedang belajar ulang. Salah satu caranya: kunyah dengan sengaja. 20 kali per gigitan. Iya, terasa lama. Tapi lambungmu akan berterima kasih.', comfort: 'Jika perutmu masih sensitif, mulailah dengan makanan yang sangat lembut. Jangan paksakan. Yang penting kunyahnya pelan dan sadar.', celebrate: 'Kamu sudah mencoba makan dengan sadar! Itu fondasi penyembuhan. Lambungmu merasakan ketika kamu memberinya waktu.', acknowledge: 'Gejala baru setelah makan? Bukan salahmu. Tubuhmu sedang sensitif. Catat apa yang kamu makan, tapi tanpa rasa bersalah.' }),

  makeDay(3, 'Makanan Pemicu vs Teman', 'Bukan daftar larangan', ['Catat makanan hari ini dan perutmu 2 jam setelahnya', 'Identifikasi satu makanan yang SELALU aman bagimu'],
    'Banyak info di internet soal "makanan GERD". Tapi setiap tubuh berbeda. Hari ini, kita buat daftar pribadi: bukan daftar larangan, tapi daftar TEMAN — makanan yang selalu aman.',
    { morning: 'Hari ketiga. Internet penuh daftar "makanan dilarang GERD". Tapi tubuhmu unik. Hari ini, fokus bukan pada yang dilarang. Tapi pada yang AMAN. Temukan satu makanan temanmu.', comfort: 'Kalau perutmu masih rewel dengan makanan, itu wajar. Recovery bukan soal menemukan makanan sempurna. Recovery soal pola: makan pelan, makan tepat waktu, tidur cukup.', celebrate: 'Kamu sudah menemukan makanan temanmu! Itu fondasi. Dari situ, kamu bisa membangun variasi. Lambungmu butuh kepercayaan.', acknowledge: 'Makanan yang biasa aman tadi memicu gejala? Tubuhmu berubah tiap hari. Jangan panik. Besok bisa berbeda.' }),

  makeDay(4, 'Posisi dan Waktu', 'Mekanik sederhana', ['Tidur dengan kepala sedikit lebih tinggi', 'Makan minimal 3 jam sebelum tidur'],
    'Gravitasi membantu. Makan terlalu dekat tidur membuat asam naik saat tubuh horizontal. Posisi tidur dengan kepala 15-20 cm lebih tinggi membantu alami. Mekanik sederhana, efek besar.',
    { morning: 'Hari keempat. Posisi dan waktu makan itu penting. Tidur dengan kepala sedikit lebih tinggi. Makan minimal 3 jam sebelum tidur. Mekanik sederhana, tapi lambungmu merasakan bedanya.', comfort: 'Kalau semalam tidurmu terganggu gejala, jangan putus asa. Posisi butuh waktu untuk terbiasa. Malam ini, coba bantal ekstra.', celebrate: 'Kamu sudah mencoba posisi tidur baru! Itu perubahan kecil yang efektif. Lambungmu mulai merasakan dukungan dari gravitas.', acknowledge: 'Gejala malam hari muncul meski sudah hati-hati? Recovery tidak linear. Ada hari naik turun. Catat, lalu lanjut.' }),

  makeDay(5, 'Air dan Ritual', 'Hidrasi yang tenang', ['Minum air hangat 30 menit sebelum makan', 'Hindari minum banyak saat makan'],
    'Air hangat sebelum makan membantu persiapan pencernaan. Tapi minum banyak saat makan mengencerkan asam lambung dan memperluas perut. Kita cari ritme: air hangat, makan pelan, istirahat.',
    { morning: 'Hari kelima. Air itu penting, tapi waktunya juga. Minum air hangat 30 menit sebelum makan. Hindari minum banyak saat makan. Ritual kecil, efek besar bagi lambung.', comfort: 'Jika perutmu masih kembung, perhatikan pola minummu. Terlalu banyak air sekaligus bisa memperburuk. Sedikit-sedikit sepanjang hari.', celebrate: 'Kamu sudah membangun ritual air! Lambungmu menyukai prediktabilitas. Ritual memberi rasa aman pada pencernaan.', acknowledge: 'Kembung setelah minum? Mungkin volume atau waktunya. Catat, lalu sesuaikan besok. Bukan kegagalan.' }),

  makeDay(6, 'Gerak Ringan', 'Bukan olahraga berat', ['Jalan 10 menit setelah makan siang', 'Hindari berbaring langsung setelah makan'],
    'Gerakan ringan setelah makan membantu gravitasi bekerja. Tapi berbaring langsung setelah makan memberi kesempatan asam naik. Jalan 10 menit santai adalah pencernaan aktif.',
    { morning: 'Hari keenam. Tubuhmu butuh gerakan ringan, bukan olahraga berat. Jalan 10 menit setelah makan siang. Hindari berbaring langsung. Gravitasi adalah teman lambung.', comfort: 'Kalau perutmu masih sensitif untuk berjalan, berdirilah saja. Atau duduk tegak. Yang penting: tidak langsung berbaring setelah makan.', celebrate: 'Kamu sudah bergerak setelah makan! Lambungmu merasakan bedanya. Gerakan ringan membantu gravitasi membawa asam tetap turun.', acknowledge: 'Gejala saat berjalan? Pelan-pelan. Mungkin perutmu sedang proses. Duduk sejenak, lalu coba lagi.' }),

  makeDay(7, 'Refleksi Minggu Pertama', 'Melihat jejak', ['Buka riwayat 7 hari ini', 'Identifikasi satu pola positif dari data'],
    'Satu minggu sudah. Mungkin gejala belum hilang sepenuhnya. Tapi lihat jejakmu: kamu sudah makan lebih pelan, tidur lebih tegak, menemukan makanan teman. Itu fondasi nyata.',
    { morning: 'Satu minggu! Aku bangga kamu masih di sini. Mungkin gejala belum hilang, tapi lihat data: makan lebih pelan, waktu makan lebih baik, ritual air. Itu fondasi.', comfort: 'Minggu ini terasa lambat? Aku mengerti. Recovery lambung butuh waktu. Tapi kamu sudah memberinya kondisi yang lebih baik. Itu cukup.', celebrate: 'Minggu pertama selesai dengan baik! Lihat pola di riwayat. Ada hari yang lebih baik? Itu bukan kebetulan.', acknowledge: 'Gejala berubah minggu ini? Normal. Lambung sedang menyeimbangkan. Terus amati.' }),

  makeDay(8, 'Stres dan Lambung', 'Sambungan yang nyata', ['Catat momen stres hari ini', 'Catat gejala 2 jam setelah stres tersebut'],
    'Lambung punya saraf yang terhubung langsung ke otak. Stres mengaktifkan fight-or-flight, yang menurunkan aliran darah ke pencernaan. Stress management bukan bonus — itu bagian dari GERD care.',
    { morning: 'Hari kedelapan. Lambung punya saraf yang terhubung ke otak. Stres mempengaruhi pencernaan secara nyata. Hari ini, catat momen stres dan gejala setelahnya.', comfort: 'Stres hari ini memicu gejala? Aku mengerti. Itu bukan "hanya di kepalamu". Sambungan itu nyata. Coba napas pelan saat stres muncul.', celebrate: 'Kamu mulai melihat sambungan stres-lambung! Awareness itu penting. Sekarang kamu bisa menangani keduanya.', acknowledge: 'Stres tiba-tiba datang tanpa alasan? Bisa jadi tubuhmu sedang sensitif. Napas. Istirahat. Bukan kemalasan.' }),

  makeDay(9, 'Kualitas Tidur', 'Perbaikan malam', ['Tulis ritual malammu kemarin', 'Coba tambah satu elemen: redupkan lampu 30 menit sebelum tidur'],
    'Tidur adalah waktu lambung memperbaiki mukosa. Tidur yang buruk = lambung yang lelah. Ritual malam bukan kemewahan. Itu syarat recovery.',
    { morning: 'Hari kesembilan. Tidur adalah waktu lambung memperbaiki diri. Ritual malam itu penting. Coba redupkan lampu 30 menit sebelum tidur. Muka tubuhmu butuh sinyal: ini waktu istirahat.', comfort: 'Tidur terganggu gejala? Jangan frustrasi. Coba posisi tidur yang sudah kita pelajari. Atau minum air hangat sebelum tidur.', celebrate: 'Tidurmu membaik! Itu tanda lambungmu punya ruang untuk memperbaiki diri. Lanjutkan ritual malam.', acknowledge: 'Bangun tengah malam karena gejala? Normal dalam recovery. Minum air hangat, duduk tegak sejenak, lalu tidur lagi.' }),

  makeDay(10, 'Makanan sebagai Obat', 'Nutrisi untuk recovery', ['Masukkan satu protein lembut hari ini', 'Catat perutmu setelahnya'],
    'Lambung yang sensitif butuh protein untuk regenerasi. Tapi protein berat (daging tebal) bisa membebani. Protein lembut: telur rebus, tofu, ikan kukus, ayam tanpa kulit. Satu per hari.',
    { morning: 'Hari kesepuluh. Lambung butuh protein untuk regenerasi. Tapi yang lembut: telur rebus, tofu, ikan kukus. Coba satu hari ini. Amati responsnya.', comfort: 'Perutmu masih sensitif dengan protein? Jangan paksakan. Mulai dengan porsi kecil. Atau skip hari ini dan coba besok.', celebrate: 'Kamu sudah mencoba protein lembut! Itu nutrisi untuk perbaikan mukosa. Lambungmu butuh bahan bangunan.', acknowledge: 'Protein yang biasa aman tadi memicu gejala? Porsi atau waktu mungkin faktor. Catat, sesuaikan, coba lagi.' }),

  makeDay(11, 'Mukosa dan Waktu', 'Proses yang tidak instan', ['Baca kembali data 11 hari ini', 'Tulis: satu hal yang sudah membaik, meski kecil'],
    'Mukosa lambung butuh waktu untuk pulih. Bukan 3 hari, seringnya 4-8 minggu. Yang kita lakukan 14 hari ini: memberi kondisi terbaik agar lambung bisa memperbaiki diri.',
    { morning: 'Hari kesebelas. Mukosa lambung butuh waktu pulih. Bukan instan. 14 hari ini kita beri kondisi terbaik. Lihat kembali data. Ada satu hal yang membaik, meski kecil.', comfort: 'Frustrasi karena belum sembuh total? Aku mengerti. Tapi recovery bukan on/off. Ada hari lebih baik, ada hari turun. Itu normal.', celebrate: 'Kamu menemukan satu hal yang membaik! Mungkin kualitas tidur, makan lebih nyaman, atau gejala lebih singkat. Itu kemenangan.', acknowledge: 'Gejala kembali setelah membaik? Bukan kegagalan. Recovery lambung naik turun. Terus beri kondisi baik.' }),

  makeDay(12, 'Kombinasi yang Tepat', 'Makan, gerak, tidur', ['Evaluasi: mana yang paling konsisten dari tiga ini?', 'Rencanakan cara mempertahankannya'],
    'Tiga pilar: makan pelan + tepat waktu, gerak ringan, tidur cukup. Tidak harus sempurna. Tapi konsistensi di satu pilar lebih baik dari sempurna sehari lalu lenyap.',
    { morning: 'Hari kedua belas. Tiga pilar: makan pelan dan tepat waktu, gerak ringan, tidur cukup. Mana yang paling konsisten? Pilih itu. Pertahankan. Yang lain akan menyusul.', comfort: 'Hari ini sulit konsisten? Wajar. Recovery bukan linear. Kalau hari ini cuma bisa satu pilar, itu cukup.', celebrate: 'Kamu menemukan pilar yang konsisten! Itu fondasi kehidupan. Dari sana, dua pilar lain akan lebih mudah.', acknowledge: 'Semua pilar runtuh hari ini? Itu hari buruk, bukan kegagalan. Besok mulai lagi dari pilar yang termudah.' }),

  makeDay(13, 'Mempersiapkan Setelah 14 Hari', 'Program pribadi', ['Tulis tiga kebiasaan yang paling membantu', 'Rencanakan minggu depan dengan kebiasaan itu'],
    'Besok hari terakhir formal. Tapi perjalananmu baru mulai. Kamu punya data pribadi: makanan teman, waktu tidur optimal, aktivitas yang membantu. Itu program pribadimu.',
    { morning: 'Hari ketiga belas. Besok hari terakhir, tapi perjalanan baru mulai. Kamu punya data pribadi sekarang. Tulis tiga kebiasaan terbaikmu. Rencanakan minggu depan.', comfort: 'Khawatir setelah program berakhir? Aku mengerti. Tapi kamu tidak sendirian lagi. Kamu punya data, kebiasaan, dan alat. Kamu punya dirimu.', celebrate: 'Lihat tiga kebiasaan terbaikmu! Itu hasil kerja keras. Lambungmu sekarang punya fondasi yang kamu bangun sendiri.', acknowledge: 'Gejala sebelum hari terakhir? Tubuhmu tidak tahu jadwal. Tapi kamu sudah punya cara menanganinya. Gunakan.' }),

  makeDay(14, 'Perpisahan yang Lembut', 'Kamu sudah cukup', ['Tulis surat untuk diri 14 hari lalu', 'Janji satu hal realistis untuk bulan depan'],
    '14 hari lalu kamu memilih untuk hadir. Hari ini, kamu pergi dengan data pribadi, kebiasaan baru, dan fondasi. Recovery bukan garis lurus. Tapi sekarang kamu tahu: kamu bisa.',
    { morning: 'Hari terakhir. 14 hari lalu kamu mulai. Hari ini, kamu pergi dengan kebiasaan baru. Recovery tidak linear. Tapi sekarang kamu punya data dan alat. Kamu bisa.', comfort: 'Hari terakhir terasa berat? Aku mengerti. Tapi kamu tidak perlu sempurna untuk lulus. Kamu cukup. Kamu sudah cukup.', celebrate: '14 hari! Kamu melakukannya! Lihat jejakmu. Kamu tidak sama dengan orang yang memulai. Lambungmu merasakan perubahan itu.', acknowledge: 'Gejala di hari terakhir? Itu tidak mengurangi pencapaianmu. Recovery bukan zero gejala. Recovery adalah kondisi yang kita bangun.' }),
];

// === TRACK C: Jalur Pulih Menyeluruh ===
const trackCDays: DayContent[] = [
  makeDay(1, 'Mengenali Medan', 'Tanpa men-judge', ['Tulis 3 gejala dan 3 perasaan yang muncul', 'Minum air hangat, duduk 5 menit tanpa melakukan apa pun'],
    'Aku tahu rasanya: perut tidak tenang DAN pikiran berputar secara bersamaan. Kombinasi ini berat. Hari ini, kita tidak memperbaiki apa pun. Kita hanya menulis dan duduk. Itu sudah cukup.',
    { morning: 'Selamat pagi. Aku tahu rasanya bangun dengan perut tidak tenang dan pikiran berputar. Hari ini, tidak perlu buru-buru. Cukup amati. Cukup minum air hangat. Cukup duduk.', comfort: 'Hari ini berat? Aku mengerti. Kombinasi gejala dan pikiran itu membuatmu ingin menyerah. Jangan. Duduklah. Minum air hangat. Kamu tidak harus melakukan apa pun lagi.', celebrate: 'Hari pertama selesai! Aku senang kamu memilih hadir. Satu langkah kecil sudah cukup. Kamu aman.', acknowledge: 'Ada gejala atau perasaan baru? Itu normal. Tubuh dan pikiran sedang beradaptasi. Catat. Amati. Bukan musuh.' }),

  makeDay(2, 'Napas sebagai Jangkar', 'Satu alat untuk dua masalah', ['Lakukan 5 napas perut, mata boleh terbuka', 'Catat: bagaimana perut DAN pikiran setelahnya'],
    'Napas perut adalah satu alat yang membantu anxiety DAN GERD secara bersamaan. Menenangkan nervous system, mengurangi tekanan abdomen, memberi sinyal aman ke otak. Satu alat, dua efek.',
    { morning: 'Hari kedua. Kita punya satu alat untuk dua masalah: napas perut. Menenangkan pikiran dan membantu perut. 5 kali saja. Tidak perlu sempurna.', comfort: 'Hari ini terasa berat? Napas saja sudah cukup. Tarik perlahan. Hembus pelan. Tidak perlu berdiri. Tidak perlu melakukan apa pun lagi.', celebrate: 'Kamu sudah mencoba napas perut! Satu alat, dua efek. Pikiranmu sedikit lebih tenang. Perutmu sedikit lebih lega.', acknowledge: 'Gejala atau anxiety baru muncul saat napas? Jangan panik. Amati. Napas bukan obat instant. Tapi fondasi.' }),

  makeDay(3, 'Loop Ganda', 'Mengenali spiral', ['Tulis siklus: gejala → pikiran → gejala memuncak', 'Identifikasi satu momen di mana kamu bisa "berhenti" di loop'],
    'Di track ini, loop-nya ganda: gejala memicu anxiety, anxiety memperburuk gejala. Tapi ada titik di mana kita bisa berhenti. Biasanya setelah "gejala muncul" — di sana kita bisa memilih napas, bukan Google.',
    { morning: 'Hari ketiga. Di track ini, loop-nya ganda. Gejala → anxiety → gejala memuncak. Tapi ada titik berhenti. Biasanya setelah gejala muncul — di situ kita pilih napas, bukan panik.', comfort: 'Loop sedang aktif? Aku tahu rasanya. Gejala muncul, pikiran langsung "apa ini serius?" Coba berhenti. Napas. Tulis. Tidak perlu jawaban sekarang.', celebrate: 'Kamu mulai mengenali loop gandamu! Itu awareness ganda. Sadar adalah setengah perubahan. Di sini dan sekarang, kamu baik-baik saja.', acknowledge: 'Loop baru muncul? Normal. Recovery bukan menghapus loop. Recovery adalah mengenali loop lebih cepat.' }),

  makeDay(4, 'Makan dengan Gentleness', 'Bukan hanya nutrisi', ['Makan sesuatu yang lembut dengan penuh perhatian', 'Saat makan, ucapkan: "Aku aman, ini adalah nutrisi"'],
    'Makan saat anxiety tinggi bisa jadi momen menakutkan. Tapi tubuh butuh nutrisi untuk recovery. Hari ini, kita coba makan dengan gentleness — bukan hanya memilih makanan yang lembut, tapi juga menyantapnya dengan pikiran yang lembut.',
    { morning: 'Hari keempat. Makan saat anxiety dan gejala itu menantang. Tapi tubuh butuh nutrisi. Hari ini, pilih yang lembut. Dan saat makan, ucapkan: aku aman. Ini nutrisi.', comfort: 'Makan terasa berat? Aku mengerti. Mulai dengan sesuatu yang sangat lembut. Jus, sup, atau bubur. Yang penting tubuhmu dapat bahan bakar.', celebrate: 'Kamu berhasil makan dengan gentleness! Itu kemenangan ganda: nutrisi untuk tubuh, kelembutan untuk pikiran.', acknowledge: 'Gejala muncul saat makan? Jangan panik. Anxiety bisa menipu. Perutmu sedang proses. Beri waktu 20 menit.' }),

  makeDay(5, 'Tidur sebagai Benteng', 'Melindungi recovery', ['Matikan layar 30 menit sebelum tidur', 'Jika terbangun tengah malam, lakukan 3 napas perut sebelum apapun'],
    'Tidur adalah waktu tubuh memperbaiki lambung DAN reset nervous system. Tapi track ini sering mengalami sleep disruption ganda. Malam ini, bangun benteng: ritual malam + jangkar napas jika terbangun.',
    { morning: 'Hari kelima. Tidur adalah benteng. Waktu tubuh memperbaiki lambung dan reset pikiran. Malam ini, matikan layar 30 menit sebelum tidur. Jika terbangun, 3 napas dulu.', comfort: 'Semalam tidurmu terganggu? Aku mengerti. Track ini sering begitu. Malam ini, jangan frustasi. Jika terbangun, napas. Tidur lagi.', celebrate: 'Tidur lebih nyenyak? Itu tanda kedua sistem mulai percaya. Lambung dan pikiran merasakan ritme baru.', acknowledge: 'Mimpi buruk atau bangun panik? Anxiety malam itu nyata. Duduk, napas, minum air hangat. Kamu aman.' }),

  makeDay(6, 'Gerak Sebagai Grounding', 'Menyatukan tubuh dan pikiran', ['Jalan 10 menat atau peregangan lembut 5 menit', 'Perhatikan sensasi fisik saat bergerak, bukan pikiran'],
    'Gerakan ringan membantu pencernaan dan menurunkan kortisol. Tapi di track ini, gerak juga berfungsi grounding — menyatukan kembali tubuh dan pikiran yang terasa terpisah saat anxiety tinggi.',
    { morning: 'Hari keenam. Gerakan ringan: membantu lambung dan menenangkan pikiran. Jalan 10 menit. Atau peregangan. Saat bergerak, perhatikan sensasi fisik. Bukan pikiran.', comfort: 'Hari ini terlalu berat untuk bergerak? Berdirilah saja. Atau goyangkan kaki. Tubuhmu tidak harus sempurna. Gerak kecil tetap grounding.', celebrate: 'Kamu sudah bergerak! Gerakan menyatukan tubuh dan pikiran. Lambungmu merasakan. Pikiranmu sedikit lebih di sini.', acknowledge: 'Gejala muncul saat bergerak? Pelan-pelan. Duduk sejenak. Napas. Coba lagi jika mau. Bukan wajib.' }),

  makeDay(7, 'Refleksi Minggu Pertama', 'Melihat jejak ganda', ['Buka riwayat, lihat trend gejala dan mood', 'Tulis: satu hal yang aku lakukan dengan baik meski berat'],
    'Satu minggu. Mungkin masih ada hari berat. Tapi lihat jejakmu: kamu sudah napas, makan, bergerak, tidur — semua di tengah kombinasi gejala dan anxiety. Itu fondasi yang kuat.',
    { morning: 'Satu minggu! Di track ini, setiap hari adalah pencapaian. Lihat jejakmu. Kamu sudah napas, makan, bergerak — di tengah kombinasi berat. Itu fondasi kuat.', comfort: 'Minggu ini terasa naik turun drastis? Aku mengerti. Track ini tidak linear. Tapi kamu masih di sini. Itu kekuatan.', celebrate: 'Minggu pertama selesai! Lihat trend. Mungkin ada hari lebih baik. Itu bukan kebetulan. Itu kamu yang membangun kondisi.', acknowledge: 'Hari terberat minggu ini? Itu bagian dari data. Bukan kegagalan. Recovery track ini memang bergelombang.' }),

  makeDay(8, 'Boundary untuk Dua Sistem', 'Melindungi energi', ['Identifikasi satu hal yang memicu DUA sistem: lambung dan pikiran', 'Rencanakan batasan kecil untuk besok'],
    'Di track ini, trigger sering memicu ganda. Stres kerja: pikiran berisik + perut menegang. Berita: anxiety naik + mual. Boundary bukan bonus. Itu pertahanan untuk dua sistem sekaligus.',
    { morning: 'Hari kedelapan. Di track ini, trigger sering memicu ganda. Stres = pikiran + perut. Boundary bukan bonus. Itu pertahanan. Pilih satu trigger. Rencanakan batasan.', comfort: 'Hari ini penuh tuntutan? Aku mengerti. Di track ini, boundary adalah survival. Katakan tidak pada satu hal. Lambung dan pikiranmu berterima kasih.', celebrate: 'Kamu sudah menetapkan batasan! Itu keterampilan ganda. Melindungi pikiran dan perutmu secara bersamaan.', acknowledge: 'Boundary sulit dilakukan? Wajar. Di track ini, kita sering merasa harus please everyone. Tapi tubuhmu butuhmu dulu.' }),

  makeDay(9, 'Melepaskan Dua Kontrol', 'Yang tidak bisa kita atur', ['Tulis satu hal di luar kendali (gejala/anxiety)', 'Tulis satu hal di dalam kendali (reaksi/ritual)'],
    'Kita tidak bisa mengontrol gejala 100% atau anxiety 100%. Tapi bisa mengontrol reaksi, napas, pilihan makan, waktu tidur. Pemisahan ini melepaskan beban ganda.',
    { morning: 'Hari kesembilan. Tidak bisa kontrol gejala atau anxiety sepenuhnya. Tapi bisa kontrol reaksi, napas, makan, tidur. Pemisahan ini melepaskan beban ganda.', comfort: 'Hari ini kamu ingin kontrol semua? Aku tahu rasanya. Tapi lepaskan sedikit. Kontrol penuh menambah anxiety. Dan anxiety menambah gejala.', celebrate: 'Kamu mulai membedakan kontrol dan kepasrahan! Itu bijaksana. Kedua sistem merasakan ketika pikiranmu lebih lega.', acknowledge: 'Gejala dan anxiety datang bersamaan? Itu track ini. Napas. Satu hal yang bisa kamu kontrol sekarang. Itu cukup.' }),

  makeDay(10, 'Empati Ganda', 'Menjadi teman bagi diri', ['Saat gejala/anxiety muncul, ucapkan: "Aku mengerti, ini sulit, aku di sini"', 'Catat perubahan suasana'],
    'Di track ini, self-criticism sering double: marah pada perut yang rewel DAN marah pada pikiran yang khawatir. Tapi self-compassion lebih efektif. Ucapkan kata lembut pada tubuh DAN pikiranmu.',
    { morning: 'Hari kesepuluh. Di track ini, kritik diri sering ganda. Marah pada perut. Marah pada pikiran. Coba empati ganda: "Aku mengerti, ini sulit, aku di sini."', comfort: 'Hari ini mungkin kamu marah pada diri? Aku mengerti. Tapi tubuh dan pikiranmu sedang berusaha. Ucapkan kata lembut. Mereka butuh dukungan.', celebrate: 'Kamu menunjukkan empati ganda! Itu keterampilan healing. Kedua sistem merasakan kelembutan itu.', acknowledge: 'Frustasi ganda muncul? Wajar. Di track ini, kita sering merasa tubuh dan pikiran mengkhianati. Tapi mereka butuh waktu.' }),

  makeDay(11, 'Istirahat Ganda', 'Rest is productive', ['Istirahat 20 menit siang, tanpa produktivitas', 'Saat istirahat, perhatikan perut DAN pikiran'],
    'Kultur produktivitas menyerang dua sistem. Istirahat bukan kemalasan — itu syarat recovery untuk lambung DAN nervous system. 20 menit. Tanpa rasa bersalah.',
    { morning: 'Hari kesebelas. Istirahat bukan kemalasan. Lambuh dan pikiranmu butuh energi. Istirahat 20 menit. Tanpa produktivitas. Tanpa rasa bersalah.', comfort: 'Hari ini kamu merasa harus sibuk? Di track ini, istirahat adalah survival. Bukan kemalasan. Beri izin pada diri untuk tidak produktif.', celebrate: 'Kamu beristirahat dengan sengaja! Itu pilihan dewasa. Kedua sistem butuh energi untuk recovery.', acknowledge: 'Gejala muncul saat lelah? Tubuh dan pikiranmu minta istirahat. Dengarkan. Dengan action, bukan khawatir.' }),

  makeDay(12, 'Ketidakpastian Ganda', 'Hidup di zona abu-abu', ['Tulis satu ketakutan tentang tubuh', 'Tulis satu ketakutan tentang pikiran', 'Tulis satu hal yang tetap baik meski semua tidak pasti'],
    'Di track ini, ketidakpastian sering ganda: "Apa lambungku akan baik?" + "Apa pikiranku akan tenang?" Tapi kita tidak pernah tahu. Yang bisa kita lakukan: hadapi hari ini dengan alat yang sudah kita bangun.',
    { morning: 'Hari kedua belas. Ketakutan ganda: lambung dan pikiran. Masa depan tidak pasti. Tapi hari ini bisa kita hadapi. Dengan napas. Dengan makan pelan. Dengan istirahat.', comfort: 'Hari ini pikiranmu melayang ke masa depan? Aku tahu rasanya. Tapi bawa kembali ke sekarang. Sekarang, kamu aman. Sekarang, kamu punya alat.', celebrate: 'Kamu menemukan stabilitas di ketidakpastian ganda! Itu pertumbuhan ganda. Kedua sistem merasakan grounding itu.', acknowledge: 'Ketakutan ganda muncul karena gejala? Normal. Tapi gejala hari ini tidak menentukan besok. Napas. Catat. Lepaskan.' }),

  makeDay(13, 'Mempersiapkan Lanjutan', 'Toolkit pribadi', ['Tulis tiga alat yang paling membantu KEDUA sistem', 'Rencanakan cara menggunakannya minggu depan'],
    'Besok hari terakhir. Tapi perjalanan baru mulai. Kamu punya data pribadi: apa yang menenangkan perut DAN pikiranmu. Itu toolkit pribadi. Tidak ada di internet. Hanya milikmu.',
    { morning: 'Hari ketiga belas. Besok hari terakhir, tapi perjalanan baru mulai. Kamu punya data pribadi sekarang. Tulis tiga alat terbaik. Untuk lambung dan pikiran. Rencanakan minggu depan.', comfort: 'Khawatir setelah program? Di track ini, kekhawatiran itu wajar. Tapi kamu tidak sendirian lagi. Kamu punya data. Kamu punya alat. Kamu punya dirimu.', celebrate: 'Lihat toolkit gandamu! Itu hasil kerja keras. Kedua sistem sekarang punya fondasi yang kamu bangun.', acknowledge: 'Gejala sebelum hari terakhir? Tubuh dan pikiran tidak tahu jadwal. Tapi kamu sudah punya cara menanganinya.' }),

  makeDay(14, 'Perpisahan yang Lembut', 'Kamu sudah cukup', ['Tulis surat untuk diri 14 hari lalu', 'Janji satu hal realistis untuk bulan depan'],
    '14 hari lalu kamu memilih hadir di tengah kombinasi berat. Hari ini, kamu pergi dengan toolkit baru, data pribadi, dan fondasi. Recovery tidak linear. Tapi sekarang kamu tahu: kamu bisa. Satu napas. Satu langkah.',
    { morning: 'Hari terakhir. 14 hari lalu kamu mulai di tengah kombinasi berat. Hari ini, kamu pergi dengan alat baru. Recovery tidak linear. Tapi sekarang kamu punya data dan alat. Kamu bisa.', comfort: 'Hari terakhir terasa berat? Aku mengerti. Tapi kamu tidak perlu sempurna untuk selesai. Kamu cukup. Kamu sudah cukup.', celebrate: '14 hari! Kamu melakukannya! Lihat jejakmu. Kamu tidak sama dengan orang yang memulai. Kedua sistem merasakan perubahan.', acknowledge: 'Gejala di hari terakhir? Itu tidak mengurangi pencapaian. Recovery bukan zero gejala. Recovery adalah kondisi yang kita bangun.' }),
];

export const allTrackContent: Record<Track, TrackContent> = {
  A: buildTrackContent('A', trackADays),
  B: buildTrackContent('B', trackBDays),
  C: buildTrackContent('C', trackCDays),
};

export function getDayContent(track: Track, day: number): DayContent {
  const content = allTrackContent[track].days.find((d) => d.dayNumber === day);
  if (!content) throw new Error(`Day ${day} not found for track ${track}`);
  return content;
}

export function determineTrack(answers: number[]): Track {
  const scores: Record<Track, number> = { A: 0, B: 0, C: 0 };
  answers.forEach((answerIndex, qIndex) => {
    const q = assessmentQuestions[qIndex];
    const option = q.options[answerIndex];
    if (option) {
      scores.A += option.score.A;
      scores.B += option.score.B;
      scores.C += option.score.C;
    }
  });

  // Tie-breaker: if C is close to max of A/B, prefer C for severe combined
  const maxScore = Math.max(scores.A, scores.B, scores.C);
  if (scores.C >= maxScore - 2 && scores.C >= 10) return 'C';
  if (scores.A === maxScore) return 'A';
  if (scores.B === maxScore) return 'B';
  return 'C';
}

export function getVoiceNotePath(track: Track, day: number, context: VoiceContext): string {
  const audioData = getTrackAudio(track, day);
  
  if (audioData && context === 'morning') {
    return audioData.morningAudioUrl;
  }
  
  // Fallback for other contexts — also use R2
  const R2_BASE_URL = 'https://audio.kangasep.my.id';
  return `${R2_BASE_URL}/voice-notes/${track}-${String(day).padStart(2, '0')}-${context}.mp3`;
}

export function getVoiceNoteTranscript(track: Track, day: number, context: VoiceContext): string {
  // Return transcript text from DayContent voiceNotes for TTS fallback
  try {
    const dayContent = allTrackContent[track]?.days.find((d) => d.dayNumber === day);
    if (dayContent?.voiceNotes?.[context]) {
      return dayContent.voiceNotes[context];
    }
  } catch {
    // ignore
  }
  return 'Audio pendamping sedang dimuat. Silakan coba lagi nanti.';
}
