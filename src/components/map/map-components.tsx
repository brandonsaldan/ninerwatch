"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { useIncidents } from "@/context/incidents-context";
import { formatDistanceToNow } from "date-fns";
import { Incident } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
    popupAnchor: [0, -10],
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
    "Larceny of Bicycle": "bg-yellow-500/10 text-yellow-500",
    "Larceny of Laptop": "bg-yellow-500/10 text-yellow-500",
    Theft: "bg-yellow-500/10 text-yellow-500",
    "Lost or Stolen": "bg-purple-500/10 text-purple-500",
    Fraud: "bg-yellow-500/10 text-yellow-500",

    "Accident/Property": "bg-orange-500/10 text-orange-500",
    "Accident/Property Damage": "bg-orange-500/10 text-orange-500",
    "Vehicle Accident": "bg-orange-500/10 text-orange-500",
    "Hit and Run": "bg-orange-500/10 text-orange-500",
    "Hit and Run/Property": "bg-orange-500/10 text-orange-500",
    "Disabled Vehicle": "bg-orange-500/10 text-orange-500",
    "Vehicle Lockout": "bg-orange-500/10 text-orange-500",
    "Traffic Stop": "bg-orange-500/10 text-orange-500",
    "Vehicle Stop": "bg-orange-500/10 text-orange-500",
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

export default function MapComponents({ incidentId }: { incidentId?: string }) {
  const router = useRouter();
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

  let incidentsWithCoords = incidents
    .filter((incident) => incident.lat && incident.lng)
    .slice(0, 25);

  if (incidentId) {
    incidentsWithCoords = incidentsWithCoords.filter(
      (incident) => incident.id === incidentId
    );
  }

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
      zoom={15}
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

      {Object.entries(locationGroups).map((entry) =>
        entry[1].map((incident, index) => {
          const [adjustedLat, adjustedLng] = adjustMarkerPosition(
            incident,
            index,
            entry[1].length
          );

          return (
            <Marker
              key={incident.id}
              position={[adjustedLat, adjustedLng]}
              icon={createCustomIcon(incident.incident_type)}
            >
              <Popup className="custom-popup">
                <div className="rounded-xl bg-black/60 border border-border shadow-lg p-4 max-w-xs backdrop-blur-md bg-opacity-90">
                  <div className="space-y-2">
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

                  <button
                    className="block w-full mt-3 text-center py-1.5 px-3 rounded bg-secondary/60 hover:bg-secondary/80 text-white text-xs font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/incident/${incident.report_number.replace(
                          /\//g,
                          "-"
                        )}`
                      );
                    }}
                  >
                    View Incident Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })
      )}
    </MapContainer>
  );
}
