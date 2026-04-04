# 48LIVEUPDATE

## Current State
- AdminPage.tsx ada tombol hapus (Trash2) untuk posts dan threads
- Tombol hapus memanggil `deletePostMutation.mutate(post.id)` dan `deleteThreadMutation.mutate(thread.id)` -- fungsi sudah ada di useBackend.ts
- Masalah: Admin table menampilkan `displayPosts` dan `displayThreads` yang fallback ke `MOCK_POSTS` / `MOCK_THREADS` jika data backend kosong
- Saat backend kosong (belum ada data), mock data ditampilkan dan ID mock (1,2,3...) tidak valid di backend sehingga delete gagal
- Tidak ada error handling atau feedback saat delete gagal/berhasil
- Belum ada fitur embed/link konten dari website resmi tiap 48 Group
- MOCK_MEMBERS dan MOCK_THREADS masih ada di mockData.ts

## Requested Changes (Diff)

### Add
- Halaman atau section baru "Official Sites" di halaman Groups yang menampilkan card per group dengan:
  - Nama group
  - Link ke website resmi dengan tombol "Visit Official Site"
  - Embed iframe (jika website mengizinkan) atau screenshot/preview card dengan link
- Error handling di AdminPage: toast notification saat delete berhasil atau gagal
- Loading state di tombol delete saat sedang proses
- Konfirmasi dialog sebelum menghapus konten
- Section "Embed Konten Official" di halaman GroupsPage individual (per group) menampilkan link ke website resmi dan social media

### Modify
- AdminPage.tsx: Perbaiki logika delete -- jangan gunakan mock data untuk actions, hanya gunakan data dari backend
- AdminPage.tsx: Pisahkan "real data" dari "display data" -- mock hanya untuk stats display, bukan untuk actions delete
- AdminPage.tsx: Tambah delete confirmation dialog sebelum hapus
- AdminPage.tsx: Tambah toast feedback setelah delete berhasil/gagal
- GroupsPage.tsx: Tambah official website links untuk setiap group
- mockData.ts: Hapus MOCK_MEMBERS dan MOCK_THREADS (atau kosongkan array), pertahankan MOCK_GROUPS dan MOCK_POSTS untuk fallback display
- MembersPage.tsx: Tampilkan empty state jika tidak ada member dari backend (tidak fallback ke mock)
- DiscussPage.tsx: Tampilkan empty state jika tidak ada thread dari backend (tidak fallback ke mock)

### Remove
- Mock data member dari MOCK_MEMBERS (kosongkan array)
- Mock data threads dari MOCK_THREADS (kosongkan array)
- Fallback ke mock data di MembersPage dan DiscussPage

## Implementation Plan
1. Update mockData.ts: kosongkan MOCK_MEMBERS dan MOCK_THREADS
2. Update AdminPage.tsx:
   - Gunakan data real dari backend untuk delete actions, bukan dari displayPosts/displayThreads
   - Tambah AlertDialog konfirmasi sebelum delete
   - Tambah toast notification dengan sonner setelah delete berhasil/gagal
   - Tambah isPending state pada tombol delete
3. Update GroupsPage.tsx: tambah official website URLs dan link cards untuk setiap group, section "Official Sites" di group detail page dengan iframe atau link preview
4. Update MembersPage.tsx: tampilkan empty state jika backend kosong
5. Update DiscussPage.tsx: tampilkan empty state jika backend kosong
