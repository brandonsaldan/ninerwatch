"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapComponentsWithNoSSR = dynamic(() => import("./map-components"), {
  ssr: false,
});

export function CampusMap({ incidentId }: { incidentId?: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="aspect-video bg-muted rounded-md flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return <MapComponentsWithNoSSR incidentId={incidentId} />;
}
