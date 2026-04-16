"use client";

import { useEffect, useRef } from "react";
import type { Event } from "@/types";

interface EventMapProps {
  events: Event[];
  selectedId: string | null;
  onSelect: (event: Event) => void;
}

export default function EventMap({ events, selectedId, onSelect }: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<Map<string, unknown>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;

      // Custom marker icon
      const createIcon = (active: boolean) =>
        L.divIcon({
          className: "",
          html: `
            <div style="
              width: 32px; height: 32px;
              background: ${active ? "var(--violet)" : "var(--bg-overlay)"};
              border: 2px solid ${active ? "rgba(139,92,246,0.8)" : "var(--border-default)"};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(0,0,0,0.4), ${active ? "0 0 16px rgba(139,92,246,0.5)" : ""};
              transition: all 200ms ease;
            ">
              <div style="
                position: absolute; inset: 0;
                display: flex; align-items: center; justify-content: center;
                transform: rotate(45deg);
                font-size: 12px;
              ">⚡</div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -36],
        });

      // Add markers
      events.forEach((event) => {
        if (!event.lat || !event.lng) return;

        const marker = L.marker([event.lat, event.lng], {
          icon: createIcon(event.id === selectedId),
        }).addTo(map);

        marker.on("click", () => onSelect(event));
        markersRef.current.set(event.id, marker);
      });

      // Fit bounds if events exist
      const validEvents = events.filter((e) => e.lat && e.lng);
      if (validEvents.length > 0) {
        const bounds = L.latLngBounds(
          validEvents.map((e) => [e.lat!, e.lng!] as [number, number])
        );
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });
      }
    });

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker icons when selection changes
  useEffect(() => {
    import("leaflet").then((L) => {
      markersRef.current.forEach((marker, id) => {
        const active = id === selectedId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker as any).setIcon(
          L.divIcon({
            className: "",
            html: `
              <div style="
                width: 32px; height: 32px;
                background: ${active ? "var(--violet)" : "var(--bg-overlay)"};
                border: 2px solid ${active ? "rgba(139,92,246,0.8)" : "var(--border-default)"};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 12px rgba(0,0,0,0.4), ${active ? "0 0 16px rgba(139,92,246,0.5)" : ""};
              ">
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);font-size:12px;">⚡</div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          })
        );
      });
    });
  }, [selectedId]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
}
