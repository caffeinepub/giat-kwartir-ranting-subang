import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CreateOrUpdateKwartirRantingInput } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type FormState = {
  namaKwartirRanting: string;
  namaKetua: string;
  memilikiSekretariat: boolean;
  mediaSosial: string;
  memilkiBumiPerkemahan: boolean;
  masaBakti: string;
  nomorSk: string;
  gudepPutera: string;
  gudepPuteri: string;
  siagaPutera: string;
  siagaPuteri: string;
  penggalangPutera: string;
  penggalangPuteri: string;
  penegakPutera: string;
  penegakPuteri: string;
  pandegaPutera: string;
  pandegaPuteri: string;
  pembina: string;
  satuanKaryaAktif: string;
  anggotaSatgasPramukaPeduli: string;
  pestaSiaga: string;
  bazarSiaga: string;
  rekruitmenSiagaGaruda: string;
  jambore: string;
  dianpinru: string;
  lombaTingkatII: string;
  lombaGladiTangkasMedan: string;
  ikutLombaTingkatIII: string;
  rekruitmenPenggalangGaruda: string;
  raimuna: string;
  dianpinsat: string;
  mengirimkanUtusanKpd: string;
  mengirimkanUtusanLpk: string;
  mengirimkanUtusanDewanKerja: string;
  mengirimkanUtusanLpkdk: string;
  rekruitmenPenegakGaruda: string;
  perkemahanBaktiSatuanKarya: string;
  partisipasiPenangananBencanaC3: string;
  partisipasiKaryaBaktiNatalC3: string;
  partisipasiKaryaBaktiLebaranC3: string;
  karangPamitran: string;
  kmd: string;
  kml: string;
  mengirimkanUtusanKpdDewasa: string;
  mengirimkanUtusanKpl: string;
  mengirimkanUtusanKpdK: string;
  orientasiMajelisPembimbing: string;
  partisipasiPenangananBencanaC4: string;
  partisipasiKaryaBaktiNatalC4: string;
  partisipasiKaryaBaktiLebaranC4: string;
};

const defaultForm: FormState = {
  namaKwartirRanting: "",
  namaKetua: "",
  memilikiSekretariat: false,
  mediaSosial: "",
  memilkiBumiPerkemahan: false,
  masaBakti: "",
  nomorSk: "",
  gudepPutera: "0",
  gudepPuteri: "0",
  siagaPutera: "0",
  siagaPuteri: "0",
  penggalangPutera: "0",
  penggalangPuteri: "0",
  penegakPutera: "0",
  penegakPuteri: "0",
  pandegaPutera: "0",
  pandegaPuteri: "0",
  pembina: "0",
  satuanKaryaAktif: "0",
  anggotaSatgasPramukaPeduli: "0",
  pestaSiaga: "0",
  bazarSiaga: "0",
  rekruitmenSiagaGaruda: "0",
  jambore: "0",
  dianpinru: "0",
  lombaTingkatII: "0",
  lombaGladiTangkasMedan: "0",
  ikutLombaTingkatIII: "0",
  rekruitmenPenggalangGaruda: "0",
  raimuna: "0",
  dianpinsat: "0",
  mengirimkanUtusanKpd: "0",
  mengirimkanUtusanLpk: "0",
  mengirimkanUtusanDewanKerja: "0",
  mengirimkanUtusanLpkdk: "0",
  rekruitmenPenegakGaruda: "0",
  perkemahanBaktiSatuanKarya: "0",
  partisipasiPenangananBencanaC3: "0",
  partisipasiKaryaBaktiNatalC3: "0",
  partisipasiKaryaBaktiLebaranC3: "0",
  karangPamitran: "0",
  kmd: "0",
  kml: "0",
  mengirimkanUtusanKpdDewasa: "0",
  mengirimkanUtusanKpl: "0",
  mengirimkanUtusanKpdK: "0",
  orientasiMajelisPembimbing: "0",
  partisipasiPenangananBencanaC4: "0",
  partisipasiKaryaBaktiNatalC4: "0",
  partisipasiKaryaBaktiLebaranC4: "0",
};

