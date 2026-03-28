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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Check,
  ClipboardList,
  Edit,
  FileDown,
  LayoutDashboard,
  Loader2,
  Paperclip,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { ExternalBlob, Variant_pending_approved } from "../backend";
import type { KwartirRanting, Penilaian } from "../backend";
import PenilaianForm from "../components/PenilaianForm";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

const BULAN_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const CHART_COLORS = [
  "#22553b",
  "#4ade80",
  "#16a34a",
  "#86efac",
  "#15803d",
  "#bbf7d0",
];
const PIE_COLORS = ["#22553b", "#d1fae5"];

function formatTanggalID(date: Date): string {
  return `${date.getDate()} ${BULAN_ID[date.getMonth()]} ${date.getFullYear()}`;
}

type ActiveMenu = "dashboard" | "penilaian" | "pembantu" | "lampiran";

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const isLoggedIn = !!identity;

  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("dashboard");

  const [penilaianDialog, setPenilaianDialog] = useState<{
    open: boolean;
    kr: KwartirRanting | null;
    existing: Penilaian | null;
  }>({ open: false, kr: null, existing: null });

  const { data: isAdmin, isLoading: loadingAdmin } = useQuery({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isLoggedIn) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  const { data: allKR, isLoading: loadingKR } = useQuery({
    queryKey: ["allKwartirRanting"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.allKwartirRanting();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });

  const { data: allSorted } = useQuery({
    queryKey: ["allSortedByScore"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSortedByScore();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });

  const { data: pendingList, isLoading: loadingPending } = useQuery({
    queryKey: ["pendingAdminPembantu"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.pendingAdminPembantu();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });

  const approveMutation = useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.approveAdminPembantu(principal);
    },
    onSuccess: () => {
      toast.success("Admin pembantu disetujui!");
      queryClient.invalidateQueries({ queryKey: ["pendingAdminPembantu"] });
    },
    onError: (e) => toast.error(`Gagal menyetujui: ${e}`),
  });

  const removeMutation = useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.removeAdminPembantu(principal);
    },
    onSuccess: () => {
      toast.success("Admin pembantu dihapus!");
      queryClient.invalidateQueries({ queryKey: ["pendingAdminPembantu"] });
    },
    onError: (e) => toast.error(`Gagal menghapus: ${e}`),
  });

  const { data: allLampiran = [] } = useQuery({
    queryKey: ["allLampiran"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLampiran();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });

  const deletePenilaianMutation = useMutation({
    mutationFn: async (owner: Principal) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.deletePenilaian(owner);
    },
    onSuccess: () => {
      toast.success("Penilaian berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["allSortedByScore"] });
      queryClient.invalidateQueries({ queryKey: ["allKwartirRanting"] });
    },
    onError: (e) => toast.error(`Gagal menghapus penilaian: ${e}`),
  });

  const getPenilaianForKR = (kr: KwartirRanting): Penilaian | null => {
    const found = (allSorted || []).find(
      ([k]) => k.owner.toString() === kr.owner.toString(),
    );
    return found ? found[1] : null;
  };

  const handleDownloadPDF = async () => {
    const sorted = allSorted || [];
    const now = new Date();
    const tanggal = formatTanggalID(now);

    const w = window as any;
    if (!w.jspdf) {
      toast.error("Library PDF belum siap, coba lagi sebentar.");
      return;
    }
    const { jsPDF } = w.jspdf;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Try to embed Pramuka logo
    let logoLoaded = false;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => {
          logoLoaded = true;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = "/assets/generated/pramuka-logo-transparent.dim_200x200.png";
      });
      if (logoLoaded) {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        // Center logo at top
        const logoW = 20;
        const logoH = 20;
        doc.addImage(
          dataUrl,
          "PNG",
          pageWidth / 2 - logoW / 2,
          4,
          logoW,
          logoH,
        );
      }
    } catch (_) {
      /* skip logo if error */
    }

    const headerTop = logoLoaded ? 28 : 18;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      "REKAP HASIL PENILAIAN KWARTIR RANTING TERGIAT KWARCAB SUBANG",
      pageWidth / 2,
      headerTop,
      { align: "center" },
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Kwartir Cabang Subang", pageWidth / 2, headerTop + 7, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.text(`Dicetak: ${tanggal}`, pageWidth / 2, headerTop + 13, {
      align: "center",
    });

    const tableBody = sorted.map(([kr, p], idx) => [
      idx + 1,
      kr.namaKwartirRanting,
      kr.namaKetua,
      p ? String(p.skorProfil) : "-",
      p ? String(p.skorPotensi) : "-",
      p ? String(p.skorKegiatan) : "-",
      p ? String(p.skorTotal) : "-",
    ]);

    doc.autoTable({
      startY: headerTop + 18,
      head: [
        [
          "No",
          "Nama Kwartir Ranting",
          "Nama Ketua",
          "Skor Profil",
          "Skor Potensi",
          "Skor Kegiatan",
          "Total Skor",
        ],
      ],
      body: tableBody,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [34, 85, 34],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [240, 248, 240] },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center", fontStyle: "bold" },
      },
    });

    const finalY = doc.lastAutoTable.finalY + 14;

    doc.setFontSize(10);
    doc.text(`Subang, ${tanggal}`, pageWidth - 60, finalY, { align: "center" });
    doc.text("Ketua Kwarcab Subang", pageWidth - 60, finalY + 6, {
      align: "center",
    });
    doc.text("( ________________________ )", pageWidth - 60, finalY + 32, {
      align: "center",
    });

    doc.save(`Rekap-Penilaian-KR-Subang-${now.getFullYear()}.pdf`);
    toast.success("PDF berhasil diunduh!");
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Silakan masuk terlebih dahulu.</p>
      </div>
    );
  }

  if (
    isFetching ||
    !actor ||
    loadingAdmin ||
    (isAdmin === undefined && isLoggedIn)
  ) {
    return (
      <div
        className="container mx-auto px-4 py-10"
        data-ocid="penilaian.loading_state"
      >
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">
          Anda tidak memiliki akses ke halaman ini.
        </p>
      </div>
    );
  }

  const pending = (pendingList || []).filter(
    (a) => a.status === Variant_pending_approved.pending,
  );
  const approved = (pendingList || []).filter(
    (a) => a.status === Variant_pending_approved.approved,
  );

  const totalKR = (allKR || []).length;
  const totalDinilai = (allSorted || []).filter(([, p]) => p != null).length;
  const totalBelumDinilai = totalKR - totalDinilai;
  const topKR =
    (allSorted || []).length > 0
      ? (allSorted || []).find(([, p]) => p != null)
      : null;

  // Chart data
  const barChartData = (allSorted || [])
    .filter(([, p]) => p != null)
    .map(([kr, p]) => ({
      nama: kr.namaKwartirRanting.replace("Kwartir Ranting ", "KR "),
      skor: p?.skorTotal ?? 0,
    }));

  const pieChartData = [
    { name: "Sudah Dinilai", value: totalDinilai },
    { name: "Belum Dinilai", value: totalBelumDinilai },
  ].filter((d) => d.value > 0);

  const menuItems: {
    id: ActiveMenu;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    ocid: string;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      ocid: "admin.nav.dashboard.link",
    },
    {
      id: "penilaian",
      label: "Daftar Penilaian",
      icon: <ClipboardList className="h-4 w-4" />,
      ocid: "admin.nav.penilaian.link",
    },
    {
      id: "pembantu",
      label: "Kelola Admin Pembantu",
      icon: <Users className="h-4 w-4" />,
      badge: pending.length > 0 ? pending.length : undefined,
      ocid: "admin.nav.pembantu.link",
    },
    {
      id: "lampiran",
      label: "Dokumen Lampiran",
      icon: <Paperclip className="h-4 w-4" />,
      badge: allLampiran.length > 0 ? allLampiran.length : undefined,
      ocid: "admin.nav.lampiran.link",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top nav */}
      <div className="md:hidden border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 no-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMenu(item.id)}
                data-ocid={item.ocid}
                className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${
                  activeMenu === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col w-60 flex-shrink-0">
            <div className="sticky top-6">
              {/* Sidebar header */}
              <div className="mb-4 px-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Menu
                </p>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Admin Dashboard
                </h2>
              </div>
              <Separator className="mb-4" />
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveMenu(item.id)}
                    data-ocid={item.ocid}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                      activeMenu === item.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 min-w-5 px-1 flex items-center justify-center text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Dashboard Overview */}
            {activeMenu === "dashboard" && (
              <div className="space-y-6" data-ocid="admin.dashboard.section">
                <div>
                  <h1 className="font-display text-2xl font-bold">Dashboard</h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Ringkasan data penilaian Kwartir Ranting
                  </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card
                    className="border-border"
                    data-ocid="admin.stats.total_kr.card"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Total KR Terdaftar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingKR ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold font-display">
                            {totalKR}
                          </span>
                          <span className="text-muted-foreground text-sm mb-0.5">
                            KR
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card
                    className="border-border"
                    data-ocid="admin.stats.dinilai.card"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Sudah Dinilai
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingKR ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold font-display text-primary">
                            {totalDinilai}
                          </span>
                          <span className="text-muted-foreground text-sm mb-0.5">
                            KR
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card
                    className="border-border"
                    data-ocid="admin.stats.belum_dinilai.card"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Belum Dinilai
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingKR ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold font-display text-destructive">
                            {totalBelumDinilai}
                          </span>
                          <span className="text-muted-foreground text-sm mb-0.5">
                            KR
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card
                    className="border-border"
                    data-ocid="admin.stats.top_kr.card"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Skor Tertinggi
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingKR ? (
                        <Skeleton className="h-8 w-24" />
                      ) : topKR ? (
                        <div>
                          <div className="text-xl font-bold font-display text-primary">
                            {topKR[1]?.skorTotal ?? "–"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">
                            {topKR[0].namaKwartirRanting}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Belum ada data
                        </span>
                      )}
                    </CardContent>
                  </Card>

                  <Card
                    className="border-border"
                    data-ocid="admin.stats.lampiran.card"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        Total Lampiran
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold font-display text-primary">
                          {allLampiran.length}
                        </span>
                        <span className="text-muted-foreground text-sm mb-0.5">
                          dokumen
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bar Chart - Skor Total */}
                  <Card data-ocid="admin.score_chart.card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Perbandingan Skor Total KR
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingKR ? (
                        <div
                          className="space-y-2"
                          data-ocid="admin.score_chart.loading_state"
                        >
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-36 w-full" />
                        </div>
                      ) : barChartData.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                          Belum ada data penilaian
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart
                            data={barChartData}
                            margin={{ top: 4, right: 8, left: -16, bottom: 48 }}
                          >
                            <XAxis
                              dataKey="nama"
                              tick={{ fontSize: 10 }}
                              angle={-35}
                              textAnchor="end"
                              interval={0}
                            />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip
                              formatter={(value: number) => [
                                value,
                                "Skor Total",
                              ]}
                              contentStyle={{
                                fontSize: 12,
                                borderRadius: 8,
                                border: "1px solid hsl(var(--border))",
                                background: "hsl(var(--card))",
                                color: "hsl(var(--foreground))",
                              }}
                            />
                            <Bar dataKey="skor" radius={[4, 4, 0, 0]}>
                              {barChartData.map((_, index) => (
                                <Cell
                                  key={`cell-${barChartData[index].nama}`}
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pie Chart - Status Penilaian */}
                  <Card data-ocid="admin.status_chart.card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Status Penilaian
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingKR ? (
                        <div
                          className="space-y-2"
                          data-ocid="admin.status_chart.loading_state"
                        >
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-36 w-full rounded-full mx-auto" />
                        </div>
                      ) : totalKR === 0 ? (
                        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                          Belum ada KR terdaftar
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="45%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                              labelLine={false}
                            >
                              {pieChartData.map((_, index) => (
                                <Cell
                                  key={`pie-cell-${pieChartData[index].name}`}
                                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number, name: string) => [
                                `${value} KR`,
                                name,
                              ]}
                              contentStyle={{
                                fontSize: 12,
                                borderRadius: 8,
                                border: "1px solid hsl(var(--border))",
                                background: "hsl(var(--card))",
                                color: "hsl(var(--foreground))",
                              }}
                            />
                            <Legend
                              iconType="circle"
                              iconSize={10}
                              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick summary table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Ranking Sementara
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingKR ? (
                      <div className="p-6 space-y-3">
                        {SKELETON_KEYS.map((k) => (
                          <Skeleton key={k} className="h-10" />
                        ))}
                      </div>
                    ) : (allSorted || []).filter(([, p]) => p != null)
                        .length === 0 ? (
                      <div className="p-10 text-center text-muted-foreground text-sm">
                        Belum ada data penilaian
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10">No</TableHead>
                            <TableHead>Nama KR</TableHead>
                            <TableHead className="text-right">
                              Total Skor
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(allSorted || [])
                            .filter(([, p]) => p != null)
                            .slice(0, 5)
                            .map(([kr, p], idx) => (
                              <TableRow key={kr.owner.toString()}>
                                <TableCell className="font-medium">
                                  {idx === 0 ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                      1
                                    </span>
                                  ) : (
                                    idx + 1
                                  )}
                                </TableCell>
                                <TableCell>{kr.namaKwartirRanting}</TableCell>
                                <TableCell className="text-right">
                                  <Badge>{p?.skorTotal}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* Pending admin pembantu alert */}
                {pending.length > 0 && (
                  <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-destructive" />
                          <div>
                            <p className="text-sm font-medium">
                              {pending.length} permintaan Admin Pembantu
                              menunggu persetujuan
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Tinjau dan setujui akun baru
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveMenu("pembantu")}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          Tinjau
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Daftar Penilaian */}
            {activeMenu === "penilaian" && (
              <div className="space-y-4">
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    Daftar Penilaian
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Kelola penilaian semua Kwartir Ranting
                  </p>
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">
                      Daftar Kwartir Ranting
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadPDF}
                      disabled={loadingKR || (allSorted || []).length === 0}
                      data-ocid="admin.download_pdf.button"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Download Rekap PDF
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingKR ? (
                      <div
                        className="p-6 space-y-3"
                        data-ocid="penilaian.loading_state"
                      >
                        {SKELETON_KEYS.map((k) => (
                          <Skeleton key={k} className="h-12" />
                        ))}
                      </div>
                    ) : (allKR || []).length === 0 ? (
                      <div
                        className="p-12 text-center"
                        data-ocid="penilaian.empty_state"
                      >
                        <UserPlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          Belum ada KR terdaftar
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama KR</TableHead>
                            <TableHead>Nama Ketua</TableHead>
                            <TableHead className="text-right">
                              Skor Profil
                            </TableHead>
                            <TableHead className="text-right">
                              Skor Potensi
                            </TableHead>
                            <TableHead className="text-right">
                              Skor Kegiatan
                            </TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(allKR || []).map((kr, idx) => {
                            const p = getPenilaianForKR(kr);
                            return (
                              <TableRow key={kr.owner.toString()}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell className="font-medium">
                                  {kr.namaKwartirRanting}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {kr.namaKetua}
                                </TableCell>
                                <TableCell className="text-right">
                                  {p ? p.skorProfil : "–"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {p ? p.skorPotensi : "–"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {p ? p.skorKegiatan : "–"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {p ? (
                                    <Badge>{p.skorTotal}</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">
                                      –
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setPenilaianDialog({
                                          open: true,
                                          kr,
                                          existing: p,
                                        })
                                      }
                                      data-ocid={`penilaian.edit_button.${idx + 1}`}
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          data-ocid={`penilaian.delete_button.${idx + 1}`}
                                        >
                                          <Trash2 className="h-3 w-3 mr-1" />
                                          Hapus
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent data-ocid="penilaian.dialog">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Hapus Penilaian?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Data penilaian untuk{" "}
                                            <strong>
                                              {kr.namaKwartirRanting}
                                            </strong>{" "}
                                            akan dihapus permanen. Tindakan ini
                                            tidak dapat dibatalkan.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel data-ocid="penilaian.cancel_button">
                                            Batal
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              deletePenilaianMutation.mutate(
                                                kr.owner as Principal,
                                              )
                                            }
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            data-ocid="penilaian.confirm_button"
                                          >
                                            {deletePenilaianMutation.isPending ? (
                                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            ) : (
                                              <Trash2 className="h-3 w-3 mr-1" />
                                            )}
                                            Hapus Permanen
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Kelola Admin Pembantu */}
            {activeMenu === "pembantu" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    Kelola Admin Pembantu
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Setujui atau hapus akun Admin Pembantu
                  </p>
                </div>

                {/* Pending */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      Menunggu Persetujuan
                      {pending.length > 0 && (
                        <Badge variant="destructive">{pending.length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingPending ? (
                      <div className="p-4">
                        <Skeleton className="h-12" />
                      </div>
                    ) : pending.length === 0 ? (
                      <div
                        className="p-8 text-center"
                        data-ocid="penilaian.empty_state"
                      >
                        <p className="text-muted-foreground text-sm">
                          Tidak ada permintaan pending
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Principal</TableHead>
                            <TableHead>Nama KR</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pending.map((ap, idx) => (
                            <TableRow
                              key={ap.principal.toString()}
                              data-ocid={`admin.pembantu.row.${idx + 1}`}
                            >
                              <TableCell className="font-mono text-xs">
                                {ap.principal.toString().slice(0, 20)}...
                              </TableCell>
                              <TableCell>{ap.namaKwartirRanting}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      approveMutation.mutate(
                                        ap.principal as Principal,
                                      )
                                    }
                                    disabled={approveMutation.isPending}
                                  >
                                    {approveMutation.isPending ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Check className="h-3 w-3" />
                                    )}
                                    Setujui
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      removeMutation.mutate(
                                        ap.principal as Principal,
                                      )
                                    }
                                    disabled={removeMutation.isPending}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* Approved */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      Admin Pembantu Aktif
                      <Badge variant="secondary">{approved.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {approved.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-muted-foreground text-sm">
                          Belum ada admin pembantu aktif
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Principal</TableHead>
                            <TableHead>Nama KR</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {approved.map((ap, idx) => (
                            <TableRow
                              key={ap.principal.toString()}
                              data-ocid={`admin.pembantu.row.${idx + 1}`}
                            >
                              <TableCell className="font-mono text-xs">
                                {ap.principal.toString().slice(0, 20)}...
                              </TableCell>
                              <TableCell>{ap.namaKwartirRanting}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    removeMutation.mutate(
                                      ap.principal as Principal,
                                    )
                                  }
                                  disabled={removeMutation.isPending}
                                  data-ocid={`admin.pembantu.delete_button.${idx + 1}`}
                                >
                                  {removeMutation.isPending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <X className="h-3 w-3" />
                                  )}
                                  Hapus
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            {/* Lampiran Panel */}
            {activeMenu === "lampiran" && (
              <div className="space-y-6" data-ocid="admin.lampiran.section">
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    Dokumen Lampiran
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Dokumen yang diunggah oleh peserta KR
                  </p>
                </div>
                {allLampiran.length === 0 ? (
                  <Card data-ocid="admin.lampiran.empty_state">
                    <CardContent className="py-12 text-center">
                      <Paperclip className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Belum ada lampiran yang diunggah
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  (() => {
                    const grouped: Record<string, typeof allLampiran> = {};
                    for (const l of allLampiran) {
                      if (!grouped[l.kategoriKegiatan])
                        grouped[l.kategoriKegiatan] = [];
                      grouped[l.kategoriKegiatan].push(l);
                    }
                    return Object.entries(grouped).map(
                      ([kategori, items], gi) => (
                        <Card key={kategori} className="border-border">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-primary" />
                              {kategori}
                              <Badge variant="secondary">{items.length}</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nama File</TableHead>
                                  <TableHead>Pemilik</TableHead>
                                  <TableHead>Tanggal Upload</TableHead>
                                  <TableHead className="text-right">
                                    Aksi
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {items.map((l, idx) => (
                                  <TableRow
                                    key={l.id}
                                    data-ocid={`admin.lampiran.item.${gi * 100 + idx + 1}`}
                                  >
                                    <TableCell className="font-medium">
                                      {l.namaFile}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      ...{l.owner.toString().slice(-8)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {formatTanggalID(
                                        new Date(
                                          Number(
                                            l.uploadedAt / BigInt(1_000_000),
                                          ),
                                        ),
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          if (l.blob) {
                                            window.open(
                                              ExternalBlob.fromURL(
                                                l.blob.getDirectURL(),
                                              ).getDirectURL(),
                                              "_blank",
                                            );
                                          }
                                        }}
                                        disabled={!l.blob}
                                        data-ocid="admin.lampiran.button"
                                      >
                                        <FileDown className="h-3 w-3 mr-1" />
                                        Unduh
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ),
                    );
                  })()
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Penilaian Dialog */}
      {penilaianDialog.kr && (
        <PenilaianForm
          open={penilaianDialog.open}
          onOpenChange={(open) =>
            setPenilaianDialog((prev) => ({ ...prev, open }))
          }
          kwartirRanting={penilaianDialog.kr}
          existingPenilaian={penilaianDialog.existing}
        />
      )}
    </div>
  );
}
