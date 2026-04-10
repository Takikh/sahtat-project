import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAreaRange, formatPriceRange } from "@/lib/projectContent";
import { useTranslation } from "react-i18next";

export interface CompareProjectRow {
  id: string;
  name: string;
  location: string | null;
  city: string;
  status: string;
  price_min_dzd: number | null;
  price_max_dzd: number | null;
  area_min_m2: number | null;
  area_max_m2: number | null;
  units_left: number | null;
  delivery_date: string | null;
}

type Props = {
  selected: CompareProjectRow[];
  locale: string;
  onClear: () => void;
};

export function ProjectCompareDialog({ selected, locale, onClear }: Props) {
  const { t } = useTranslation();

  if (selected.length < 2) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          {t("projects.compare", "Compare")} {selected.length}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("projects.compare", "Compare")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          {selected.map((project) => (
            <Badge key={project.id} variant="secondary">{project.name}</Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClear}>{t("projects.compareClear", "Clear selection")}</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("projects.compareMetric", "Metric")}</TableHead>
              {selected.map((project) => (
                <TableHead key={project.id}>{project.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{t("projects.location")}</TableCell>
              {selected.map((project) => (
                <TableCell key={`${project.id}-location`}>{project.location || project.city}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t("projects.filterStatus", "Status")}</TableCell>
              {selected.map((project) => (
                <TableCell key={`${project.id}-status`}>{project.status}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t("projects.comparePriceRange", "Price range")}</TableCell>
              {selected.map((project) => (
                <TableCell key={`${project.id}-price`}>{formatPriceRange(project.price_min_dzd, project.price_max_dzd, locale) || "N/A"}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t("projects.compareAreaRange", "Area range")}</TableCell>
              {selected.map((project) => (
                <TableCell key={`${project.id}-area`}>{formatAreaRange(project.area_min_m2, project.area_max_m2, locale) || "N/A"}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t("projects.compareUnitsLeft", "Units left")}</TableCell>
              {selected.map((project) => (
                <TableCell key={`${project.id}-units`}>{project.units_left ?? "N/A"}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t("projects.compareDeliveryDate", "Delivery date")}</TableCell>
              {selected.map((project) => (
                <TableCell key={`${project.id}-delivery`}>{project.delivery_date || "N/A"}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