function toBigInt(v: string): bigint {
  return BigInt(v || "0");
}

function toInput(form: FormState): CreateOrUpdateKwartirRantingInput {
  return {
    namaKwartirRanting: form.namaKwartirRanting,
    namaKetua: form.namaKetua,
    memilikiSekretariat: form.memilikiSekretariat,
    mediaSosial: form.mediaSosial,
    memilkiBumiPerkemahan: form.memilkiBumiPerkemahan,
    masaBakti: form.masaBakti,
    nomorSk: form.nomorSk,
    gudepPutera: toBigInt(form.gudepPutera),
    gudepPuteri: toBigInt(form.gudepPuteri),
    siagaPutera: toBigInt(form.siagaPutera),
    siagaPuteri: toBigInt(form.siagaPuteri),
    penggalangPutera: toBigInt(form.penggalangPutera),
    penggalangPuteri: toBigInt(form.penggalangPuteri),
    penegakPutera: toBigInt(form.penegakPutera),
    penegakPuteri: toBigInt(form.penegakPuteri),
    pandegaPutera: toBigInt(form.pandegaPutera),
    pandegaPuteri: toBigInt(form.pandegaPuteri),
    pembina: toBigInt(form.pembina),
    satuanKaryaAktif: toBigInt(form.satuanKaryaAktif),
    anggotaSatgasPramukaPeduli: toBigInt(form.anggotaSatgasPramukaPeduli),
    pestaSiaga: toBigInt(form.pestaSiaga),
    bazarSiaga: toBigInt(form.bazarSiaga),
    rekruitmenSiagaGaruda: toBigInt(form.rekruitmenSiagaGaruda),
    jambore: toBigInt(form.jambore),
    dianpinru: toBigInt(form.dianpinru),
    lombaTingkatII: toBigInt(form.lombaTingkatII),
    lombaGladiTangkasMedan: toBigInt(form.lombaGladiTangkasMedan),
    ikutLombaTingkatIII: toBigInt(form.ikutLombaTingkatIII),
    rekruitmenPenggalangGaruda: toBigInt(form.rekruitmenPenggalangGaruda),
    raimuna: toBigInt(form.raimuna),
    dianpinsat: toBigInt(form.dianpinsat),
    mengirimkanUtusanKpd: toBigInt(form.mengirimkanUtusanKpd),
    mengirimkanUtusanLpk: toBigInt(form.mengirimkanUtusanLpk),
    mengirimkanUtusanDewanKerja: toBigInt(form.mengirimkanUtusanDewanKerja),
    mengirimkanUtusanLpkdk: toBigInt(form.mengirimkanUtusanLpkdk),
    rekruitmenPenegakGaruda: toBigInt(form.rekruitmenPenegakGaruda),
    perkemahanBaktiSatuanKarya: toBigInt(form.perkemahanBaktiSatuanKarya),
    partisipasiPenangananBencanaC3: toBigInt(
      form.partisipasiPenangananBencanaC3,
    ),
    partisipasiKaryaBaktiNatalC3: toBigInt(form.partisipasiKaryaBaktiNatalC3),
    partisipasiKaryaBaktiLebaranC3: toBigInt(
      form.partisipasiKaryaBaktiLebaranC3,
    ),
    karangPamitran: toBigInt(form.karangPamitran),
    kmd: toBigInt(form.kmd),
    kml: toBigInt(form.kml),
    mengirimkanUtusanKpdDewasa: toBigInt(form.mengirimkanUtusanKpdDewasa),
    mengirimkanUtusanKpl: toBigInt(form.mengirimkanUtusanKpl),
    mengirimkanUtusanKpdK: toBigInt(form.mengirimkanUtusanKpdK),
    orientasiMajelisPembimbing: toBigInt(form.orientasiMajelisPembimbing),
    partisipasiPenangananBencanaC4: toBigInt(
      form.partisipasiPenangananBencanaC4,
    ),
    partisipasiKaryaBaktiNatalC4: toBigInt(form.partisipasiKaryaBaktiNatalC4),
    partisipasiKaryaBaktiLebaranC4: toBigInt(
      form.partisipasiKaryaBaktiLebaranC4,
    ),
  };
}

