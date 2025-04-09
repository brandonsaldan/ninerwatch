"use client";

import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { Incident } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

const incidentEmojis: Record<string, string> = {
  Larceny: "💰",
  "Larceny of Bicycle": "🚲",
  "Larceny of Laptop": "💻",
  "Larceny of Property": "📱",
  "Larceny of Vehicle": "🚗",
  "Larceny of Vehicle Parts": "🔧",
  "Larceny/Arrest": "💰",
  "Larceny/Property": "📱",
  "Larceny/Property Damage": "📱",
  "Larceny/Property Theft": "📱",
  "Larceny/Vehicle": "🚗",
  "Larceny/Vehicle Parts": "🔧",
  "Larceny/Vehicle Theft": "🚗",
  Theft: "💰",
  "Property Theft": "📱",
  "Property Theft/Arrest": "📱",
  Burglary: "🏠",
  "Burglary/Arrest": "🏠",
  "Burglary/Property": "🏠",
  "Burglary/Property Damage": "🏠",
  "Burglary/Property Theft": "🏠",
  "Burglary of Vehicle": "🚗",
  "Burglary of Vehicle Parts": "🔧",
  "Burglary/Vehicle": "🚗",
  "Burglary/Vehicle Parts": "🔧",
  "Burglary/Vehicle Theft": "🚗",
  "Stolen Vehicle": "🚗",
  "Stolen Vehicle Parts": "🔧",
  "Stolen Vehicle/Arrest": "🚗",
  "Stolen Vehicle Parts/Arrest": "🔧",
  "Stolen Vehicle/Property": "🚗",
  "Stolen Vehicle/Property Damage": "🚗",
  "Stolen Vehicle/Property Theft": "🚗",
  "Stolen Vehicle Parts/Property": "🔧",
  "Stolen Vehicle Parts/Property Damage": "🔧",
  "Stolen Vehicle Parts/Property Theft": "🔧",
  "Motor Vehicle Theft": "🚗",
  "Motor Vehicle Theft/Arrest": "🚗",
  "Reckless Driving": "🚗",
  Fraud: "💳",
  "Fraud/Arrest": "💳",
  "Identity Theft": "🪪",
  "Identity Theft/Arrest": "🪪",
  Robbery: "🔫",
  "Robbery/Attempted": "🔫",
  "Attempted Robbery": "🔫",
  "Robbery/Arrest": "🔫",
  "Robbery/Property": "🔫",
  "Robbery/Property Damage": "🔫",
  "Robbery/Property Theft": "🔫",
  "Robbery/Vehicle": "🔫",
  "Robbery/Vehicle Parts": "🔫",

  "Lost or Stolen": "🔎",
  "Lost Property": "🔎",
  "Property Found": "✅",
  "Missing/Found Person": "👥",
  "Missing/Found Subject": "👥",

  Accident: "💥",
  "Accident/Arrest": "💥",
  "Accident/Hit & Run": "🏃",
  "Accident/Hit and Run": "🏃",
  "Accident/Hit and Run/Property": "🏃",
  "Accident/Hit and Run/Property Damage": "🏃",
  "Accident/Personal Injury": "🤕",
  "Accident/Personal Injury/Property Damage": "🤕",
  "Accident/Property": "💥",
  "Accident/Property Damage": "💥",
  "Vehicle Accident": "🚗",
  "Hit & Run": "🏃",
  "Hit & Run/Arrest": "🏃",
  "Hit & Run/Property": "🏃",
  "Hit & Run/Property Damage": "🏃",
  "Hit and Run": "🏃",
  "Hit and Run/Arrest": "🏃",
  "Hit and Run/Property": "🏃",
  "Hit and Run/Property Damage": "🏃",
  Crash: "💥",
  "Disabled Vehicle": "🚘",
  "Vehicle Lockout": "🔑",
  "Traffic Stop": "🛑",
  "Traffic Violation": "🛑",
  "Vehicle Stop": "🛑",
  "Abandoned Vehicle": "🚙",
  "Parking Violation": "🅿️",
  "Parking Violation/Arrest": "🅿️",
  "Illegal Parking": "🚫",
  "Illegal Parking/Arrest": "🚫",

  "Suspicious Person": "👤",
  "Suspicious Person/Arrest": "👤",
  "Suspicious Person/Property": "👤",
  "Suspicious Person/Property Damage": "👤",
  "Suspicious Person/Property Theft": "👤",
  "Suspicious Vehicle": "🚗",
  "Suspicious Vehicle/Arrest": "🚗",
  "Suspicious Activity": "👀",
  "Suspicious Activity/Arrest": "👀",
  "Suspicious Activity/Property": "👀",
  "Suspicious Activity/Property Damage": "👀",
  "Suspicious Activity/Property Theft": "👀",
  Investigate: "🔍",
  "Investigate/Arrest": "🔍",
  "Investigate/Property": "🔍",
  "Investigate/Property Damage": "🔍",
  "Investigate/Property Theft": "🔍",
  "Investigate/Vehicle": "🔍",
  "Investigate/Vehicle Parts": "🔍",
  "Investigate/Vehicle Theft": "🔍",
  Investigation: "🔍",
  "Investigation/Arrest": "🔍",
  "Investigation/Property": "🔍",
  "Investigation/Property Damage": "🔍",
  "Investigation/Property Theft": "🔍",
  "Investigation/Vehicle": "🔍",
  "Investigation/Vehicle Parts": "🔍",
  "Investigation/Vehicle Theft": "🔍",
  "Follow Up": "📝",
  BOLO: "👁️",
  "Pedestrian Check": "🚶",
  Loitering: "🚷",
  "Loitering/Arrest": "🚷",
  "Loitering/Trespassing": "⛔",
  Trespassing: "⛔",
  "Criminal Trespass": "⛔",
  "Criminal Trespass/Arrest": "⛔",

  "Damage to Property": "🏚️",
  "Damage to Vehicle": "🚗",
  "Property Damage": "🏚️",
  "Property Damage/Arrest": "🏚️",
  "Criminal Damage": "🏚️",
  "Criminal Damage to Property": "🏚️",
  "Criminal Damage to Vehicle": "🚗",
  Vandalism: "🖌️",
  Arson: "🔥",

  "Welfare Check": "🏥",
  "Injured/Ill Subject": "🤕",
  "Injured Subject": "🤕",
  "Injured Person": "🤕",
  "Emergency Medical Call": "🚑",
  "Assist Medic": "🚑",
  Suicide: "💔",
  "Suicide Attempt": "💔",
  "Suicide Ideation": "💭",
  "Drug Overdose": "💊",
  Overdose: "💊",
  "Health and Safety": "🏥",
  "Intoxicated Person": "🍺",
  "Intoxicated Subject": "🍺",
  "Intoxicated/Disorderly": "🍺",
  "Intoxicated/Disorderly Person": "🍺",
  "Intoxicated/Disorderly Subject": "🍺",
  "Intoxicated/Disorderly Subject/Arrest": "🍺",

  "Elevator Call": "🛗",
  "Elevator Emergency": "🛗",
  "Elevator Emergency Call": "🛗",
  "Disabled Elevator": "🛗",
  "Elevator Entrapment": "⚠️",
  "Commercial Alarm": "🚨",
  "Commercial Alarm/Arrest": "🚨",
  "Panic Alarm": "🆘",
  "Emergency Call": "🆘",
  "Utilities Outage": "💡",
  "Assist Fire": "🚒",
  "Assist CFD": "🚒",
  "Assist Charlotte Fire": "🚒",
  "Assist Charlotte Fire Department": "🚒",
  "Assist Charlotte Fire Dept.": "🚒",

  Admit: "🤝",
  "Assist Other Agency": "🤝",
  Assist: "🤝",
  "Assist Other": "🤝",
  "Assist CMPD": "🚔",
  "Campus Safety": "🏫",
  "Campus Safety/Arrest": "🏫",
  "Campus Safety/Property": "🏫",
  "Campus Safety/Property Damage": "🏫",
  "Campus Safety/Property Theft": "🏫",
  Escort: "👮",
  "Serving Papers": "📄",
  "911 Hang Up": "📞",

  "Verbal Confrontation": "🗣️",
  Harassment: "😠",
  "Harassment/Arrest": "😠",
  "Communicating Threats": "😡",
  "Communicating Threats/Property": "😡",
  "Communicating Threats/Property Damage": "😡",
  "Communicating Threats/Property Theft": "😡",
  "Communicating Threats/Arrest": "😡",
  "Disorderly Conduct": "🗯️",
  "Disorderly Conduct/Arrest": "🗯️",
  Disturbance: "🗣️",
  "Disturbance/Arrest": "🗣️",
  "Domestic Disturbance": "🏠",
  "Domestic Violence": "🏠",
  "Domestic Violence/Arrest": "🏠",
  Domestic: "🏠",
  "Domestic Dispute": "🏠",
  Assault: "👊",
  "Assault/Arrest": "👊",
  "Assault/Battery": "👊",
  "Assault/Battery/Arrest": "👊",
  "Sexual Assault": "⚠️",
  "Sexual Assault/Arrest": "⚠️",
  "Sexual Offense": "⚠️",
  "Shots Fired": "🔫",
  "Shots Fired/Arrest": "🔫",
  Stalking: "👁️",
  "Stalking/Arrest": "👁️",
  "Indecent Exposure": "🙈",
  "Indecent Exposure/Arrest": "🙈",

  "Drug Related": "💊",
  "Drug Related/Arrest": "💊",
  "Drug Activity": "💊",
  "Drug Activity/Arrest": "💊",
  Drug: "💊",
  "Missing Person": "❓",
  "Missing Subject": "❓",
  "Missing Child": "👶",
  "Animal Control": "🐕",
  Noise: "📢",
  "Noise Complaint": "📢",
  Solicitation: "📋",
  "Solicitation/Arrest": "📋",
  Arrest: "🚓",

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
