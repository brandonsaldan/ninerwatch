"use client";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { Incident } from "@/lib/supabase";

const incidentEmojis: Record<string, string> = {
  Investigate: "🔍",
  "Suspicious Person": "👤",
  "Accident/Property": "💥",
  Larceny: "💰",
  "Welfare Check": "🏥",
  "Injured/Ill Subject": "🤕",
  "Serving Papers": "📄",
  "Suspicious Vehicle": "🚗",
  "Follow Up": "📝",
  "Assist Other Agency": "🤝",
  "Hit and Run": "🚙",
  "Elevator Call": "🛗",
  "Commercial Alarm": "🚨",
  Harassment: "😠",
  "Disabled Vehicle": "🚘",
  Escort: "👮",
  "Damage to Property": "🏚️",
  "Lost or Stolen": "🔎",
  "Hit and Run/Property": "💥",
  "Loitering/Trespassing": "⛔",
  "Vehicle Accident": "🚗",
  "Drug Related": "💊",
  Loitering: "🚷",
  "Verbal Confrontation": "🗣️",
  Noise: "📢",
  "Panic Alarm": "🆘",
  "Parking Violation": "🅿️",
  "Injured Subject": "🤕",
  "911 Hang Up": "📞",
  "Intoxicated Person": "🍺",
  "Missing Person": "❓",
  BOLO: "👁️",
  "Disabled Elevator": "🛗",
  "Animal Control": "🐕",
  "Utilities Outage": "💡",
  "Vehicle Lockout": "🔑",
  "Elevator Entrapment": "⚠️",
  "Traffic Stop": "🛑",
  Suicide: "💔",
  "Suicide Ideation": "💭",
  Fraud: "💳",
  "Illegal Parking": "🚫",
  "Indecent Exposure": "🙈",
  Crash: "💥",
  Assault: "👊",
  "Assist CMPD": "🚔",
  Default: "❗",
};

const createCustomIcon = (type: string) => {
  const emoji = incidentEmojis[type] || incidentEmojis.Default;

  return L.divIcon({
    className: "custom-div-icon-highlight",
    html: `
      <div style="
        background-color: rgba(50, 50, 50, 0.7); 
        border: 3px solid #323232; 
        width: 40px; 
        height: 40px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 20px;
        box-shadow: 0 0 10px rgba(110, 110, 110, 0.8);"
      >
        ${emoji}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export default function IncidentDetailMapComponent({
  incident,
}: {
  incident: Incident;
}) {
  const coords =
    incident.lat && incident.lng
      ? [incident.lat, incident.lng]
      : [35.3075, -80.7331];

  return (
    <MapContainer
      center={coords as [number, number]}
      zoom={17}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      className="z-0"
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        attribution=""
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <Circle
        center={coords as [number, number]}
        radius={20}
        pathOptions={{
          color: "#323232",
          fillColor: "#323232",
          fillOpacity: 0.2,
        }}
      />

      <Marker
        position={coords as [number, number]}
        icon={createCustomIcon(incident.incident_type)}
      />
    </MapContainer>
  );
}