function NumInput({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9"
      />
    </div>
  );
}

export default function FormPage() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);

  const isLoggedIn = !!identity;

  const { data: existingKR, isLoading } = useQuery({
    queryKey: ["myKwartirRanting"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyKwartirRanting();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  useEffect(() => {
    if (existingKR) {
      setForm({
        namaKwartirRanting: existingKR.namaKwartirRanting,
        namaKetua: existingKR.namaKetua,
        memilikiSekretariat: existingKR.memilikiSekretariat,
        mediaSosial: existingKR.mediaSosial,
        memilkiBumiPerkemahan: existingKR.memilkiBumiPerkemahan,
        masaBakti: existingKR.masaBakti,
        nomorSk: existingKR.nomorSk,
        gudepPutera: String(existingKR.gudepPutera),
        gudepPuteri: String(existingKR.gudepPuteri),
        siagaPutera: String(existingKR.siagaPutera),
        siagaPuteri: String(existingKR.siagaPuteri),
        penggalangPutera: String(existingKR.penggalangPutera),
        penggalangPuteri: String(existingKR.penggalangPuteri),
        penegakPutera: String(existingKR.penegakPutera),
        penegakPuteri: String(existingKR.penegakPuteri),
        pandegaPutera: String(existingKR.pandegaPutera),
        pandegaPuteri: String(existingKR.pandegaPuteri),
        pembina: String(existingKR.pembina),
        satuanKaryaAktif: String(existingKR.satuanKaryaAktif),
        anggotaSatgasPramukaPeduli: String(
          existingKR.anggotaSatgasPramukaPeduli,
        ),
        pestaSiaga: String(existingKR.pestaSiaga),
        bazarSiaga: String(existingKR.bazarSiaga),
        rekruitmenSiagaGaruda: String(existingKR.rekruitmenSiagaGaruda),
        jambore: String(existingKR.jambore),
        dianpinru: String(existingKR.dianpinru),
        lombaTingkatII: String(existingKR.lombaTingkatII),
        lombaGladiTangkasMedan: String(existingKR.lombaGladiTangkasMedan),
        ikutLombaTingkatIII: String(existingKR.ikutLombaTingkatIII),
        rekruitmenPenggalangGaruda: String(
          existingKR.rekruitmenPenggalangGaruda,
        ),
        raimuna: String(existingKR.raimuna),
        dianpinsat: String(existingKR.dianpinsat),
        mengirimkanUtusanKpd: String(existingKR.mengirimkanUtusanKpd),
        mengirimkanUtusanLpk: String(existingKR.mengirimkanUtusanLpk),
        mengirimkanUtusanDewanKerja: String(
          existingKR.mengirimkanUtusanDewanKerja,
        ),
        mengirimkanUtusanLpkdk: String(existingKR.mengirimkanUtusanLpkdk),
        rekruitmenPenegakGaruda: String(existingKR.rekruitmenPenegakGaruda),
        perkemahanBaktiSatuanKarya: String(
          existingKR.perkemahanBaktiSatuanKarya,
        ),
        partisipasiPenangananBencanaC3: String(
          existingKR.partisipasiPenangananBencanaC3,
        ),
        partisipasiKaryaBaktiNatalC3: String(
          existingKR.partisipasiKaryaBaktiNatalC3,
        ),
        partisipasiKaryaBaktiLebaranC3: String(
          existingKR.partisipasiKaryaBaktiLebaranC3,
        ),
        karangPamitran: String(existingKR.karangPamitran),
        kmd: String(existingKR.kmd),
        kml: String(existingKR.kml),
        mengirimkanUtusanKpdDewasa: String(
          existingKR.mengirimkanUtusanKpdDewasa,
        ),
        mengirimkanUtusanKpl: String(existingKR.mengirimkanUtusanKpl),
        mengirimkanUtusanKpdK: String(existingKR.mengirimkanUtusanKpdK),
        orientasiMajelisPembimbing: String(
          existingKR.orientasiMajelisPembimbing,
        ),
        partisipasiPenangananBencanaC4: String(
          existingKR.partisipasiPenangananBencanaC4,
        ),
        partisipasiKaryaBaktiNatalC4: String(
          existingKR.partisipasiKaryaBaktiNatalC4,
        ),
        partisipasiKaryaBaktiLebaranC4: String(
          existingKR.partisipasiKaryaBaktiLebaranC4,
        ),
      });
    }
  }, [existingKR]);

  const set = (key: keyof FormState) => (val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.createOrUpdateKwartirRanting(toInput(form));
    },
    onSuccess: () => {
      toast.success("Data berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: ["myKwartirRanting"] });
    },
    onError: (e) => toast.error(`Gagal menyimpan: ${e}`),
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.createOrUpdateKwartirRanting(toInput(form));
      await actor.submitKwartirRanting();
    },
    onSuccess: () => {
      toast.success("Data berhasil diajukan untuk penilaian!");
      queryClient.invalidateQueries({ queryKey: ["myKwartirRanting"] });
    },
    onError: (e) => toast.error(`Gagal mengajukan: ${e}`),
  });

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">
          Silakan masuk terlebih dahulu untuk mengisi form penilaian.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-10"
        data-ocid="penilaian.loading_state"
      >
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">
          Form Data Kwartir Ranting
        </h1>
        <p className="text-muted-foreground mt-1">
          Lengkapi data Kwartir Ranting Anda
        </p>
      </div>

      <Tabs defaultValue="profil" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profil" data-ocid="form.profil.tab">
            A. Profil
          </TabsTrigger>
          <TabsTrigger value="potensi" data-ocid="form.potensi.tab">
            B. Data Potensi
          </TabsTrigger>
          <TabsTrigger value="kegiatan" data-ocid="form.kegiatan.tab">
            C. Kegiatan
          </TabsTrigger>
        </TabsList>

        {/* Tab A: Profil */}
        <TabsContent value="profil">
          <Card>
            <CardHeader>
              <CardTitle>A. Profil Kwartir Ranting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Nama Kwartir Ranting</Label>
                  <Input
                    value={form.namaKwartirRanting}
                    onChange={(e) => set("namaKwartirRanting")(e.target.value)}
                    placeholder="Nama KR"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Nama Ketua</Label>
                  <Input
                    value={form.namaKetua}
                    onChange={(e) => set("namaKetua")(e.target.value)}
                    placeholder="Nama ketua"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Media Sosial</Label>
                  <Input
                    value={form.mediaSosial}
                    onChange={(e) => set("mediaSosial")(e.target.value)}
                    placeholder="@username atau URL"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Masa Bakti</Label>
                  <Input
                    value={form.masaBakti}
                    onChange={(e) => set("masaBakti")(e.target.value)}
                    placeholder="Contoh: 2022-2025"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Nomor SK</Label>
                  <Input
                    value={form.nomorSk}
                    onChange={(e) => set("nomorSk")(e.target.value)}
                    placeholder="Nomor SK"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-3">
                  <Switch
                    id="sekretariat"
                    checked={form.memilikiSekretariat}
                    onCheckedChange={(v) => set("memilikiSekretariat")(v)}
                  />
                  <Label htmlFor="sekretariat">Memiliki Sekretariat</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="bumi"
                    checked={form.memilkiBumiPerkemahan}
                    onCheckedChange={(v) => set("memilkiBumiPerkemahan")(v)}
                  />
                  <Label htmlFor="bumi">Memiliki Bumi Perkemahan</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab B: Potensi */}
        <TabsContent value="potensi">
          <Card>
            <CardHeader>
              <CardTitle>B. Data Potensi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  Gugusdepan
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <NumInput
                    label="Gudep Putera"
                    value={form.gudepPutera}
                    onChange={set("gudepPutera")}
                  />
                  <NumInput
                    label="Gudep Puteri"
                    value={form.gudepPuteri}
                    onChange={set("gudepPuteri")}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  Anggota Muda
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <NumInput
                    label="Siaga Putera"
                    value={form.siagaPutera}
                    onChange={set("siagaPutera")}
                  />
                  <NumInput
                    label="Siaga Puteri"
                    value={form.siagaPuteri}
                    onChange={set("siagaPuteri")}
                  />
                  <NumInput
                    label="Penggalang Putera"
                    value={form.penggalangPutera}
                    onChange={set("penggalangPutera")}
                  />
                  <NumInput
                    label="Penggalang Puteri"
                    value={form.penggalangPuteri}
                    onChange={set("penggalangPuteri")}
                  />
                  <NumInput
                    label="Penegak Putera"
                    value={form.penegakPutera}
                    onChange={set("penegakPutera")}
                  />
                  <NumInput
                    label="Penegak Puteri"
                    value={form.penegakPuteri}
                    onChange={set("penegakPuteri")}
                  />
                  <NumInput
                    label="Pandega Putera"
                    value={form.pandegaPutera}
                    onChange={set("pandegaPutera")}
                  />
                  <NumInput
                    label="Pandega Puteri"
                    value={form.pandegaPuteri}
                    onChange={set("pandegaPuteri")}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  Anggota Dewasa & Lainnya
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <NumInput
                    label="Pembina"
                    value={form.pembina}
                    onChange={set("pembina")}
                  />
                  <NumInput
                    label="Satuan Karya Aktif"
                    value={form.satuanKaryaAktif}
                    onChange={set("satuanKaryaAktif")}
                  />
                  <NumInput
                    label="Anggota Satgas Pramuka Peduli"
                    value={form.anggotaSatgasPramukaPeduli}
                    onChange={set("anggotaSatgasPramukaPeduli")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab C: Kegiatan */}
        <TabsContent value="kegiatan">
          <Card>
            <CardHeader>
              <CardTitle>C. Kegiatan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  C.1 Siaga
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <NumInput
                    label="Pesta Siaga"
                    value={form.pestaSiaga}
                    onChange={set("pestaSiaga")}
                  />
                  <NumInput
                    label="Bazar Siaga"
                    value={form.bazarSiaga}
                    onChange={set("bazarSiaga")}
                  />
                  <NumInput
                    label="Rekruitmen Siaga Garuda"
                    value={form.rekruitmenSiagaGaruda}
                    onChange={set("rekruitmenSiagaGaruda")}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  C.2 Penggalang
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <NumInput
                    label="Jambore"
                    value={form.jambore}
                    onChange={set("jambore")}
                  />
                  <NumInput
                    label="Dianpinru"
                    value={form.dianpinru}
                    onChange={set("dianpinru")}
                  />
                  <NumInput
                    label="Lomba Tingkat II"
                    value={form.lombaTingkatII}
                    onChange={set("lombaTingkatII")}
                  />
                  <NumInput
                    label="Lomba Gladi Tangkas Medan"
                    value={form.lombaGladiTangkasMedan}
                    onChange={set("lombaGladiTangkasMedan")}
                  />
                  <NumInput
                    label="Ikut Lomba Tingkat III"
                    value={form.ikutLombaTingkatIII}
                    onChange={set("ikutLombaTingkatIII")}
                  />
                  <NumInput
                    label="Rekruitmen Penggalang Garuda"
                    value={form.rekruitmenPenggalangGaruda}
                    onChange={set("rekruitmenPenggalangGaruda")}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  C.3 Penegak/Pandega
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <NumInput
                    label="Raimuna"
                    value={form.raimuna}
                    onChange={set("raimuna")}
                  />
                  <NumInput
                    label="Dianpinsat"
                    value={form.dianpinsat}
                    onChange={set("dianpinsat")}
                  />
                  <NumInput
                    label="Mengirimkan Utusan KPD"
                    value={form.mengirimkanUtusanKpd}
                    onChange={set("mengirimkanUtusanKpd")}
                  />
                  <NumInput
                    label="Mengirimkan Utusan LPK"
                    value={form.mengirimkanUtusanLpk}
                    onChange={set("mengirimkanUtusanLpk")}
                  />
                  <NumInput
                    label="Mengirimkan Utusan Dewan Kerja"
                    value={form.mengirimkanUtusanDewanKerja}
                    onChange={set("mengirimkanUtusanDewanKerja")}
                  />
                  <NumInput
                    label="Mengirimkan Utusan LPKDK"
                    value={form.mengirimkanUtusanLpkdk}
                    onChange={set("mengirimkanUtusanLpkdk")}
                  />
                  <NumInput
                    label="Rekruitmen Penegak Garuda"
                    value={form.rekruitmenPenegakGaruda}
                    onChange={set("rekruitmenPenegakGaruda")}
                  />
                  <NumInput
                    label="Perkemahan Bakti Satuan Karya"
                    value={form.perkemahanBaktiSatuanKarya}
                    onChange={set("perkemahanBaktiSatuanKarya")}
                  />
                  <NumInput
                    label="Partisipasi Penanganan Bencana"
                    value={form.partisipasiPenangananBencanaC3}
                    onChange={set("partisipasiPenangananBencanaC3")}
                  />
                  <NumInput
                    label="Partisipasi Karya Bakti Natal"
                    value={form.partisipasiKaryaBaktiNatalC3}
                    onChange={set("partisipasiKaryaBaktiNatalC3")}
                  />
                  <NumInput
                    label="Partisipasi Karya Bakti Lebaran"
                    value={form.partisipasiKaryaBaktiLebaranC3}
                    onChange={set("partisipasiKaryaBaktiLebaranC3")}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  C.4 Dewasa
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <NumInput
                    label="Karang Pamitran"
                    value={form.karangPamitran}
                    onChange={set("karangPamitran")}
                  />
                  <NumInput
                    label="KMD"
                    value={form.kmd}
                    onChange={set("kmd")}
                  />
                  <NumInput
                    label="KML"
                    value={form.kml}
                    onChange={set("kml")}
                  />
                  <NumInput
                    label="Mengirimkan Utusan KPD (Dewasa)"
                    value={form.mengirimkanUtusanKpdDewasa}
                    onChange={set("mengirimkanUtusanKpdDewasa")}
                  />
                  <NumInput
                    label="Mengirimkan Utusan KPL"
                    value={form.mengirimkanUtusanKpl}
                    onChange={set("mengirimkanUtusanKpl")}
                  />
                  <NumInput
                    label="Mengirimkan Utusan KPD-K"
                    value={form.mengirimkanUtusanKpdK}
                    onChange={set("mengirimkanUtusanKpdK")}
                  />
                  <NumInput
                    label="Orientasi Majelis Pembimbing"
                    value={form.orientasiMajelisPembimbing}
                    onChange={set("orientasiMajelisPembimbing")}
                  />
                  <NumInput
                    label="Partisipasi Penanganan Bencana"
                    value={form.partisipasiPenangananBencanaC4}
                    onChange={set("partisipasiPenangananBencanaC4")}
                  />
                  <NumInput
                    label="Partisipasi Karya Bakti Natal"
                    value={form.partisipasiKaryaBaktiNatalC4}
                    onChange={set("partisipasiKaryaBaktiNatalC4")}
                  />
                  <NumInput
                    label="Partisipasi Karya Bakti Lebaran"
                    value={form.partisipasiKaryaBaktiLebaranC4}
                    onChange={set("partisipasiKaryaBaktiLebaranC4")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 mt-6 justify-end">
        <Button
          variant="outline"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          data-ocid="form.save.button"
        >
          {saveMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Simpan Draft
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={submitMutation.isPending}
              data-ocid="form.submit.button"
            >
              {submitMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Ajukan Penilaian
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Pengajuan</AlertDialogTitle>
              <AlertDialogDescription>
                Data Kwartir Ranting akan disimpan dan diajukan untuk penilaian.
                Pastikan semua data sudah benar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => submitMutation.mutate()}>
                Ya, Ajukan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
