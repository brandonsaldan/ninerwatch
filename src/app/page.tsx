"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CampusMap } from "@/components/map/campus-map";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import { useIncidents } from "@/context/incidents-context";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { incidents, loading, error } = useIncidents();

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const recentIncidents = loading ? [] : incidents.slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <CardContent className="pt-6 h-[700px]">
              <CampusMap />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ff4b66]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4b66] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff4b66]"></span>
                </span>
                Live Incidents
              </CardTitle>
              <CardDescription>Latest reported events</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground">Loading incidents...</p>
                </div>
              ) : error ? (
                <div className="py-20 text-center">
                  <p className="text-red-500">Error: {error}</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                  {recentIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="pb-4 border-b border-border"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {incident.incident_type}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {incident.incident_location}
                          </p>
                          <p className="mt-2 mb-2 text-sm text-muted-foreground line-clamp-2 overflow-hidden">
                            {incident.incident_description ||
                              "No description available."}
                          </p>
                        </div>
                        <div
                          className={`${getBadgeColor(
                            incident.incident_type
                          )} text-xs px-2 py-1 rounded-full`}
                        >
                          {incident.incident_type}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(incident.time_reported)}
                      </p>
                    </div>
                  ))}

                  {recentIncidents.length === 0 && (
                    <div className="py-10 text-center">
                      <p className="text-muted-foreground">
                        No incidents to display
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
