import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useActor } from "../hooks/useActor";

function InfoRow({
  label,
  value,
}: { label: string; value: string | number | boolean }) {
  if (typeof value === "boolean") {
    return (
      <div className="flex items-center justify-between py-2 border-b last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        {value ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-400" />
        )}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{String(value)}</span>
    </div>
  );
}

function NumRow({ label, value }: { label: string; value: bigint }) {
  return <InfoRow label={label} value={Number(value)} />;
}

export default function DetailPage() {
  const { ownerId } = useParams({ from: "/detail/$ownerId" });
  const { actor, isFetching } = useActor();

  const ownerPrincipal = (() => {
    try {
      return Principal.fromText(ownerId);
    } catch {
      return null;
    }
  })();

  const { data: kr, isLoading: loadingKR } = useQuery({
    queryKey: ["kwartirRanting", ownerId],
    queryFn: async () => {
      if (!actor || !ownerPrincipal) return null;
      return actor.getKwartirRantingByOwner(ownerPrincipal);
    },
    enabled: !!actor && !isFetching && !!ownerPrincipal,
  });

  const { data: penilaian, isLoading: loadingPenilaian } = useQuery({
    queryKey: ["penilaian", ownerId],
    queryFn: async () => {
      if (!actor || !ownerPrincipal) return null;
      return actor.getPenilaianForOwner(ownerPrincipal);
    },
    enabled: !!actor && !isFetching && !!ownerPrincipal,
  });

  if (loadingKR) {
    return (
      <div
        className="container mx-auto px-4 py-10"
        data-ocid="penilaian.loading_state"
      >
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!kr) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="penilaian.empty_state"
      >
        <p className="text-muted-foreground">
          Data Kwartir Ranting tidak ditemukan.
        </p>
        <Link to="/ranking" className="text-primary mt-4 inline-block">
          ← Kembali ke Ranking
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        to="/ranking"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Ranking
      </Link>

      <h1 className="font-display text-3xl font-bold mb-1">
        {kr.namaKwartirRanting}
      </h1>
      <p className="text-muted-foreground mb-6">Ketua: {kr.namaKetua}</p>

      {/* Scores */}
      {!loadingPenilaian && penilaian && (
        <Card className="mb-6 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Hasil Penilaian</span>
              <Badge className="text-sm">{penilaian.namaKegiatan}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: "Skor Profil", value: penilaian.skorProfil },
                { label: "Skor Potensi", value: penilaian.skorPotensi },
                { label: "Skor Kegiatan", value: penilaian.skorKegiatan },
                { label: "Total Skor", value: penilaian.skorTotal },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted rounded-lg p-3">
                  <p className="text-2xl font-bold text-primary">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section A */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">A. Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow label="Nama KR" value={kr.namaKwartirRanting} />
          <InfoRow label="Nama Ketua" value={kr.namaKetua} />
          <InfoRow label="Masa Bakti" value={kr.masaBakti} />
          <InfoRow label="Nomor SK" value={kr.nomorSk} />
          <InfoRow label="Media Sosial" value={kr.mediaSosial || "–"} />
          <InfoRow
            label="Memiliki Sekretariat"
            value={kr.memilikiSekretariat}
          />
          <InfoRow
            label="Memiliki Bumi Perkemahan"
            value={kr.memilkiBumiPerkemahan}
          />
        </CardContent>
      </Card>

      {/* Section B */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">B. Data Potensi</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-2" />
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Gugusdepan
          </p>
          <NumRow label="Gudep Putera" value={kr.gudepPutera} />
          <NumRow label="Gudep Puteri" value={kr.gudepPuteri} />
          <Separator className="my-2" />
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Anggota Muda
          </p>
          <NumRow label="Siaga Putera" value={kr.siagaPutera} />
          <NumRow label="Siaga Puteri" value={kr.siagaPuteri} />
          <NumRow label="Penggalang Putera" value={kr.penggalangPutera} />
          <NumRow label="Penggalang Puteri" value={kr.penggalangPuteri} />
          <NumRow label="Penegak Putera" value={kr.penegakPutera} />
          <NumRow label="Penegak Puteri" value={kr.penegakPuteri} />
          <NumRow label="Pandega Putera" value={kr.pandegaPutera} />
          <NumRow label="Pandega Puteri" value={kr.pandegaPuteri} />
          <Separator className="my-2" />
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Lainnya
          </p>
          <NumRow label="Pembina" value={kr.pembina} />
          <NumRow label="Satuan Karya Aktif" value={kr.satuanKaryaAktif} />
          <NumRow
            label="Anggota Satgas Pramuka Peduli"
            value={kr.anggotaSatgasPramukaPeduli}
          />
        </CardContent>
      </Card>

      {/* Section C */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">C. Kegiatan</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-2" />
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            C.1 Siaga
          </p>
          <NumRow label="Pesta Siaga" value={kr.pestaSiaga} />
          <NumRow label="Bazar Siaga" value={kr.bazarSiaga} />
          <NumRow
            label="Rekruitmen Siaga Garuda"
            value={kr.rekruitmenSiagaGaruda}
          />
          <Separator className="my-2" />
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            C.2 Penggalang
          </p>
          <NumRow label="Jambore" value={kr.jambore} />
          <NumRow label="Dianpinru" value={kr.dianpinru} />
          <NumRow label="Lomba Tingkat II" value={kr.lombaTingkatII} />
          <NumRow
            label="Lomba Gladi Tangkas Medan"
            value={kr.lombaGladiTangkasMedan}
          />
          <NumRow
            label="Ikut Lomba Tingkat III"
            value={kr.ikutLombaTingkatIII}
          />
          <NumRow
            label="Rekruitmen Penggalang Garuda"
            value={kr.rekruitmenPenggalangGaruda}
          />
          <Separator className="my-2" />
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            C.3 Penegak/Pandega
          </p>
          <NumRow label="Raimuna" value={kr.raimuna} />
          <NumRow label="Dianpinsat" value={kr.dianpinsat} />
          <NumRow
            label="Mengirimkan Utusan KPD"
            value={kr.mengirimkanUtusanKpd}
          />
          <NumRow
            label="Mengirimkan Utusan LPK"
            value={kr.mengirimkanUtusanLpk}
          />
          <NumRow
            label="Mengirimkan Utusan Dewan Kerja"
            value={kr.mengirimkanUtusanDewanKerja}
          />
          <NumRow
            label="Mengirimkan Utusan LPKDK"
            value={kr.mengirimkanUtusanLpkdk}
          />
          <NumRow
            label="Rekruitmen Penegak Garuda"
            value={kr.rekruitmenPenegakGaruda}
          />
          <NumRow
            label="Perkemahan Bakti Satuan Karya"
            value={kr.perkemahanBaktiSatuanKarya}
          />
          <NumRow
            label="Partisipasi Penanganan Bencana"
            value={kr.partisipasiPenangananBencanaC3}
          />
          <NumRow
            label="Partisipasi Karya Bakti Natal"
            value={kr.partisipasiKaryaBaktiNatalC3}
          />
          <NumRow
            label="Partisipasi Karya Bakti Lebaran"
            value={kr.partisipasiKaryaBaktiLebaranC3}
          />
          <Separator className="my-2" />
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            C.4 Dewasa
          </p>
          <NumRow label="Karang Pamitran" value={kr.karangPamitran} />
          <NumRow label="KMD" value={kr.kmd} />
          <NumRow label="KML" value={kr.kml} />
          <NumRow
            label="Mengirimkan Utusan KPD (Dewasa)"
            value={kr.mengirimkanUtusanKpdDewasa}
          />
          <NumRow
            label="Mengirimkan Utusan KPL"
            value={kr.mengirimkanUtusanKpl}
          />
          <NumRow
            label="Mengirimkan Utusan KPD-K"
            value={kr.mengirimkanUtusanKpdK}
          />
          <NumRow
            label="Orientasi Majelis Pembimbing"
            value={kr.orientasiMajelisPembimbing}
          />
          <NumRow
            label="Partisipasi Penanganan Bencana"
            value={kr.partisipasiPenangananBencanaC4}
          />
          <NumRow
            label="Partisipasi Karya Bakti Natal"
            value={kr.partisipasiKaryaBaktiNatalC4}
          />
          <NumRow
            label="Partisipasi Karya Bakti Lebaran"
            value={kr.partisipasiKaryaBaktiLebaranC4}
          />
        </CardContent>
      </Card>
    </div>
  );
}
