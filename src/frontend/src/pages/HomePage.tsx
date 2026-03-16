import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Loader2,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function HomePage() {
  const { actor, isFetching } = useActor();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [namaKwr, setNamaKwr] = useState("");
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["allSortedByScore"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSortedByScore();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: userRole } = useQuery({
    queryKey: ["userRole", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isLoggedIn) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  const isAdmin = userRole === UserRole.admin;
  const isNonAdminUser = isLoggedIn && !isAdmin;

  const top5 = (rankings || []).slice(0, 5);

  const handleDaftarAdminPembantu = async () => {
    if (!actor || !namaKwr.trim()) return;
    setIsSubmittingAdmin(true);
    try {
      await actor.addAdminPembantu(namaKwr.trim());
      toast.success("Pendaftaran berhasil! Menunggu persetujuan admin.");
      setAdminDialogOpen(false);
      setNamaKwr("");
    } catch (e) {
      toast.error(`Gagal mendaftar: ${e}`);
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-primary text-primary-foreground py-20 px-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.13 145) 0%, oklch(0.42 0.13 145) 50%, oklch(0.5 0.15 150) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, oklch(0.8 0.15 80) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.7 0.1 160) 0%, transparent 50%)",
          }}
        />
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <Star className="h-4 w-4 fill-current" />
            Program Giat Kwartir Ranting
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Penilaian Kwartir Ranting
          </h1>
          <p className="text-lg md:text-xl opacity-85 mb-8 max-w-2xl mx-auto">
            Program Giat Kwartir Ranting Kwarcab Subang — Platform Penilaian
            Resmi
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Link to="/ranking" data-ocid="home.lihat_ranking.button">
                <Trophy className="h-4 w-4 mr-2" /> Lihat Semua Ranking
              </Link>
            </Button>
            {isLoggedIn ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10"
              >
                <Link to="/form" data-ocid="home.mulai_penilaian.button">
                  Mulai Penilaian
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="home.mulai_penilaian.button"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Masuk untuk Mulai
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-b py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Trophy,
                label: "Total KR Terdaftar",
                value: rankings?.length ?? "–",
              },
              {
                icon: Award,
                label: "KR Dinilai",
                value: rankings?.filter(([, p]) => p !== null).length ?? "–",
              },
              { icon: Users, label: "Kwarcab", value: "Subang" },
              { icon: Star, label: "Program", value: "Giat KR" },
            ].map(({ icon: Icon, label, value }) => (
              <Card key={label} className="text-center">
                <CardContent className="pt-4 pb-4">
                  <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">
                    {String(value)}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top 5 Ranking */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Top 5 Ranking
              </h2>
              <p className="text-muted-foreground text-sm">
                Kwartir Ranting dengan nilai tertinggi
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/ranking" data-ocid="home.lihat_ranking.button">
                Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div
                  className="p-6 space-y-3"
                  data-ocid="penilaian.loading_state"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : top5.length === 0 ? (
                <div
                  className="p-12 text-center"
                  data-ocid="penilaian.empty_state"
                >
                  <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Belum ada data ranking
                  </p>
                </div>
              ) : (
                <Table data-ocid="home.ranking.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Peringkat</TableHead>
                      <TableHead>Nama Kwartir Ranting</TableHead>
                      <TableHead className="text-right">Total Skor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {top5.map(([kr, penilaian], idx) => (
                      <TableRow
                        key={kr.owner.toString()}
                        className="cursor-pointer hover:bg-accent/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {idx < 3 ? (
                              <Trophy
                                className={`h-4 w-4 ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : "text-amber-600"}`}
                              />
                            ) : null}
                            <span className="font-semibold">{idx + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            to="/detail/$ownerId"
                            params={{ ownerId: kr.owner.toString() }}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {kr.namaKwartirRanting}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          {penilaian ? (
                            <Badge variant="secondary" className="font-bold">
                              {penilaian.skorTotal}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Belum dinilai
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Admin Pembantu */}
      {isNonAdminUser && (
        <section className="py-8 px-4 bg-muted/50">
          <div className="container mx-auto">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Ingin Membantu?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Daftarkan diri Anda sebagai Admin Pembantu untuk membantu
                  proses penilaian Kwartir Ranting.
                </p>
                <Button
                  onClick={() => setAdminDialogOpen(true)}
                  data-ocid="home.daftar_admin_pembantu.button"
                >
                  Daftar sebagai Admin Pembantu
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Admin Pembantu Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent data-ocid="home.admin_pembantu.dialog">
          <DialogHeader>
            <DialogTitle>Daftar Admin Pembantu</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Nama Kwartir Ranting Anda</Label>
            <Input
              value={namaKwr}
              onChange={(e) => setNamaKwr(e.target.value)}
              placeholder="Masukkan nama KR"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleDaftarAdminPembantu}
              disabled={isSubmittingAdmin || !namaKwr.trim()}
            >
              {isSubmittingAdmin && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Daftar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
