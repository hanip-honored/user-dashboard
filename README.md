# User Dashboard

Aplikasi sederhana untuk melihat daftar pengguna dari [JSONPlaceholder](https://jsonplaceholder.typicode.com/users). Pengguna bisa mencari nama atau email, lalu membuka informasi lengkap melalui tombol **Lihat detail**.

Saya menggunakan grid card agar daftar tetap mudah dibaca di layar ponsel. Detail dibuka dalam modal, sehingga pengguna bisa kembali ke hasil pencarian tanpa berpindah halaman.

## Fitur

- Daftar pengguna dalam grid yang menyesuaikan ukuran layar.
- Pencarian nama atau email secara langsung, tanpa membedakan huruf besar dan kecil.
- Modal detail berisi kontak, alamat, dan perusahaan.
- Pesan loading, pesan error, dan tombol coba lagi.
- Pesan terpisah untuk data kosong dan pencarian yang tidak menemukan hasil.
- Tombol yang dapat digunakan melalui keyboard. Modal dapat ditutup dengan Escape atau tombol Tutup, lalu fokus dikembalikan ke tombol pembukanya.

## Teknologi

React, TypeScript, Vite, Tailwind CSS, dan Fetch API bawaan browser.

TypeScript saya gunakan untuk menjelaskan bentuk data pengguna dan props komponen. Respons API juga diperiksa saat aplikasi berjalan, karena definisi tipe saja tidak menjamin data dari luar memiliki bentuk yang sesuai.

## Menjalankan project

Gunakan Node.js 24.x dan npm. Setelah mengunduh atau melakukan clone repository, buka folder project dan jalankan:

```bash
npm ci
npm run dev
```

Buka alamat yang muncul di terminal. Aplikasi mengambil data dari API publik dan membutuhkan koneksi internet. Tidak ada API key yang perlu disiapkan.

Perintah lain yang tersedia:

| Perintah | Kegunaan |
| --- | --- |
| `npm run lint` | Memeriksa kode dengan ESLint. |
| `npm run build` | Memeriksa TypeScript dan membuat hasil build di folder `dist`. |
| `npm run preview` | Menjalankan hasil build secara lokal setelah proses build selesai. |

## Jawaban pertanyaan pemahaman

### 1. Bagaimana fetching data dan lifecycle ditangani?

Fetching saya tempatkan di custom hook `useUsers`. Di dalamnya, `useEffect` memanggil `fetchUsers()` dan menyimpan status request sebagai `loading`, `success`, atau `error`.

Fungsi `fetchUsers()` memeriksa status HTTP dan bentuk data sebelum hasilnya ditampilkan. Jika request gagal atau responsnya tidak sesuai, hook menampilkan pesan error yang ramah dan menyediakan fungsi untuk mencoba kembali.

Effect bergantung pada `attempt`, yaitu angka yang berubah saat tombol coba lagi ditekan. Memperbarui status request tidak mengubah `attempt`, sehingga pembaruan state tersebut tidak memicu fetching berulang. Teks pencarian juga tidak menjadi dependency Effect karena pencarian dilakukan pada data yang sudah tersedia.

Setiap Effect membuat `AbortController`. Cleanup memanggil `abort()` ketika komponen dilepas atau sebelum Effect berikutnya berjalan. Sebelum memperbarui state, kode memeriksa `signal.aborted` agar hasil request yang sudah dibatalkan tidak digunakan.

Di development, Strict Mode menjalankan satu siklus setup dan cleanup tambahan. Karena itu, request awal bisa terlihat dibatalkan lalu dijalankan kembali. Cleanup menangani siklus ini; perilaku tersebut berbeda dengan infinite loop. Penjelasan lifecycle ini mengikuti [dokumentasi useEffect](https://react.dev/reference/react/useEffect).

### 2. Mengapa struktur foldernya seperti ini?

Bagian utama project disusun sebagai berikut:

```text
src/
├── api/
│   └── users.ts
├── components/
│   ├── UserCard.tsx
│   ├── UserDirectory.tsx
│   └── UserDetailModal.tsx
├── hooks/
│   └── useUsers.ts
├── types/
│   └── user.ts
├── App.tsx
├── index.css
└── main.tsx
```

Saya memisahkan file berdasarkan tanggung jawabnya supaya lebih mudah mencari bagian yang perlu diubah.

- `api/users.ts` berisi request dan pemeriksaan respons API.
- `hooks/useUsers.ts` mengatur lifecycle request, status, pembatalan, dan coba lagi.
- `components/` berisi tampilan kartu, pencarian, dan modal. `UserDirectory` menyimpan teks pencarian serta pengguna yang sedang dipilih.
- `types/user.ts` mendefinisikan bentuk data yang dipakai bersama oleh fungsi API, hook, dan komponen.

`App.tsx` menghubungkan status fetching dengan tampilan. `main.tsx` memasang aplikasi ke halaman, sedangkan `index.css` memuat Tailwind dan palet warna yang digunakan.

Dengan pembagian ini, perubahan pada cara mengambil data bisa dikerjakan di bagian API atau hook. Perubahan tampilan kartu cukup dilakukan di `UserCard`.

### 3. Bagaimana jika ada 10.000 pengguna dan pencarian mulai lag?

Saat ini pencarian dihitung langsung dengan `filter()` karena jumlah datanya kecil. Hasil filter merupakan data turunan dari daftar pengguna dan teks pencarian, sehingga tidak disimpan sebagai state tambahan.

Jika jumlahnya menjadi 10.000 dan mengetik mulai terasa lambat, saya akan memeriksa apakah beban utamanya berasal dari filtering atau rendering kartu.

Untuk menjaga input tetap responsif, saya akan menggunakan `useDeferredValue`. Input tetap memakai `query` terbaru, sedangkan komponen hasil menerima nilai pencarian yang ditunda. Komponen hasil dipisahkan dan dibungkus `memo`, dengan props yang stabil, agar tidak ikut mengerjakan ulang daftar saat React memprioritaskan input. Filtering diletakkan di komponen hasil tersebut.

`useMemo` bisa ditambahkan untuk menyimpan hasil filter selama data dan nilai pencariannya belum berubah. Namun, pencarian baru tetap membutuhkan perhitungan baru. `useDeferredValue` mengatur prioritas pembaruan dan tidak otomatis mempercepat perhitungan JavaScript di dalam filter.

Untuk beban rendering, saya akan memakai virtualisasi agar hanya kartu di sekitar area layar yang dibuat, bukan seluruh 10.000 kartu sekaligus. Rencana ini belum diterapkan pada versi sekarang. Acuan pendekatan React-nya ada di [dokumentasi useDeferredValue](https://react.dev/reference/react/useDeferredValue).