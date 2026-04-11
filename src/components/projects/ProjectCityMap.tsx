import { MapPin } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { LatLngExpression } from "leaflet";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";

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
  mede: { lat: 36.2642, lng: 2.7539 },
  "medea centre": { lat: 36.2642, lng: 2.7539 },
  alger: { lat: 36.7529, lng: 3.042 },
  algerie: { lat: 36.7529, lng: 3.042 },
  algiers: { lat: 36.7529, lng: 3.042 },
  oran: { lat: 35.6969, lng: -0.6331 },
  blida: { lat: 36.4754, lng: 2.8289 },
  tipaza: { lat: 36.5897, lng: 2.4475 },
};

function normalizeCityKey(city: string) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

type MapPoint = {
  city: string;
  count: number;
  lat: number;
  lng: number;
};

function MapViewportController({ points, selectedCity }: { points: MapPoint[]; selectedCity: string }) {
  const map = useMap();

  useEffect(() => {
    const selectedPoint = points.find((point) => point.city === selectedCity);
    if (selectedPoint) {
      map.flyTo([selectedPoint.lat, selectedPoint.lng], 10, { duration: 0.7 });
      return;
    }

    if (points.length > 1) {
      map.fitBounds(
        points.map((point) => [point.lat, point.lng] as [number, number]),
        { padding: [30, 30] },
      );
    }
  }, [map, points, selectedCity]);

  return null;
}

export function ProjectCityMap({ projects, selectedCity, onSelectCity }: Props) {
  const { t } = useTranslation();

  const grouped = useMemo(
    () =>
      Object.entries(
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
        .sort((a, b) => b.count - a.count),
    [projects],
  );

  const points = grouped.filter((city): city is MapPoint => city.lat !== null && city.lng !== null);

  const defaultCenter: LatLngExpression = points.length > 0
    ? [points[0].lat, points[0].lng]
    : [36.2642, 2.7539];

  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative min-h-[320px] overflow-hidden rounded-xl border border-border">
        <MapContainer center={defaultCenter} zoom={7} className="h-[320px] w-full" scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewportController points={points} selectedCity={selectedCity} />
          {points.map((point) => {
            const active = selectedCity === point.city;
            return (
              <CircleMarker
                key={point.city}
                center={[point.lat, point.lng]}
                radius={active ? 11 : 8}
                pathOptions={{
                  color: active ? "#fb923c" : "#2563eb",
                  fillColor: active ? "#f97316" : "#3b82f6",
                  fillOpacity: 0.85,
                  weight: active ? 3 : 2,
                }}
                eventHandlers={{ click: () => onSelectCity(point.city) }}
              >
                <Popup>
                  <div className="text-xs font-medium">
                    {point.city} ({point.count})
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
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
            <span className="inline-flex items-center gap-1 font-medium"><MapPin className="h-3.5 w-3.5" />{city.city}</span>
            <span className="ms-2 text-muted-foreground">{city.count} {t("projects.results", "projects found")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
