"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { useIncidents } from "@/context/incidents-context";
import { formatDistanceToNow } from "date-fns";
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

const getBadgeColor = (type: string) => {
  const typeToColor: Record<string, string> = {
    Larceny: "bg-yellow-500/10 text-yellow-500",
    Theft: "bg-yellow-500/10 text-yellow-500",
    "Lost or Stolen": "bg-purple-500/10 text-purple-500",
    Fraud: "bg-yellow-500/10 text-yellow-500",

    "Accident/Property": "bg-orange-500/10 text-orange-500",
    "Vehicle Accident": "bg-orange-500/10 text-orange-500",
    "Hit and Run": "bg-orange-500/10 text-orange-500",
    "Hit and Run/Property": "bg-orange-500/10 text-orange-500",
    "Disabled Vehicle": "bg-orange-500/10 text-orange-500",
    "Vehicle Lockout": "bg-orange-500/10 text-orange-500",
    "Traffic Stop": "bg-orange-500/10 text-orange-500",
    Crash: "bg-orange-500/10 text-orange-500",
    "Parking Violation": "bg-orange-300/10 text-orange-300",
    "Illegal Parking": "bg-orange-300/10 text-orange-300",

    "Suspicious Person": "bg-blue-500/10 text-blue-500",
    "Suspicious Vehicle": "bg-blue-500/10 text-blue-500",
    Investigate: "bg-blue-500/10 text-blue-500",
    "Follow Up": "bg-blue-400/10 text-blue-400",
    BOLO: "bg-blue-600/10 text-blue-600",
    Loitering: "bg-blue-300/10 text-blue-300",
    "Loitering/Trespassing": "bg-blue-300/10 text-blue-300",

    "Damage to Property": "bg-red-500/10 text-red-500",
    Vandalism: "bg-red-500/10 text-red-500",

    "Welfare Check": "bg-green-500/10 text-green-500",
    "Injured/Ill Subject": "bg-green-500/10 text-green-500",
    "Injured Subject": "bg-green-500/10 text-green-500",
    Suicide: "bg-green-600/10 text-green-600",
    "Suicide Ideation": "bg-green-600/10 text-green-600",
    "Intoxicated Person": "bg-green-400/10 text-green-400",

    "Elevator Call": "bg-cyan-500/10 text-cyan-500",
    "Disabled Elevator": "bg-cyan-500/10 text-cyan-500",
    "Elevator Entrapment": "bg-cyan-500/10 text-cyan-500",
    "Commercial Alarm": "bg-cyan-400/10 text-cyan-400",
    "Panic Alarm": "bg-cyan-400/10 text-cyan-400",
    "Utilities Outage": "bg-cyan-600/10 text-cyan-600",

    "Assist Other Agency": "bg-indigo-500/10 text-indigo-500",
    "Assist CMPD": "bg-indigo-500/10 text-indigo-500",
    Escort: "bg-indigo-400/10 text-indigo-400",
    "Serving Papers": "bg-indigo-400/10 text-indigo-400",
    "911 Hang Up": "bg-indigo-300/10 text-indigo-300",

    "Verbal Confrontation": "bg-pink-500/10 text-pink-500",
    Harassment: "bg-pink-500/10 text-pink-500",
    Assault: "bg-pink-600/10 text-pink-600",
    "Indecent Exposure": "bg-pink-400/10 text-pink-400",

    "Drug Related": "bg-rose-500/10 text-rose-500",
    Drug: "bg-rose-500/10 text-rose-500",
    "Missing Person": "bg-rose-400/10 text-rose-400",
    "Animal Control": "bg-rose-300/10 text-rose-300",
    Noise: "bg-rose-300/10 text-rose-300",
  };

  return typeToColor[type] || "bg-gray-500/10 text-gray-500";
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

  const incidentsWithCoords = incidents
    .filter((incident) => incident.lat && incident.lng)
    .slice(0, 25);

  const locationGroups: Record<string, Incident[]> = {};

  incidentsWithCoords.forEach((incident) => {
    const key = `${incident.lat!.toFixed(5)},${incident.lng!.toFixed(5)}`;

    if (!locationGroups[key]) {
      locationGroups[key] = [];
    }

    locationGroups[key].push(incident);
  });

  const adjustMarkerPosition = (
    incident: Incident,
    index: number,
    total: number
  ): [number, number] => {
    if (total <= 1) {
      return [incident.lat!, incident.lng!];
    }

    const OFFSET_RADIUS = 0.0004;
    const angle = (index / total) * 2 * Math.PI;
    const offsetLat = incident.lat! + OFFSET_RADIUS * Math.cos(angle);
    const offsetLng = incident.lng! + OFFSET_RADIUS * Math.sin(angle);

    return [offsetLat, offsetLng];
  };

  return (
    <MapContainer
      center={[center[0], center[1]] as [number, number]}
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

      {Object.entries(locationGroups).map(([_, groupedIncidents]) =>
        groupedIncidents.map((incident, index) => {
          const [adjustedLat, adjustedLng] = adjustMarkerPosition(
            incident,
            index,
            groupedIncidents.length
          );

          return (
            <Marker
              key={incident.id}
              position={[adjustedLat, adjustedLng]}
              icon={createCustomIcon(incident.incident_type)}
            >
              <Popup className="custom-popup">
                <div className="rounded-md bg-card border border-border shadow-lg p-4 max-w-xs space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span
                      className={`${getBadgeColor(
                        incident.incident_type
                      )} text-sm px-2 py-1 rounded-full whitespace-nowrap`}
                    >
                      {incidentEmojis[incident.incident_type] ||
                        incidentEmojis.Default}{" "}
                      {incident.incident_type}
                    </span>
                  </div>

                  <div className="text-sm text-white text-muted-foreground">
                    {incident.incident_location}
                  </div>

                  {incident.incident_description && (
                    <div className="text-sm text-muted-foreground line-clamp-2 overflow-hidden">
                      {incident.incident_description}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground border-t border-border">
                    <div>{formatDate(incident.time_reported)}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50">
                      {incident.disposition || "Open"}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })
      )}
    </MapContainer>
  );
}
