# Giat Kwartir Ranting Subang

## Current State
AdminPage shows a table of Kwartir Ranting with their scores (Profil, Potensi, Kegiatan, Total). Data comes from `getAllSortedByScore()` backend query.

## Requested Changes (Diff)

### Add
- A "Download PDF Rekap" button on the AdminPage Daftar Penilaian tab.
- PDF generation using `jspdf` + `jspdf-autotable` (no new backend needed).
- PDF content: title "REKAP HASIL PENILAIAN KWARTIR RANTING TERGIAT KWARCAB SUBANG", generated date, table with columns: No, Nama KR, Nama Ketua, Skor Profil, Skor Potensi, Skor Kegiatan, Total Skor. Rows sorted by rank (as shown on screen).

### Modify
- AdminPage.tsx: add download button in CardHeader of Daftar Penilaian tab.

### Remove
- Nothing removed.

## Implementation Plan
1. Install `jspdf` and `jspdf-autotable` npm packages.
2. In AdminPage.tsx, add a `downloadPDF` function that builds PDF with title, date, and ranking table.
3. Add Download button (with FileDown icon) next to CardTitle in Daftar Penilaian tab. Button is disabled if no data.
