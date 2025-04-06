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
  PPS: { lat: 35.312073, lng: -80.730443 },
  "Student Union": { lat: 35.308651, lng: -80.733818 },
  "Union Deck": { lat: 35.309193, lng: -80.735209 },
  "Light Rail": { lat: 35.312271, lng: -80.733932 },
  "Miltimore Hall": { lat: 35.31148972816667, lng: -80.7355167891963 },
  UREC: { lat: 35.30821410701689, lng: -80.73510410052084 },
  "South Village Deck": { lat: 35.30068782330028, lng: -80.73616031782448 },
  "North Deck": { lat: 35.31301726227786, lng: -80.73129360068769 },
  "Wilson Hall": { lat: 35.30284667088313, lng: -80.73423262299436 },
  Atkins: { lat: 35.305733192943606, lng: -80.73191008154319 },
  "Laurel Hall": { lat: 35.30276133091521, lng: -80.73656945127522 },
  Marriott: { lat: 35.3102290364054, lng: -80.7447686755496 },
  "CRI Deck": { lat: 35.30922916950404, lng: -80.74343764134831 },
  "Belk Hall": { lat: 35.31047406540071, lng: -80.73473993175023 },
  CHHS: { lat: 35.307554133985306, lng: -80.73333936358785 },
  "Oak Hall": { lat: 35.30912311745998, lng: -80.73223600721032 },
  "Lynch Hall": { lat: 35.31028185878501, lng: -80.73372955747121 },
  "Lot 25": { lat: 35.313003277048054, lng: -80.73270544263463 },
  "Lot 6": { lat: 35.30942413585608, lng: -80.72568656644484 },
  "Hunt Hall": { lat: 35.3014602722455, lng: -80.73644891943515 },
  Fretwell: { lat: 35.306198413356896, lng: -80.72896811055179 },
  "Levine Hall": { lat: 35.30272860100916, lng: -80.73306290708054 },
  "East Deck 2": { lat: 35.30544065585483, lng: -80.72681104336117 },
  "Martin Hall": { lat: 35.31002608542147, lng: -80.72757204765246 },
  "Witherspoon Hall": { lat: 35.31086068701267, lng: -80.73226513188185 },
  "West Deck": { lat: 35.30552751362334, lng: -80.73665977766677 },
  "Woodward Hall": { lat: 35.30756068679362, lng: -80.7353930074827 },
  "Wallis Hall": { lat: 35.3115037345374, lng: -80.73378354202511 },
  "Robinson Hall": { lat: 35.30386486692623, lng: -80.72993239136733 },
  EPIC: { lat: 35.309184110651444, lng: -80.74155091022566 },
  McEniry: { lat: 35.3070911050101, lng: -80.73002298692892 },
  CATO: { lat: 35.305466066991265, lng: -80.72873598593509 },
  "Lot 15": { lat: 35.30792491325862, lng: -80.73239535329594 },
  Cameron: { lat: 35.307730357392565, lng: -80.73123355479966 },
  "Student Health": { lat: 35.310608027022, lng: -80.72961644427237 },
  "South Deck": { lat: 35.30068782330028, lng: -80.73616031782448 },
  "Lot 21": { lat: 35.31126803312476, lng: -80.7310559001806 },
  "Lot 5": { lat: 35.307518384320645, lng: -80.72715791288293 },
  "Holshouser Hall": { lat: 35.30213753161986, lng: -80.7360752926913 },
  "Mary Alexander": { lat: 35.308122636361915, lng: -80.72934252700448 },
  "Mary Alexander Rd": { lat: 35.308122636361915, lng: -80.72934252700448 },
  "Lot 23": { lat: 35.31059397821839, lng: -80.74150320037988 },
  "Wells Fargo Field": { lat: 35.3069478089329, lng: -80.74036361643392 },
  "Klein Hall": { lat: 35.30851294005984, lng: -80.73018481393747 },
  "Cone Center": { lat: 35.3051636715818, lng: -80.73324279475698 },
  "Atkins Library": { lat: 35.305733192943606, lng: -80.73191008154319 },
  "Lot 16": { lat: 35.30775753460412, lng: -80.73014482348113 },
  Bioinformatics: { lat: 35.312840493458374, lng: -80.74197285343608 },
  Alumni: { lat: 35.30276842372914, lng: -80.73873474549336 },
  "Maple Hall": { lat: 35.309064255419386, lng: -80.73129429277893 },
  "Scott Hall": { lat: 35.30174954584869, lng: -80.73538506464213 },
  "Student Union Building": {
    lat: 35.308715615922885,
    lng: -80.73376724157418,
  },
  "Lot 8": { lat: 35.30020432057936, lng: -80.73633977902806 },
  Annex: { lat: 35.305690534580606, lng: -80.73169691688499 },
  "Lot 16A": { lat: 35.3077484142592, lng: -80.7301474680402 },
  Reese: { lat: 35.30469294870569, lng: -80.7325012910597 },
  "Pine Hall": { lat: 35.30935844112632, lng: -80.7310961835919 },
  "Lot 5A": { lat: 35.307601881591104, lng: -80.72555616959139 },
  "Memorial Hall": { lat: 35.30382515486322, lng: -80.735849508953 },
  Smith: { lat: 35.30694960986669, lng: -80.73156517106565 },
  "Cameron Blvd": { lat: 35.306558977125015, lng: -80.73672875703002 },
  SAC: { lat: 35.30638812746262, lng: -80.73438037291629 },
  Barnhardt: { lat: 35.30638812746262, lng: -80.73438037291629 },
  "Student Activity Center": {
    lat: 35.30638812746262,
    lng: -80.73438037291629,
  },
  "Lot 20": { lat: 35.310280919371145, lng: -80.73269809941411 },
  "Lot 4": { lat: 35.30666455807998, lng: -80.7259864040329 },
  Colvard: { lat: 35.30450888861625, lng: -80.7317397125908 },
  Storrs: { lat: 35.30465074989727, lng: -80.72897746927394 },
  Woodward: { lat: 35.30752604403662, lng: -80.73538140374912 },
  "Greek Village": { lat: 35.31239269859116, lng: -80.72578153851921 },
  Barnard: { lat: 35.30587000495334, lng: -80.73002949124496 },
  "Police and Public Safety": { lat: 35.312073, lng: -80.730443 },
  "University Recreation Center": {
    lat: 35.30821410701689,
    lng: -80.73510410052084,
  },
  "Sycamore Hall": { lat: 35.30886506841222, lng: -80.72901495570946 },
  Sycamore: { lat: 35.30886506841222, lng: -80.72901495570946 },
  Witherspoon: { lat: 35.31086527159319, lng: -80.73227311582812 },
  Martin: { lat: 35.31002608542147, lng: -80.72757204765246 },
  Wilson: { lat: 35.30284667088313, lng: -80.73423262299436 },
  Scott: { lat: 35.30174954584869, lng: -80.73538506464213 },
  Oak: { lat: 35.30912311745998, lng: -80.73223600721032 },
  Maple: { lat: 35.309064255419386, lng: -80.73129429277893 },
  Pine: { lat: 35.30935844112632, lng: -80.7310961835919 },
  Laurel: { lat: 35.30276133091521, lng: -80.73656945127522 },
  Lynch: { lat: 35.31028185878501, lng: -80.73372955747121 },
  "Sanford Hall": { lat: 35.30302555985922, lng: -80.73352501718196 },
  "Duke Hall": { lat: 35.31197015949181, lng: -80.74120570366482 },
  "Barnhardt Lane": { lat: 35.30629307649671, lng: -80.73623338389348 },
  "Grigg Hall": { lat: 35.31131792912825, lng: -80.74188240561898 },
  Foundation: { lat: 35.29791415397593, lng: -80.73689994313516 },
  Admissions: { lat: 35.30111323057074, lng: -80.73299333932053 },
  "Admissions Building": { lat: 35.30111323057074, lng: -80.73299333932053 },
  "Alumni Way/Broadrick": { lat: 35.30265567427994, lng: -80.73205648768239 },
  "Alumni Way/Broadrick Blvd.": {
    lat: 35.30265567427994,
    lng: -80.73205648768239,
  },
  Belk: { lat: 35.30635901681658, lng: -80.72995739603715 },
  "Belk Gym": { lat: 35.30546787659006, lng: -80.73556751318979 },
  "Belk Plaza": { lat: 35.305173906672415, lng: -80.73097988603742 },
  CRI: { lat: 35.30923281386327, lng: -80.74345534383328 },
  Cato: { lat: 35.30549351102161, lng: -80.7287292913576 },
  "Cato Hall": { lat: 35.30549351102161, lng: -80.7287292913576 },
  Cone: { lat: 35.30515583467655, lng: -80.73324276879883 },
  "Cone Deck": { lat: 35.304749132848784, lng: -80.73434914193838 },
  East: { lat: 35.305437547453295, lng: -80.72681108856622 },
  "East Deck 1": { lat: 35.30480453880019, lng: -80.72748938906241 },
  "East Deck 3": { lat: 35.30603347157714, lng: -80.72610357894776 },
  Greek: { lat: 35.31239269859116, lng: -80.72578153851921 },
  "Greek House 1": { lat: 35.31238138178446, lng: -80.72712005526596 },
  "Greek House 2": { lat: 35.31220313530548, lng: -80.72686829889788 },
  "Greek House 3": { lat: 35.312236774295634, lng: -80.72642939943444 },
  "Greek House 4": { lat: 35.31240796288427, lng: -80.72590387361107 },
  "Greek House 5": { lat: 35.31264658879726, lng: -80.72554999130259 },
  "Greek House 6": { lat: 35.31289731817045, lng: -80.72522789481997 },
  "Greek House 7": { lat: 35.313353770620935, lng: -80.72494237066243 },
  "Greek House 8": { lat: 35.313671123729385, lng: -80.72509664631278 },
  "Greek House 9": { lat: 35.31344886306849, lng: -80.72538423018685 },
  "Greek House 10": { lat: 35.31302003233138, lng: -80.72567731193953 },
  "Greek Village 1": { lat: 35.31238138178446, lng: -80.72712005526596 },
  "Greek Village 2": { lat: 35.31220313530548, lng: -80.72686829889788 },
  "Greek Village 3": { lat: 35.312236774295634, lng: -80.72642939943444 },
  "Greek Village 4": { lat: 35.31240796288427, lng: -80.72590387361107 },
  "Greek Village 5": { lat: 35.31264658879726, lng: -80.72554999130259 },
  "Greek Village 6": { lat: 35.31289731817045, lng: -80.72522789481997 },
  "Greek Village 7": { lat: 35.313353770620935, lng: -80.72494237066243 },
  "Greek Village 8": { lat: 35.313671123729385, lng: -80.72509664631278 },
  "Greek Village 9": { lat: 35.31344886306849, lng: -80.72538423018685 },
  "Greek Village 10": { lat: 35.31302003233138, lng: -80.72567731193953 },
  Hawthorn: { lat: 35.31155799537089, lng: -80.7274596770149 },
  "Hawthorn Hall": { lat: 35.31155799537089, lng: -80.7274596770149 },
  Hickory: { lat: 35.309225275826364, lng: -80.72899299312088 },
  "Hickory Hall": { lat: 35.309225275826364, lng: -80.72899299312088 },
  Holshouser: { lat: 35.30213753161986, lng: -80.7360752926913 },
  Hunt: { lat: 35.3014602722455, lng: -80.73644891943515 },
  "Institute Circle/Robert D. Snyder": {
    lat: 35.31194747534912,
    lng: -80.74215735646662,
  },
  "Investigations (PPS)": { lat: 35.312073, lng: -80.730443 },
  "Jerry Richardson Stadium": {
    lat: 35.31054494321856,
    lng: -80.74010401783029,
  },
  Klein: { lat: 35.30851294005984, lng: -80.73018481393747 },
  Levine: { lat: 35.30272860100916, lng: -80.73306290708054 },
  "Lot 5-A": { lat: 35.307601881591104, lng: -80.72555616959139 },
  "Lot 7-A": { lat: 35.303989628561055, lng: -80.73646749171373 },
  Memorial: { lat: 35.30382515486322, lng: -80.735849508953 },
  "Off Campus": { lat: 35.30150209166273, lng: -80.7313306756337 },
  PORTAL: { lat: 35.3116833740611, lng: -80.74299943842078 },
  Robinson: { lat: 35.30386486692623, lng: -80.72993239136733 },
  "Rowe Arts": { lat: 35.30448991745258, lng: -80.73073891693303 },
  Sanford: { lat: 35.30302555985922, lng: -80.73352501718196 },
  "Wells Fargo": { lat: 35.3069478089329, lng: -80.74036361643392 },
  Wallis: { lat: 35.3115037345374, lng: -80.73378354202511 },
};

