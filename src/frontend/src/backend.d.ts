import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdminPembantu {
    status: Variant_pending_approved;
    principal: Principal;
    namaKwartirRanting: string;
}
export type T = [KwartirRanting, Penilaian | null];
export interface Penilaian {
    assessedAt: bigint;
    assessedBy: Principal;
    skorPotensi: number;
    skorKegiatan: number;
    skorProfil: number;
    kwartirRantingOwner: Principal;
    skorTotal: number;
    namaKegiatan: string;
}
export interface CreateOrUpdatePenilaianInput {
    skorPotensi: number;
    skorKegiatan: number;
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
    siagaPutera: bigint;
    siagaPuteri: bigint;
    perkemahanBaktiSatuanKarya: bigint;
    lombaTingkatII: bigint;
    satuanKaryaAktif: bigint;
    bazarSiaga: bigint;
    masaBakti: string;
    owner: Principal;
    mengirimkanUtusanDewanKerja: bigint;
    partisipasiKaryaBaktiLebaranC3: bigint;
    partisipasiKaryaBaktiLebaranC4: bigint;
    namaKetua: string;
    rekruitmenPenegakGaruda: bigint;
    penegakPutera: bigint;
    penegakPuteri: bigint;
    nomorSk: string;
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
    partisipasiKaryaBaktiNatalC3: bigint;
    partisipasiKaryaBaktiNatalC4: bigint;
    orientasiMajelisPembimbing: bigint;
    memilikiSekretariat: boolean;
    penggalangPutera: bigint;
    penggalangPuteri: bigint;
}
export interface CreateOrUpdateKwartirRantingInput {
    kmd: bigint;
    kml: bigint;
    jambore: bigint;
    raimuna: bigint;
    ikutLombaTingkatIII: bigint;
    siagaPutera: bigint;
    siagaPuteri: bigint;
    perkemahanBaktiSatuanKarya: bigint;
    lombaTingkatII: bigint;
    satuanKaryaAktif: bigint;
    bazarSiaga: bigint;
    masaBakti: string;
    mengirimkanUtusanDewanKerja: bigint;
    partisipasiKaryaBaktiLebaranC3: bigint;
    partisipasiKaryaBaktiLebaranC4: bigint;
    namaKetua: string;
    rekruitmenPenegakGaruda: bigint;
    penegakPutera: bigint;
    penegakPuteri: bigint;
    nomorSk: string;
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
    partisipasiKaryaBaktiNatalC3: bigint;
    partisipasiKaryaBaktiNatalC4: bigint;
    orientasiMajelisPembimbing: bigint;
    memilikiSekretariat: boolean;
    penggalangPutera: bigint;
    penggalangPuteri: bigint;
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
    allKwartirRanting(): Promise<Array<KwartirRanting>>;
    approveAdminPembantu(principal: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateKwartirRanting(input: CreateOrUpdateKwartirRantingInput): Promise<void>;
    createOrUpdatePenilaian(input: CreateOrUpdatePenilaianInput): Promise<void>;
    deletePenilaian(owner: Principal): Promise<void>;
    getAllSortedByScore(): Promise<Array<T>>;
    getCallerUserRole(): Promise<UserRole>;
    getKwartirRantingByOwner(owner: Principal): Promise<KwartirRanting | null>;
    getMyKwartirRanting(): Promise<KwartirRanting | null>;
    getPenilaianForOwner(owner: Principal): Promise<Penilaian | null>;
    isAdminPembantuCheck(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isCallerAdminPembantu(): Promise<boolean>;
    pendingAdminPembantu(): Promise<Array<AdminPembantu>>;
    removeAdminPembantu(principal: Principal): Promise<void>;
    submitKwartirRanting(): Promise<void>;
}
