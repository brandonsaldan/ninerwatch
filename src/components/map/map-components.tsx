"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

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
  Theft: "💰",
  Accident: "💥",
  Report: "📋",
  Vandalism: "🔨",
  "Lost Item": "🔎",

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

const incidents = [
  {
    id: 1,
    title: "Theft Report",
    location: "Student Union",
    type: "Theft",
    lat: 35.308,
    lng: -80.733,
    time: "Today, 2:30 PM",
  },
  {
    id: 2,
    title: "Traffic Accident",
    location: "East Deck 1",
    type: "Accident",
    lat: 35.307,
    lng: -80.731,
    time: "Today, 11:15 AM",
  },
  {
    id: 3,
    title: "Suspicious Activity",
    location: "Fretwell Building",
    type: "Suspicious Person",
    lat: 35.306,
    lng: -80.735,
    time: "Yesterday, 8:45 PM",
  },
  {
    id: 4,
    title: "Vandalism",
    location: "South Village Deck",
    type: "Damage to Property",
    lat: 35.305,
    lng: -80.736,
    time: "Yesterday, 4:15 PM",
  },
  {
    id: 5,
    title: "Lost Property",
    location: "Atkins Library",
    type: "Lost or Stolen",
    lat: 35.309,
    lng: -80.732,
    time: "2 days ago, 3:30 PM",
  },
];

export default function MapComponents() {
  const center = [35.3075, -80.7331];

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

      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={createCustomIcon(incident.type)}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium text-sm">{incident.title}</h3>
              <p className="text-xs text-muted-foreground">
                {incident.location}
              </p>
              <p className="text-xs mt-1">{incident.time}</p>
              <div className="mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20">
                  {incidentEmojis[incident.type] || incidentEmojis.Default}{" "}
                  {incident.type}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
