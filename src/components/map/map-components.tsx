"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { useIncidents } from "@/context/incidents-context";
import { formatDistanceToNow } from "date-fns";

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
    className: "custom-div-icon",
    html: `
      <div style="
        background-color: rgba(50, 50, 50, 0.7); 
        border: 2px solid #666; 
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 16px;"
      >
        ${emoji}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
};

export default function MapComponents() {
  const { incidents, loading, error } = useIncidents();
  const center = [35.3075, -80.7331];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading incidents data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        Error loading incidents: {error}
      </div>
    );
  }

  const mappableIncidents = incidents
    .filter((incident) => incident.lat && incident.lng)
    .slice(0, 50);

  return (
    <MapContainer
      center={[center[0], center[1]]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      className="z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution=""
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {mappableIncidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat!, incident.lng!]}
          icon={createCustomIcon(incident.incident_type)}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium text-sm">{incident.incident_type}</h3>
              <p className="text-xs text-muted-foreground">
                {incident.incident_location}
              </p>
              <p className="text-xs mt-1">
                {formatDate(incident.time_reported)}
              </p>
              {incident.incident_description && (
                <p className="text-xs mt-1 max-w-64 truncate">
                  {incident.incident_description}
                </p>
              )}
              <div className="mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20">
                  {incidentEmojis[incident.incident_type] ||
                    incidentEmojis.Default}{" "}
                  {incident.disposition || "Open"}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
