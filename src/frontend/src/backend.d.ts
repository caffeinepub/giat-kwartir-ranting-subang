import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface AddLampiranInput {
    blob?: ExternalBlob;
    namaFile: string;
    kategoriKegiatan: string;
}
export interface AdminPembantu {
    status: Variant_pending_approved;
    principal: Principal;
    namaKwartirRanting: string;
}
export type T = [KwartirRanting, Penilaian | null];
export interface Penilaian {
    assessedAt: bigint;
    assessedBy: Principal;
    skorSatuanKarya: number;
    skorDewanKerja: number;
    skorPotensi: number;
    skorKegiatan: number;
    skorPusdiklat: number;
    skorProfil: number;
    kwartirRantingOwner: Principal;
    skorTotal: number;
    namaKegiatan: string;
}
export interface CreateOrUpdatePenilaianInput {
    skorSatuanKarya: number;
    skorDewanKerja: number;
    skorPotensi: number;
    skorKegiatan: number;
    skorPusdiklat: number;
    skorProfil: number;
    kwartirRantingOwner: Principal;
    skorTotal: number;
    namaKegiatan: string;
}
export interface KwartirRanting {
    kmd: bigint;
    kml: bigint;
    jambore: bigint;
    raimuna: bigint;
    ikutLombaTingkatIII: bigint;
    dewanKerjaRantingRapat: bigint;
    siagaPutera: bigint;
    siagaPuteri: bigint;
    perkemahanBaktiSatuanKarya: bigint;
    lombaTingkatII: bigint;
    satuanKaryaAktif: bigint;
    bazarSiaga: bigint;
    masaBakti: string;
    dewanKerjaRantingPeserta: bigint;
    owner: Principal;
    mengirimkanUtusanDewanKerja: bigint;
    partisipasiKaryaBaktiLebaranC3: bigint;
    partisipasiKaryaBaktiLebaranC4: bigint;
    namaKetua: string;
    pusdiklatKegiatan: bigint;
    rekruitmenPenegakGaruda: bigint;
    penegakPutera: bigint;
    penegakPuteri: bigint;
    nomorSk: string;
    satuanKaryaKegiatan: bigint;
    partisipasiPenangananBencanaC3: bigint;
    partisipasiPenangananBencanaC4: bigint;
    memilkiBumiPerkemahan: boolean;
    dianpinru: bigint;
    submittedAt: bigint;
    karangPamitran: bigint;
    namaKwartirRanting: string;
    rekruitmenSiagaGaruda: bigint;
    lombaGladiTangkasMedan: bigint;
    mengirimkanUtusanKpdK: bigint;
    gudepPutera: bigint;
    gudepPuteri: bigint;
    mengirimkanUtusanLpkdk: bigint;
    pandegaPutera: bigint;
    pandegaPuteri: bigint;
    pusdiklatPeserta: bigint;
    pembina: bigint;
    dianpinsat: bigint;
    pestaSiaga: bigint;
    mediaSosial: string;
    rekruitmenPenggalangGaruda: bigint;
    anggotaSatgasPramukaPeduli: bigint;
    mengirimkanUtusanKpd: bigint;
    mengirimkanUtusanKpl: bigint;
    mengirimkanUtusanLpk: bigint;
    mengirimkanUtusanKpdDewasa: bigint;
    dewanKerjaRantingKegiatan: bigint;
    partisipasiKaryaBaktiNatalC3: bigint;
    partisipasiKaryaBaktiNatalC4: bigint;
    orientasiMajelisPembimbing: bigint;
    memilikiSekretariat: boolean;
    penggalangPutera: bigint;
    penggalangPuteri: bigint;
    satuanKaryaPerkemahan: bigint;
}
export interface CreateOrUpdateKwartirRantingInput {
    kmd: bigint;
    kml: bigint;
    jambore: bigint;
    raimuna: bigint;
    ikutLombaTingkatIII: bigint;
    dewanKerjaRantingRapat: bigint;
    siagaPutera: bigint;
    siagaPuteri: bigint;
    perkemahanBaktiSatuanKarya: bigint;
    lombaTingkatII: bigint;
    satuanKaryaAktif: bigint;
    bazarSiaga: bigint;
    masaBakti: string;
    dewanKerjaRantingPeserta: bigint;
    mengirimkanUtusanDewanKerja: bigint;
    partisipasiKaryaBaktiLebaranC3: bigint;
    partisipasiKaryaBaktiLebaranC4: bigint;
    namaKetua: string;
    pusdiklatKegiatan: bigint;
    rekruitmenPenegakGaruda: bigint;
    penegakPutera: bigint;
    penegakPuteri: bigint;
    nomorSk: string;
    satuanKaryaKegiatan: bigint;
    partisipasiPenangananBencanaC3: bigint;
    partisipasiPenangananBencanaC4: bigint;
    memilkiBumiPerkemahan: boolean;
    dianpinru: bigint;
    karangPamitran: bigint;
    namaKwartirRanting: string;
    rekruitmenSiagaGaruda: bigint;
    lombaGladiTangkasMedan: bigint;
    mengirimkanUtusanKpdK: bigint;
    gudepPutera: bigint;
    gudepPuteri: bigint;
    mengirimkanUtusanLpkdk: bigint;
    pandegaPutera: bigint;
    pandegaPuteri: bigint;
    pusdiklatPeserta: bigint;
    pembina: bigint;
    dianpinsat: bigint;
    pestaSiaga: bigint;
    mediaSosial: string;
    rekruitmenPenggalangGaruda: bigint;
    anggotaSatgasPramukaPeduli: bigint;
    mengirimkanUtusanKpd: bigint;
    mengirimkanUtusanKpl: bigint;
    mengirimkanUtusanLpk: bigint;
    mengirimkanUtusanKpdDewasa: bigint;
    dewanKerjaRantingKegiatan: bigint;
    partisipasiKaryaBaktiNatalC3: bigint;
    partisipasiKaryaBaktiNatalC4: bigint;
    orientasiMajelisPembimbing: bigint;
    memilikiSekretariat: boolean;
    penggalangPutera: bigint;
    penggalangPuteri: bigint;
    satuanKaryaPerkemahan: bigint;
}
export interface Lampiran {
    id: string;
    owner: Principal;
    blob?: ExternalBlob;
    namaFile: string;
    uploadedAt: bigint;
    uploadedBy: Principal;
    kategoriKegiatan: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_approved {
    pending = "pending",
    approved = "approved"
}
export interface backendInterface {
    addAdminPembantu(namaKwartirRanting: string): Promise<void>;
    addLampiran(input: AddLampiranInput): Promise<string>;
    allKwartirRanting(): Promise<Array<KwartirRanting>>;
    approveAdminPembantu(principal: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateKwartirRanting(input: CreateOrUpdateKwartirRantingInput): Promise<void>;
    createOrUpdatePenilaian(input: CreateOrUpdatePenilaianInput): Promise<void>;
    deleteLampiran(id: string): Promise<void>;
    deletePenilaian(owner: Principal): Promise<void>;
    getAllLampiran(): Promise<Array<Lampiran>>;
    getAllSortedByScore(): Promise<Array<T>>;
    getCallerUserRole(): Promise<UserRole>;
    getKwartirRantingByOwner(owner: Principal): Promise<KwartirRanting | null>;
    getLampiranByOwner(owner: Principal): Promise<Array<Lampiran>>;
    getMyKwartirRanting(): Promise<KwartirRanting | null>;
    getMyLampiran(): Promise<Array<Lampiran>>;
    getPenilaianForOwner(owner: Principal): Promise<Penilaian | null>;
    isAdminPembantuCheck(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isCallerAdminPembantu(): Promise<boolean>;
    pendingAdminPembantu(): Promise<Array<AdminPembantu>>;
    removeAdminPembantu(principal: Principal): Promise<void>;
    submitKwartirRanting(): Promise<void>;
}
