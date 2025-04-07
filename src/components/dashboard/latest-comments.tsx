import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase, Comment } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type CommentWithIncident = Comment & {
  crime_incidents: {
    id: string;
    report_number: string;
    incident_type: string;
    incident_location: string;
  };
};

export function LatestComments() {
  const [comments, setComments] = useState<CommentWithIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("incident_comments")
          .select(
            `
            *,
            crime_incidents (
              id,
              report_number,
              incident_type,
              incident_location
            )
            `
          )
          .order("created_at", { ascending: false })
          .limit(6);

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setComments(data as CommentWithIncident[]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error fetching latest comments:", errorMessage);
        setError("Failed to load comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestComments();

    const subscription = supabase
      .channel("incident_comments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incident_comments",
        },
        () => {
          fetchLatestComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const getBadgeColor = (type: string) => {
    const typeToColor: Record<string, string> = {
      Larceny: "bg-yellow-500/10 text-yellow-500",
      "Larceny of Bicycle": "bg-yellow-500/10 text-yellow-500",
      "Larceny of Laptop": "bg-yellow-500/10 text-yellow-500",
      "Larceny of Property": "bg-yellow-500/10 text-yellow-500",
      "Larceny of Vehicle": "bg-yellow-500/10 text-yellow-500",
      "Larceny of Vehicle Parts": "bg-yellow-500/10 text-yellow-500",
      "Larceny/Arrest": "bg-yellow-500/10 text-yellow-500",
      "Larceny/Property": "bg-yellow-500/10 text-yellow-500",
      "Larceny/Property Damage": "bg-yellow-500/10 text-yellow-500",
      "Larceny/Property Theft": "bg-yellow-500/10 text-yellow-500",
      "Larceny/Vehicle": "bg-yellow-500/10 text-yellow-500",
      "Larceny/Vehicle Parts": "bg-yellow-500/10 text-yellow-500",
      "Larceny/Vehicle Theft": "bg-yellow-500/10 text-yellow-500",
      Theft: "bg-yellow-500/10 text-yellow-500",
      "Property Theft": "bg-yellow-500/10 text-yellow-500",
      "Property Theft/Arrest": "bg-yellow-500/10 text-yellow-500",
      Burglary: "bg-yellow-500/10 text-yellow-500",
      "Burglary/Arrest": "bg-yellow-500/10 text-yellow-500",
      "Burglary/Property": "bg-yellow-500/10 text-yellow-500",
      "Burglary/Property Damage": "bg-yellow-500/10 text-yellow-500",
      "Burglary/Property Theft": "bg-yellow-500/10 text-yellow-500",
      "Burglary of Vehicle": "bg-yellow-500/10 text-yellow-500",
      "Burglary of Vehicle Parts": "bg-yellow-500/10 text-yellow-500",
      "Burglary/Vehicle": "bg-yellow-500/10 text-yellow-500",
      "Burglary/Vehicle Parts": "bg-yellow-500/10 text-yellow-500",
      "Burglary/Vehicle Theft": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle Parts": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle/Arrest": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle Parts/Arrest": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle/Property": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle/Property Damage": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle/Property Theft": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle Parts/Property": "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle Parts/Property Damage":
        "bg-yellow-500/10 text-yellow-500",
      "Stolen Vehicle Parts/Property Theft": "bg-yellow-500/10 text-yellow-500",
      "Motor Vehicle Theft": "bg-yellow-500/10 text-yellow-500",
      "Motor Vehicle Theft/Arrest": "bg-yellow-500/10 text-yellow-500",
      Fraud: "bg-yellow-500/10 text-yellow-500",
      "Fraud/Arrest": "bg-yellow-500/10 text-yellow-500",
      "Identity Theft": "bg-yellow-500/10 text-yellow-500",
      "Identity Theft/Arrest": "bg-yellow-500/10 text-yellow-500",
      Robbery: "bg-yellow-600/10 text-yellow-600",
      "Robbery/Attempted": "bg-yellow-600/10 text-yellow-600",
      "Attempted Robbery": "bg-yellow-600/10 text-yellow-600",
      "Robbery/Arrest": "bg-yellow-600/10 text-yellow-600",
      "Robbery/Property": "bg-yellow-600/10 text-yellow-600",
      "Robbery/Property Damage": "bg-yellow-600/10 text-yellow-600",
      "Robbery/Property Theft": "bg-yellow-600/10 text-yellow-600",
      "Robbery/Vehicle": "bg-yellow-600/10 text-yellow-600",
      "Robbery/Vehicle Parts": "bg-yellow-600/10 text-yellow-600",

      "Lost or Stolen": "bg-purple-500/10 text-purple-500",
      "Lost Property": "bg-purple-500/10 text-purple-500",
      "Property Found": "bg-purple-500/10 text-purple-500",
      "Missing/Found Person": "bg-purple-500/10 text-purple-500",
      "Missing/Found Subject": "bg-purple-500/10 text-purple-500",

      Accident: "bg-orange-500/10 text-orange-500",
      "Accident/Arrest": "bg-orange-500/10 text-orange-500",
      "Accident/Hit & Run": "bg-orange-500/10 text-orange-500",
      "Accident/Hit and Run": "bg-orange-500/10 text-orange-500",
      "Accident/Hit and Run/Property": "bg-orange-500/10 text-orange-500",
      "Accident/Hit and Run/Property Damage":
        "bg-orange-500/10 text-orange-500",
      "Accident/Personal Injury": "bg-orange-500/10 text-orange-500",
      "Accident/Personal Injury/Property Damage":
        "bg-orange-500/10 text-orange-500",
      "Accident/Property": "bg-orange-500/10 text-orange-500",
      "Accident/Property Damage": "bg-orange-500/10 text-orange-500",
      "Vehicle Accident": "bg-orange-500/10 text-orange-500",
      "Hit & Run": "bg-orange-500/10 text-orange-500",
      "Hit & Run/Arrest": "bg-orange-500/10 text-orange-500",
      "Hit & Run/Property": "bg-orange-500/10 text-orange-500",
      "Hit & Run/Property Damage": "bg-orange-500/10 text-orange-500",
      "Hit and Run": "bg-orange-500/10 text-orange-500",
      "Hit and Run/Arrest": "bg-orange-500/10 text-orange-500",
      "Hit and Run/Property": "bg-orange-500/10 text-orange-500",
      "Hit and Run/Property Damage": "bg-orange-500/10 text-orange-500",
      Crash: "bg-orange-500/10 text-orange-500",
      "Disabled Vehicle": "bg-orange-500/10 text-orange-500",
      "Vehicle Lockout": "bg-orange-500/10 text-orange-500",
      "Traffic Stop": "bg-orange-500/10 text-orange-500",
      "Traffic Violation": "bg-orange-500/10 text-orange-500",
      "Vehicle Stop": "bg-orange-500/10 text-orange-500",
      "Abandoned Vehicle": "bg-orange-400/10 text-orange-400",
      "Parking Violation": "bg-orange-300/10 text-orange-300",
      "Illegal Parking": "bg-orange-300/10 text-orange-300",

      "Suspicious Person": "bg-blue-500/10 text-blue-500",
      "Suspicious Person/Arrest": "bg-blue-500/10 text-blue-500",
      "Suspicious Person/Property": "bg-blue-500/10 text-blue-500",
      "Suspicious Person/Property Damage": "bg-blue-500/10 text-blue-500",
      "Suspicious Person/Property Theft": "bg-blue-500/10 text-blue-500",
      "Suspicious Vehicle": "bg-blue-500/10 text-blue-500",
      "Suspicious Vehicle/Arrest": "bg-blue-500/10 text-blue-500",
      "Suspicious Activity": "bg-blue-500/10 text-blue-500",
      "Suspicious Activity/Arrest": "bg-blue-500/10 text-blue-500",
      "Suspicious Activity/Property": "bg-blue-500/10 text-blue-500",
      "Suspicious Activity/Property Damage": "bg-blue-500/10 text-blue-500",
      "Suspicious Activity/Property Theft": "bg-blue-500/10 text-blue-500",
      Investigate: "bg-blue-500/10 text-blue-500",
      "Investigate/Arrest": "bg-blue-500/10 text-blue-500",
      "Investigate/Property": "bg-blue-500/10 text-blue-500",
      "Investigate/Property Damage": "bg-blue-500/10 text-blue-500",
      "Investigate/Property Theft": "bg-blue-500/10 text-blue-500",
      "Investigate/Vehicle": "bg-blue-500/10 text-blue-500",
      "Investigate/Vehicle Parts": "bg-blue-500/10 text-blue-500",
      "Investigate/Vehicle Theft": "bg-blue-500/10 text-blue-500",
      Investigation: "bg-blue-500/10 text-blue-500",
      "Investigation/Arrest": "bg-blue-500/10 text-blue-500",
      "Investigation/Property": "bg-blue-500/10 text-blue-500",
      "Investigation/Property Damage": "bg-blue-500/10 text-blue-500",
      "Investigation/Property Theft": "bg-blue-500/10 text-blue-500",
      "Investigation/Vehicle": "bg-blue-500/10 text-blue-500",
      "Investigation/Vehicle Parts": "bg-blue-500/10 text-blue-500",
      "Investigation/Vehicle Theft": "bg-blue-500/10 text-blue-500",
      "Follow Up": "bg-blue-400/10 text-blue-400",
      BOLO: "bg-blue-600/10 text-blue-600",
      "Pedestrian Check": "bg-blue-400/10 text-blue-400",
      Loitering: "bg-blue-300/10 text-blue-300",
      "Loitering/Arrest": "bg-blue-300/10 text-blue-300",
      "Loitering/Trespassing": "bg-blue-300/10 text-blue-300",
      Trespassing: "bg-blue-300/10 text-blue-300",
      "Criminal Trespass": "bg-blue-300/10 text-blue-300",
      "Criminal Trespass/Arrest": "bg-blue-300/10 text-blue-300",

      "Damage to Property": "bg-red-500/10 text-red-500",
      "Damage to Vehicle": "bg-red-500/10 text-red-500",
      "Property Damage": "bg-red-500/10 text-red-500",
      "Property Damage/Arrest": "bg-red-500/10 text-red-500",
      "Criminal Damage": "bg-red-500/10 text-red-500",
      "Criminal Damage to Property": "bg-red-500/10 text-red-500",
      "Criminal Damage to Vehicle": "bg-red-500/10 text-red-500",
      Vandalism: "bg-red-500/10 text-red-500",
      Arson: "bg-red-600/10 text-red-600",

      "Welfare Check": "bg-green-500/10 text-green-500",
      "Injured/Ill Subject": "bg-green-500/10 text-green-500",
      "Injured Subject": "bg-green-500/10 text-green-500",
      "Injured Person": "bg-green-500/10 text-green-500",
      "Emergency Medical Call": "bg-green-500/10 text-green-500",
      "Assist Medic": "bg-green-500/10 text-green-500",
      Suicide: "bg-green-600/10 text-green-600",
      "Suicide Attempt": "bg-green-600/10 text-green-600",
      "Suicide Ideation": "bg-green-600/10 text-green-600",
      "Drug Overdose": "bg-green-600/10 text-green-600",
      Overdose: "bg-green-600/10 text-green-600",
      "Health and Safety": "bg-green-400/10 text-green-400",
      "Intoxicated Person": "bg-green-400/10 text-green-400",
      "Intoxicated Subject": "bg-green-400/10 text-green-400",
      "Intoxicated/Disorderly": "bg-green-400/10 text-green-400",
      "Intoxicated/Disorderly Person": "bg-green-400/10 text-green-400",
      "Intoxicated/Disorderly Subject": "bg-green-400/10 text-green-400",
      "Intoxicated/Disorderly Subject/Arrest": "bg-green-400/10 text-green-400",

      "Elevator Call": "bg-cyan-500/10 text-cyan-500",
      "Elevator Emergency": "bg-cyan-500/10 text-cyan-500",
      "Elevator Emergency Call": "bg-cyan-500/10 text-cyan-500",
      "Disabled Elevator": "bg-cyan-500/10 text-cyan-500",
      "Elevator Entrapment": "bg-cyan-500/10 text-cyan-500",
      "Commercial Alarm": "bg-cyan-400/10 text-cyan-400",
      "Commercial Alarm/Arrest": "bg-cyan-400/10 text-cyan-400",
      "Panic Alarm": "bg-cyan-400/10 text-cyan-400",
      "Emergency Call": "bg-cyan-400/10 text-cyan-400",
      "Utilities Outage": "bg-cyan-600/10 text-cyan-600",
      "Assist Fire": "bg-cyan-600/10 text-cyan-600",
      "Assist CFD": "bg-cyan-600/10 text-cyan-600",
      "Assist Charlotte Fire": "bg-cyan-600/10 text-cyan-600",
      "Assist Charlotte Fire Department": "bg-cyan-600/10 text-cyan-600",
      "Assist Charlotte Fire Dept.": "bg-cyan-600/10 text-cyan-600",

      "Assist Other Agency": "bg-indigo-500/10 text-indigo-500",
      Assist: "bg-indigo-500/10 text-indigo-500",
      "Assist Other": "bg-indigo-500/10 text-indigo-500",
      "Assist CMPD": "bg-indigo-500/10 text-indigo-500",
      "Campus Safety": "bg-indigo-500/10 text-indigo-500",
      "Campus Safety/Arrest": "bg-indigo-500/10 text-indigo-500",
      "Campus Safety/Property": "bg-indigo-500/10 text-indigo-500",
      "Campus Safety/Property Damage": "bg-indigo-500/10 text-indigo-500",
      "Campus Safety/Property Theft": "bg-indigo-500/10 text-indigo-500",
      Escort: "bg-indigo-400/10 text-indigo-400",
      "Serving Papers": "bg-indigo-400/10 text-indigo-400",
      "911 Hang Up": "bg-indigo-300/10 text-indigo-300",

      "Verbal Confrontation": "bg-pink-500/10 text-pink-500",
      Harassment: "bg-pink-500/10 text-pink-500",
      "Harassment/Arrest": "bg-pink-500/10 text-pink-500",
      "Communicating Threats": "bg-pink-500/10 text-pink-500",
      "Communicating Threats/Property": "bg-pink-500/10 text-pink-500",
      "Communicating Threats/Property Damage": "bg-pink-500/10 text-pink-500",
      "Communicating Threats/Property Theft": "bg-pink-500/10 text-pink-500",
      "Communicating Threats/Arrest": "bg-pink-500/10 text-pink-500",
      "Disorderly Conduct": "bg-pink-500/10 text-pink-500",
      "Disorderly Conduct/Arrest": "bg-pink-500/10 text-pink-500",
      Disturbance: "bg-pink-500/10 text-pink-500",
      "Disturbance/Arrest": "bg-pink-500/10 text-pink-500",
      "Domestic Disturbance": "bg-pink-500/10 text-pink-500",
      "Domestic Violence": "bg-pink-500/10 text-pink-500",
      "Domestic Violence/Arrest": "bg-pink-500/10 text-pink-500",
      Domestic: "bg-pink-500/10 text-pink-500",
      "Domestic Dispute": "bg-pink-500/10 text-pink-500",
      Assault: "bg-pink-600/10 text-pink-600",
      "Assault/Arrest": "bg-pink-600/10 text-pink-600",
      "Assault/Battery": "bg-pink-600/10 text-pink-600",
      "Assault/Battery/Arrest": "bg-pink-600/10 text-pink-600",
      "Sexual Assault": "bg-pink-600/10 text-pink-600",
      "Sexual Assault/Arrest": "bg-pink-600/10 text-pink-600",
      "Sexual Offense": "bg-pink-600/10 text-pink-600",
      "Shots Fired": "bg-pink-600/10 text-pink-600",
      "Shots Fired/Arrest": "bg-pink-600/10 text-pink-600",
      Stalking: "bg-pink-600/10 text-pink-600",
      "Stalking/Arrest": "bg-pink-600/10 text-pink-600",
      "Indecent Exposure": "bg-pink-400/10 text-pink-400",
      "Indecent Exposure/Arrest": "bg-pink-400/10 text-pink-400",

      "Drug Related": "bg-rose-500/10 text-rose-500",
      "Drug Related/Arrest": "bg-rose-500/10 text-rose-500",
      "Drug Activity": "bg-rose-500/10 text-rose-500",
      "Drug Activity/Arrest": "bg-rose-500/10 text-rose-500",
      Drug: "bg-rose-500/10 text-rose-500",
      "Missing Person": "bg-rose-400/10 text-rose-400",
      "Missing Subject": "bg-rose-400/10 text-rose-400",
      "Missing Child": "bg-rose-400/10 text-rose-400",
      "Animal Control": "bg-rose-300/10 text-rose-300",
      Noise: "bg-rose-300/10 text-rose-300",
      "Noise Complaint": "bg-rose-300/10 text-rose-300",
      Solicitation: "bg-rose-300/10 text-rose-300",
      "Solicitation/Arrest": "bg-rose-300/10 text-rose-300",
      Arrest: "bg-rose-400/10 text-rose-400",
      Default: "bg-gray-500/10 text-gray-500",
    };

    if (typeToColor[type]) {
      return typeToColor[type];
    }

    for (const [key, value] of Object.entries(typeToColor)) {
      if (type.includes(key)) {
        return value;
      }
    }

    return typeToColor.Default;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-blue-500">💬</span> Latest Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">Loading latest comments...</p>
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">
              No comments found. Be the first to comment on an incident!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Link
                key={comment.id}
                href={`/incident/${comment.crime_incidents.report_number.replace(
                  /\//g,
                  "-"
                )}`}
                className="block hover:bg-secondary/10 rounded-md transition-colors"
              >
                <div className="p-3">
                  <div className="flex justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: comment.user_color }}
                      >
                        A
                      </div>
                      <div className="text-sm font-medium">Anonymous Niner</div>
                    </div>
                    <div
                      className={`${getBadgeColor(
                        comment.crime_incidents.incident_type
                      )} text-xs px-2 py-0.5 rounded-full whitespace-nowrap`}
                    >
                      {comment.crime_incidents.incident_type}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground line-clamp-2 break-words truncate">
                    {comment.comment_text}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {comment.crime_incidents.incident_location}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            <div className="pt-2 text-center">
              <Link
                href="/incidents"
                className="text-xs text-primary hover:underline"
              >
                View all incident discussions →
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
