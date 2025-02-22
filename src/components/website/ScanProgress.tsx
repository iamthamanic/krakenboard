
import { Progress } from "@/components/ui/progress";
import { ScanProgress as ScanProgressType } from "@/services/types/scanner.types";

interface ScanProgressProps {
  progress: ScanProgressType;
  t: any;
}

export const ScanProgress = ({ progress, t }: ScanProgressProps) => {
  return (
    <div className="space-y-2">
      <Progress value={(progress.scannedPages / progress.totalPages) * 100} />
      <div className="text-sm text-muted-foreground">
        <p>{t.scanning} {progress.currentUrl}</p>
        <p>{progress.scannedPages} {t.page} {progress.totalPages}</p>
        <p>{progress.estimatedTimeRemaining}</p>
      </div>
    </div>
  );
};
