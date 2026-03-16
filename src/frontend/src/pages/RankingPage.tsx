import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Trophy } from "lucide-react";
import { useActor } from "../hooks/useActor";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function RankingPage() {
  const { actor, isFetching } = useActor();

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["allSortedByScore"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSortedByScore();
    },
    enabled: !!actor && !isFetching,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">
          Ranking Kwartir Ranting
        </h1>
        <p className="text-muted-foreground">
          Daftar peringkat seluruh Kwartir Ranting Kwarcab Subang
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" /> Papan Peringkat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="penilaian.loading_state">
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
            </div>
          ) : (rankings || []).length === 0 ? (
            <div className="p-12 text-center" data-ocid="penilaian.empty_state">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Belum ada data ranking tersedia
              </p>
            </div>
          ) : (
            <Table data-ocid="ranking.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Nama Kwartir Ranting</TableHead>
                  <TableHead>Nama Ketua</TableHead>
                  <TableHead className="text-right">Skor Profil</TableHead>
                  <TableHead className="text-right">Skor Potensi</TableHead>
                  <TableHead className="text-right">Skor Kegiatan</TableHead>
                  <TableHead className="text-right">Total Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rankings || []).map(([kr, penilaian], idx) => (
                  <TableRow
                    key={kr.owner.toString()}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    data-ocid={`ranking.row.${idx + 1}`}
                  >
                    <TableCell className="font-medium">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          idx === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : idx === 1
                              ? "bg-gray-100 text-gray-600"
                              : idx === 2
                                ? "bg-amber-100 text-amber-700"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {idx + 1}
                      </span>
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
                    <TableCell className="text-muted-foreground">
                      {kr.namaKetua}
                    </TableCell>
                    <TableCell className="text-right">
                      {penilaian ? penilaian.skorProfil : "–"}
                    </TableCell>
                    <TableCell className="text-right">
                      {penilaian ? penilaian.skorPotensi : "–"}
                    </TableCell>
                    <TableCell className="text-right">
                      {penilaian ? penilaian.skorKegiatan : "–"}
                    </TableCell>
                    <TableCell className="text-right">
                      {penilaian ? (
                        <Badge className="font-bold">
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
  );
}
