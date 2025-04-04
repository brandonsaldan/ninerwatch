"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase, Incident, validateSupabaseConnection } from "@/lib/supabase";

const LOCATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Atkins: { lat: 35.309, lng: -80.732 },
  "Student Union": { lat: 35.308, lng: -80.733 },
  PPS: { lat: 35.3075, lng: -80.7325 },
  "East Deck 2": { lat: 35.307, lng: -80.731 },
  "East Deck 1": { lat: 35.307, lng: -80.731 },
  "Lot 6": { lat: 35.306, lng: -80.7345 },
  "Witherspoon Hall": { lat: 35.3055, lng: -80.7355 },
  Fretwell: { lat: 35.306, lng: -80.735 },
  EPIC: { lat: 35.3092, lng: -80.741 },
  "South Village Deck": { lat: 35.305, lng: -80.736 },
  // todo: add more locations
};

const DEFAULT_LOCATION = { lat: 35.3075, lng: -80.7331 };

function getCoordinates(location: string): { lat: number; lng: number } {
  if (LOCATION_COORDINATES[location]) {
    return LOCATION_COORDINATES[location];
  }

  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (location.includes(key)) {
      return coords;
    }
  }

  return DEFAULT_LOCATION;
}

type IncidentsContextType = {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  refreshIncidents: () => Promise<void>;
  getRecentIncidents: (limit?: number) => Incident[];
  getIncidentsByType: (type: string) => Incident[];
  incidentTypes: { incident_type: string; count: number }[];
};

const IncidentsContext = createContext<IncidentsContextType>({
  incidents: [],
  loading: true,
  error: null,
  refreshIncidents: async () => {},
  getRecentIncidents: () => [],
  getIncidentsByType: () => [],
  incidentTypes: [],
});

export const useIncidents = () => useContext(IncidentsContext);

export const IncidentsProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<
    { incident_type: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: incidentsError } = await supabase
        .from("crime_incidents")
        .select("*")
        .order("time_reported", { ascending: false });

      if (incidentsError) {
        throw incidentsError;
      }

      const incidentsWithCoords = data.map((incident) => ({
        ...incident,
        ...getCoordinates(incident.incident_location),
      }));

      setIncidents(incidentsWithCoords);

      const { data: typesData, error: typesError } = await supabase
        .from("crime_incidents")
        .select("incident_type")
        .order("incident_type");

      if (typesError) {
        throw typesError;
      }

      const typeCounts: Record<string, number> = {};
      typesData.forEach((item) => {
        typeCounts[item.incident_type] =
          (typeCounts[item.incident_type] || 0) + 1;
      });

      const typeCountArray = Object.entries(typeCounts)
        .map(([incident_type, count]) => ({
          incident_type,
          count,
        }))
        .sort((a, b) => b.count - a.count);

      setIncidentTypes(typeCountArray);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error fetching incidents:", errorMessage);
      setError("Failed to load incidents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setupData = async () => {
      const isConnected = await validateSupabaseConnection();
      if (isConnected) {
        fetchIncidents();

        const subscription = supabase
          .channel("crime_incidents-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "crime_incidents",
            },
            () => {
              fetchIncidents();
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } else {
        setError(
          "Could not connect to the database. Please check your connection and configuration."
        );
        setLoading(false);
      }
    };

    setupData();
  }, []);

  const refreshIncidents = async () => {
    await fetchIncidents();
  };

  const getRecentIncidents = (limit = 10) => {
    return incidents.slice(0, limit);
  };

  const getIncidentsByType = (type: string) => {
    return incidents.filter((incident) => incident.incident_type === type);
  };

  return (
    <IncidentsContext.Provider
      value={{
        incidents,
        loading,
        error,
        refreshIncidents,
        getRecentIncidents,
        getIncidentsByType,
        incidentTypes,
      }}
    >
      {children}
    </IncidentsContext.Provider>
  );
};
