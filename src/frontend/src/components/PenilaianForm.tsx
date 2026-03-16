import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Principal } from "@icp-sdk/core/principal";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { KwartirRanting, Penilaian } from "../backend";
import { useActor } from "../hooks/useActor";

interface PenilaianFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kwartirRanting: KwartirRanting;
  existingPenilaian?: Penilaian | null;
}

export default function PenilaianForm({
  open,
  onOpenChange,
  kwartirRanting,
  existingPenilaian,
}: PenilaianFormProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [skorProfil, setSkorProfil] = useState(0);
  const [skorPotensi, setSkorPotensi] = useState(0);
  const [skorKegiatan, setSkorKegiatan] = useState(0);

  useEffect(() => {
    if (existingPenilaian) {
      setNamaKegiatan(existingPenilaian.namaKegiatan);
      setSkorProfil(existingPenilaian.skorProfil);
      setSkorPotensi(existingPenilaian.skorPotensi);
      setSkorKegiatan(existingPenilaian.skorKegiatan);
    } else {
      setNamaKegiatan("");
      setSkorProfil(0);
      setSkorPotensi(0);
      setSkorKegiatan(0);
    }
  }, [existingPenilaian]);

  const skorTotal = skorProfil + skorPotensi + skorKegiatan;

  const handleSubmit = async () => {
    if (!actor) return;
    setIsSubmitting(true);
    try {
      await actor.createOrUpdatePenilaian({
        namaKegiatan,
        skorProfil,
        skorPotensi,
        skorKegiatan,
        skorTotal,
        kwartirRantingOwner: kwartirRanting.owner as Principal,
      });
      toast.success("Penilaian berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: ["allSortedByScore"] });
      queryClient.invalidateQueries({ queryKey: ["allKwartirRanting"] });
      queryClient.invalidateQueries({ queryKey: ["penilaian"] });
      onOpenChange(false);
    } catch (e) {
      toast.error(`Gagal menyimpan: ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Penilaian: {kwartirRanting.namaKwartirRanting}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Nama Kegiatan</Label>
            <Input
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              placeholder="Nama kegiatan penilaian"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Skor Profil</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={skorProfil}
                onChange={(e) => setSkorProfil(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label>Skor Potensi</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={skorPotensi}
                onChange={(e) => setSkorPotensi(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label>Skor Kegiatan</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={skorKegiatan}
                onChange={(e) => setSkorKegiatan(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Total Skor</p>
            <p className="text-2xl font-bold text-primary">{skorTotal}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="penilaian.cancel_button"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            data-ocid="penilaian.submit_button"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Penilaian
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
