"use client";

import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { Incident } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

const incidentEmojis: Record<string, string> = {
  Investigate: "🔍",
  "Suspicious Person": "👤",
  "Accident/Property": "💥",
  "Accident/Property Damage": "💥",
  Larceny: "💰",
  "Larceny of Bicycle": "💰",
  "Larceny of Laptop": "💰",
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
  "Vehicle Stop": "🛑",
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
    popupAnchor: [-70, -20],
  });
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Unknown time";
  }
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

  type TimelineEvent = {
    title: string;
    time: string;
    icon: string;
    backgroundColor: string;
    borderColor: string;
    content?: string;
  };

  const timelineEvents: TimelineEvent[] = [
    {
      title: "Reported",
      time: incident.time_reported,
      icon: "📝",
      backgroundColor: "rgba(239, 68, 68, 0.3)",
      borderColor: "rgba(239, 68, 68, 0.4)",
    },
  ];

  if (incident.time_of_occurrence) {
    timelineEvents.push({
      title: "Occurred",
      time: incident.time_of_occurrence,
      icon: "⚠️",
      backgroundColor: "rgba(245, 158, 11, 0.3)",
      borderColor: "rgba(245, 158, 11, 0.4)",
    });
  }

  if (incident.time_secured) {
    timelineEvents.push({
      title: "Secured",
      time: incident.time_secured,
      icon: "🔒",
      backgroundColor: "rgba(16, 185, 129, 0.3)",
      borderColor: "rgba(16, 185, 129, 0.4)",
    });
  }

  if (incident.disposition) {
    timelineEvents.push({
      title: "Status",
      time: incident.time_reported,
      content: incident.disposition,
      icon: "📋",
      backgroundColor: "rgba(99, 102, 241, 0.3)",
      borderColor: "rgba(99, 102, 241, 0.4)",
    });
  }

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
      >
        <Popup className="custom-popup">
          <div
            className="rounded-xl bg-black/80 border border-border shadow-lg p-4 backdrop-blur-md"
            style={{ width: "435px", maxWidth: "90vw" }}
          >
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#ff4b66]"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Incident Timeline
            </h3>

            <div className="relative">
              <div
                className="absolute h-0.5 bg-gray-700"
                style={{
                  left: timelineEvents.length > 1 ? "40px" : "0",
                  right: timelineEvents.length > 1 ? "40px" : "0",
                  top: "14px",
                }}
              ></div>

              <div className="flex justify-between items-start relative z-10">
                {timelineEvents.map((event, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center"
                    style={{ width: `${100 / timelineEvents.length}%` }}
                  >
                    <div
                      className="absolute h-7 w-7 rounded-full"
                      style={{
                        backgroundColor: "#000000",
                        top: "-1px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    ></div>

                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 z-10 relative"
                      style={{
                        backgroundColor: event.backgroundColor,
                        border: `2px solid ${event.borderColor}`,
                      }}
                    >
                      {event.icon}
                    </div>
                    <div className="mt-2 px-1">
                      <div className="text-sm font-medium text-white">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-400 break-words">
                        {event.content || formatDate(event.time)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