const DEFAULT_LOCATION = { lat: 35.30633448460147, lng: -80.73340059330613 };

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

type IncidentTypeCount = {
  incident_type: string;
  count: number;
};

type IncidentsContextType = {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  refreshIncidents: () => Promise<void>;
  getRecentIncidents: (limit?: number) => Incident[];
  getIncidentsByType: (type: string) => Incident[];
  incidentTypes: IncidentTypeCount[];
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
  const [incidentTypes, setIncidentTypes] = useState<IncidentTypeCount[]>([]);
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

      if (!data) {
        throw new Error("No data returned from Supabase");
      }

      const sortedIncidents = [...data].sort((a, b) => {
        const dateA = new Date(a.time_reported).getTime();
        const dateB = new Date(b.time_reported).getTime();
        return dateB - dateA;
      });

      const incidentsWithCoords = sortedIncidents.map((incident) => {
        const coords = getCoordinates(incident.incident_location);
        return {
          ...incident,
          ...coords,
        };
      });

      setIncidents(incidentsWithCoords);

      const { data: typesData, error: typesError } = await supabase
        .from("crime_incidents")
        .select("incident_type")
        .order("incident_type");

      if (typesError) {
        throw typesError;
      }

      if (!typesData) {
        throw new Error("No types data returned from Supabase");
      }

      const typeCounts: Record<string, number> = {};
      typesData.forEach((item) => {
        typeCounts[item.incident_type] =
          (typeCounts[item.incident_type] || 0) + 1;
      });

      const typeCountArray: IncidentTypeCount[] = Object.entries(typeCounts)
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
