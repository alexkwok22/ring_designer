"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapBounds } from "@/types/design";

interface Props {
  bounds: MapBounds;
  bearing: number;
  onBoundsChange: (bounds: MapBounds, bearing: number) => void;
}

export default function MapSelector({ bounds, bearing, onBoundsChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);

  const updateBounds = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map: any) => {
      if (isUpdatingRef.current) return;
      const b = map.getBounds();
      onBoundsChange(
        {
          north: b.getNorth(),
          east: b.getEast(),
          south: b.getSouth(),
          west: b.getWest(),
        },
        bearing
      );
    },
    [bearing, onBoundsChange]
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;
      // Fix default icon paths for Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const centerLat = (bounds.north + bounds.south) / 2;
      const centerLng = (bounds.east + bounds.west) / 2;

      const map = L.map(mapRef.current!, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      map.on("moveend zoomend", () => updateBounds(map));

      mapInstanceRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync map view when bounds change externally (e.g. from URL)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const currentCenter = map.getCenter();
    const desiredCenter = {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2,
    };
    const dist = Math.abs(currentCenter.lat - desiredCenter.lat) + Math.abs(currentCenter.lng - desiredCenter.lng);
    if (dist > 0.001) {
      isUpdatingRef.current = true;
      map.setView([desiredCenter.lat, desiredCenter.lng], map.getZoom(), { animate: false });
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [bounds]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Pan and zoom to choose the engraving area</span>
        <span className="font-mono">
          {((bounds.north + bounds.south) / 2).toFixed(4)}°,{" "}
          {((bounds.east + bounds.west) / 2).toFixed(4)}°
        </span>
      </div>
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        style={{ height: 320 }}
        aria-label="Map area selector"
      />
      {/* Overlay reticle */}
      <div className="relative" style={{ marginTop: -328, height: 320, pointerEvents: "none", zIndex: 500 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-36 border-2 border-white/70 rounded-md shadow-lg" />
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">
        The outlined area will be engraved on your ring
      </p>
    </div>
  );
}
