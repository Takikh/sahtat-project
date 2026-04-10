import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface MapProjectInput {
  id: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  name: string;
}

type Props = {
  projects: MapProjectInput[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
};

const cityFallbackCoordinates: Record<string, { lat: number; lng: number }> = {
  medea: { lat: 36.2642, lng: 2.7539 },
  alger: { lat: 36.7529, lng: 3.042 },
  oran: { lat: 35.6969, lng: -0.6331 },
  blida: { lat: 36.4754, lng: 2.8289 },
  tipaza: { lat: 36.5897, lng: 2.4475 },
};

function normalizeCityKey(city: string) {
  return city.toLowerCase().trim();
}

export function ProjectCityMap({ projects, selectedCity, onSelectCity }: Props) {
  const { t } = useTranslation();

  const grouped = Object.entries(
    projects.reduce<Record<string, { count: number; lat: number | null; lng: number | null }>>((acc, p) => {
      const key = p.city;
      const fallback = cityFallbackCoordinates[normalizeCityKey(p.city)];
      const lat = p.latitude ?? fallback?.lat ?? null;
      const lng = p.longitude ?? fallback?.lng ?? null;

      if (!acc[key]) {
        acc[key] = { count: 1, lat, lng };
      } else {
        acc[key].count += 1;
        if (acc[key].lat === null && lat !== null) acc[key].lat = lat;
        if (acc[key].lng === null && lng !== null) acc[key].lng = lng;
      }
      return acc;
    }, {}),
  )
    .map(([city, value]) => ({ city, ...value }))
    .sort((a, b) => b.count - a.count);

  const points = grouped.filter((city) => city.lat !== null && city.lng !== null);

  const latValues = points.map((point) => point.lat as number);
  const lngValues = points.map((point) => point.lng as number);
  const minLat = latValues.length > 0 ? Math.min(...latValues) : 0;
  const maxLat = latValues.length > 0 ? Math.max(...latValues) : 1;
  const minLng = lngValues.length > 0 ? Math.min(...lngValues) : 0;
  const maxLng = lngValues.length > 0 ? Math.max(...lngValues) : 1;

  const latRange = Math.max(maxLat - minLat, 0.05);
  const lngRange = Math.max(maxLng - minLng, 0.05);

  const toMapPosition = (lat: number, lng: number) => {
    const x = ((lng - minLng) / lngRange) * 100;
    const y = 100 - ((lat - minLat) / latRange) * 100;
    return {
      left: `${Math.min(94, Math.max(6, x))}%`,
      top: `${Math.min(88, Math.max(12, y))}%`,
    };
  };

  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/15 via-secondary to-accent/10">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "22px 22px" }} />
        <div className="absolute inset-0">
          {points.map((point) => {
            const pos = toMapPosition(point.lat as number, point.lng as number);
            const active = selectedCity === point.city;
            return (
              <button
                key={point.city}
                type="button"
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-xs font-semibold shadow-sm transition ${active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background/90 hover:border-accent"}`}
                style={pos}
                onClick={() => onSelectCity(point.city)}
              >
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {point.city} ({point.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${selectedCity === "All" ? "border-accent bg-accent/10" : "border-border hover:border-accent/60"}`}
          onClick={() => onSelectCity("All")}
        >
          {t("projects.filterAll")}
        </button>
        {grouped.map((city) => (
          <button
            key={city.city}
            type="button"
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${selectedCity === city.city ? "border-accent bg-accent/10" : "border-border hover:border-accent/60"}`}
            onClick={() => onSelectCity(city.city)}
          >
            <span className="font-medium">{city.city}</span>
            <span className="ms-2 text-muted-foreground">{city.count} {t("projects.results", "projects found")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
