# Lambung Tenang - Project Documentation

## Deskripsi Aplikasi
**Lambung Tenang** adalah aplikasi pendamping untuk perjalanan 14 hari ikhtiar pemulihan GERD-Anxiety. Aplikasi ini membantu pengguna melacak mood, gejala fisik, dan tingkat kecemasan harian, serta menyediakan konten edukasi dan panduan suara (Voice Notes) yang disesuaikan dengan jalur pemulihan yang dipilih (Jalur Perasaan, Fisik, atau Berat Bersama).

## Stack Teknis
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v3.4.19
- **Komponen UI:** shadcn/ui (Radix UI)
- **Animasi:** Framer Motion
- **State Management:** Hooks (useStorage untuk LocalStorage)
- **Routing:** React Router v7
- **PWA:** Vite Plugin PWA
- **Lainnya:** Lucide React (Icons), date-fns (Date manipulation)

## Sistem Warna (Shadcn Theme)
- **Primary:** `#6B8E5A` (Sage Green) - Melambangkan ketenangan dan penyembuhan.
- **Secondary:** `#6B6B6B` - Warna netral untuk teks sekunder.
- **Background:** `#F5F3EF` / `#F7F5F2` - Warna krem lembut untuk kenyamanan mata.
- **Destructive/Accent:** `#C4A484` (Tan/Brown) - Digunakan untuk elemen kecemasan atau peringatan.
- **Text:** `#2D2A26` - Warna gelap untuk keterbacaan tinggi.

## Struktur File Utama
- `src/App.tsx`: Root component & Routing.
- `src/index.css`: Global styles & Tailwind layers.
- `src/pages/`: Halaman aplikasi (Dashboard, History, Settings, dll).
- `src/components/`: Komponen UI modular (BottomNav, VoiceNotePlayer, dll).
- `src/data/`: Konten statis aplikasi (Edukasi 14 hari & Metadata Voice Notes).
- `src/hooks/`: Custom hooks untuk audio dan storage.
- `src/types/`: Definisi tipe TypeScript.

## Bug yang Sudah Diperbaiki
1. **Dashboard Scrolling Issue:**
   - **Masalah:** Konten Dashboard di bawah (Streak, Mood) tidak bisa di-scroll karena `overflow-hidden` pada root dan padding yang kurang di atas Bottom Nav.
   - **Perbaikan:** Menghapus `overflow-hidden` di `App.tsx`, menambahkan `pb-24` pada container Dashboard, dan menyatukan scroll area.

## Todo List
- [ ] Implementasi fitur ekspor data ke PDF (opsional).
- [ ] Optimasi ukuran aset gambar di folder `public/`.
- [ ] Penambahan konten Voice Notes untuk hari-hari yang masih kosong.
- [ ] Penyesuaian dark mode support (jika diperlukan di masa depan).
- [ ] Testing menyeluruh pada browser mobile (Safari/Chrome Mobile).
- [ ] Implementasi Service Worker yang lebih robust untuk offline mode.
