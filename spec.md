# Giat Kwartir Ranting Subang

## Current State
AdminPage has a Daftar Penilaian tab with an Edit button per row. There is no delete functionality for penilaian. The backend does not have a deletePenilaian function.

## Requested Changes (Diff)

### Add
- Backend: `deletePenilaian(owner: Principal): Promise<void>` — admin-only function to delete a penilaian record
- AdminPage: Delete button (with confirmation AlertDialog) next to each Edit button in the Daftar Penilaian table

### Modify
- AdminPage: Add delete mutation using the new `deletePenilaian` backend function

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate Motoko backend to add `deletePenilaian` admin function
2. Update AdminPage.tsx to add delete button + AlertDialog confirmation per penilaian row
