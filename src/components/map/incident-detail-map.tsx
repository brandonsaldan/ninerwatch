"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Incident } from "@/lib/supabase";

const IncidentDetailMapComponentWithNoSSR = dynamic(
  () => import("@/components/map/incident-map-component"),
  { ssr: false }
);

export function IncidentDetailMap({ incident }: { incident: Incident }) {
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

  return <IncidentDetailMapComponentWithNoSSR incident={incident} />;
}
