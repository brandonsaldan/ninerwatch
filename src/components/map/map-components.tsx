"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

const icon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
    type: "Report",
    lat: 35.306,
    lng: -80.735,
    time: "Yesterday, 8:45 PM",
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
          icon={icon}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium text-sm">{incident.title}</h3>
              <p className="text-xs text-muted-foreground">
                {incident.location}
              </p>
              <p className="text-xs mt-1">{incident.time}</p>
              <div className="mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
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
