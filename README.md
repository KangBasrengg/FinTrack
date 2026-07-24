# FinTrack - Personal Finance Tracker
**Created by Hood Tech**

Aplikasi pencatatan keuangan pribadi kelas profesional (Income & Outcome) yang dikembangkan dengan teknologi modern dan performa tinggi.

## Tech Stack
- **Backend**: Golang (Fiber framework) + pgx
- **Database**: PostgreSQL (Supabase) + Database Migrations (`golang-migrate`)
- **Frontend**: React + Vite + TypeScript + TailwindCSS v4 + Recharts

## Struktur Proyek
- `backend/`: Source code backend Golang (Arsitektur Handler -> Service -> Repository).
- `frontend/`: Source code frontend React (UI, Komponen, dan Routing).

---

## Cara Menjalankan Aplikasi di Lokal

### 1. Menjalankan Backend (Golang)
Buka terminal baru, lalu masuk ke direktori `backend`:
```bash
cd backend
```
Pastikan file `.env` sudah ada dan berisi konfigurasi database Anda (terutama `DB_URL` dari Supabase Pooler).
Kemudian, jalankan server backend:
```bash
go run main.go
```
*Backend akan berjalan di port `8000` (atau port lain sesuai yang Anda atur di `.env`).*

### 2. Menjalankan Frontend (React + Vite)
Buka terminal baru yang lain, lalu masuk ke direktori `frontend`:
```bash
cd frontend
```
Install seluruh dependensi NPM terlebih dahulu jika belum:
```bash
npm install
```
Jalankan development server:
```bash
npm run dev
```
*Frontend akan otomatis terbuka di browser pada URL `http://localhost:5173`.*

---

## Panduan Menggunakan Postman / API Client

Karena kita menggunakan autentikasi JWT di backend, ikuti langkah berikut untuk mencoba API menggunakan Postman:

1. Buat request `POST http://localhost:8000/api/auth/register` dengan Body JSON:
   ```json
   {
       "name": "User Testing",
       "email": "user@test.com",
       "password": "Password123"
   }
   ```
2. Anda akan mendapatkan respons berisi `token`. Copy token tersebut.
3. Untuk mengakses endpoint yang di-protect (contoh: Wallet, Category, Transaction), pastikan Anda menyisipkan header:
   - Key: `Authorization`
   - Value: `Bearer <token_yang_dicopy_tadi>`

*(Catatan: `POST /api/transactions/search` melayani fitur pencarian dinamis yang bisa difilter berdasarkan tanggal, jenis, range harga, serta pagination)*
