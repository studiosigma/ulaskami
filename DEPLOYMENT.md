# Panduan Deployment & Peluncuran Produksi Ulaskami

Dokumen ini merupakan panduan teknis operasional dan komersialisasi untuk meluncurkan aplikasi **Ulaskami** ke lingkungan *live production*.

---

## 1. Variabel Lingkungan (*Environment Variables*)

Salin file `.env.example` ke `.env.local` di server hosting Anda:

```bash
cp .env.example .env.local
```

| Variabel | Deskripsi | Nilai Contoh Produksi |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Domain utama aplikasi | `https://ulaskami.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Nomor CS & WhatsApp Pengaduan Masukan | `6281234567890` |
| `DATABASE_URL` | String koneksi PostgreSQL (PAAS.ID / Neon / Supabase) | `postgresql://user:pass@db.paas.id:5432/ulaskami_db?sslmode=require` |
| `SESSION_SECRET` | Kunci rahasia enkripsi sesi cookie merchant | `rahasia_acak_minimal_32_karakter_produksi` |

> [!NOTE]
> Jika `DATABASE_URL` tidak diisi, sistem otomatis berjalan pada mode **In-Memory Safe Fallback**. Ini sangat berguna untuk preview staging atau saat server database sedang dalam proses migrasi.

---

## 2. Pilihan Hosting & Platform Deployment

### Opsi A: Deployment di PAAS.ID (Cloud Indonesia)

1. **Buat Database PostgreSQL di PAAS.ID:**
   - Masuk ke dashboard [PAAS.ID](https://paas.id).
   - Buat layanan baru: **PostgreSQL Database**.
   - Salin URI koneksi yang disediakan (misal: `postgresql://db_user:secret@postgres.paas.id:5432/ulaskami?sslmode=require`).

2. **Deploy Aplikasi Next.js di PAAS.ID:**
   - Buat layanan baru: **Node.js App / Git Repository**.
   - Hubungkan repository GitHub/GitLab Ulaskami.
   - Atur Build Command:
     ```bash
     npm run build
     ```
   - Atur Start Command:
     ```bash
     npm run start
     ```
   - Masukkan *Environment Variables* di atas ke menu Settings.

3. **Verifikasi Koneksi Database:**
   - Jalankan terminal web console di PAAS.ID dan ketik:
     ```bash
     npm run db:check
     ```
   - Tabel `plates`, `scan_logs`, dan `merchants` akan otomatis dibuat (*auto-migration*).

---

### Opsi B: Deployment di Vercel

1. Push repository ke GitHub.
2. Impor proyek ke [Vercel](https://vercel.com).
3. Di tab **Settings -> Environment Variables**, masukkan:
   - `NEXT_PUBLIC_APP_URL` = `https://ulaskami.com`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = `6281234567890`
   - `DATABASE_URL` = Koneksi PostgreSQL (Supabase / Neon / PAAS.ID)
4. Klik **Deploy**. Vercel akan otomatis mengompilasi rute SSR, API handler, dan static asset.

---

### Opsi C: Deployment di VPS Ubuntu / Docker

Gunakan konfigurasi `docker-compose.yml` berikut:

```yaml
version: "3.8"

services:
  web:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://ulaskami.com
      - NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
      - DATABASE_URL=postgresql://ulaskami_user:password@db:5432/ulaskami_prod
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ulaskami_user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ulaskami_prod
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 3. Operasional Hardware: Pemrograman Chip NFC NTAG213

Chip NFC fisik pada Ulaskami Plate menggunakan tipe **NTAG213** dengan kapasitas memori efektif **144 bytes**.

### Efisiensi Payload URL:
- Format Target: `https://ulaskami.com/r/[KODE_PLATE]` (misal: `https://ulaskami.com/r/ULK-000001`).
- Panjang Karakter: **32 bytes**.
- Overhead NDEF Record: **~4 bytes**.
- Total Terpakai: **~36 bytes** (Hanya ~25% dari kapasitas 144B NTAG213).
- **Keunggulan:** Sangat ringan, waktu baca kurang dari 0.1 detik, kompatibel dengan semua iPhone (iOS 13+) dan Android berfitur NFC tanpa aplikasi tambahan.

### SOP Penulisan Massal (Teknisi / Percetakan):
1. **Menggunakan Smartphone (Aplikasi NFC Tools):**
   - Buka aplikasi **NFC Tools** (Gratis di Android/iOS).
   - Masuk ke tab **Write** -> **Add a record** -> **Custom URL / URI**.
   - Masukkan link: `https://ulaskami.com/r/ULK-XXXXXX`.
   - Tekan **Write** dan tempelkan ponsel ke stiker atau plat akrilik.
   - *(Disarankan sebelum pengiriman)*: Kunci chip menjadi *Read-Only* agar tautan tidak dapat diubah oleh pihak ketiga.

2. **Menggunakan Desktop USB NFC Reader (ACR122U):**
   - Ekspor file CSV dari dashboard Ulaskami via menu **Batch Generator** (`ulaskami_batch_ULK-000001_to_ULK-000050.csv`).
   - Masukkan CSV ke software NFC Bulk Writer untuk pemrograman otomatis stiker berurutan.

---

## 4. Checklist Pra-Peluncuran (*Go-Live Checklist*)

- [ ] Domain `ulaskami.com` terhubung dengan sertifikat SSL HTTPS aktif.
- [ ] Script diagnosa `npm run db:check` lolos dengan status `✓ DITEMUKAN` dan terhubung ke PostgreSQL.
- [ ] Pengujian tap tautan acak dialihkan dengan benar ke mode aktivasi (`/activate?code=ULK-XXXXXX`).
- [ ] Pengujian plate teraktivasi dialihkan dengan benar ke review gate (`/review/ULK-000001`) atau Google Maps langsung.
- [ ] Nomor WhatsApp pengaduan diuji menerima pesan komplain bintang 1-3.
- [ ] Unduh lembar stiker A4 dan lakukan uji cetak sampel 1:1.
- [ ] Laporan analitik harian dan jam sibuk dapat diunduh dalam format CSV.
