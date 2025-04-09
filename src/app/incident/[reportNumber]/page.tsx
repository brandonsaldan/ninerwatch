"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import { supabase, Incident, Comment } from "@/lib/supabase";
import {
  getIncidentComments,
  addComment,
  addReply,
  updateCommentVotes,
  getTotalRepliesCount,
} from "@/lib/comments";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { IncidentDetailMap } from "@/components/map/incident-detail-map";
import IncidentSkeleton from "@/components/ui/incident-skeleton";
import { CommentComponent } from "@/components/ui/comment";

export default function IncidentPage() {
  const router = useRouter();
  const { reportNumber } = useParams();
  const originalReportNumber = (reportNumber as string).replace(/-/g, "/");
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "community">(
    "community"
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [continuedThreadComment, setContinuedThreadComment] =
    useState<Comment | null>(null);
  const [originalThreadState, setOriginalThreadState] = useState<
    Comment[] | null
  >(null);

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("crime_incidents")
          .select("*")
          .eq("report_number", originalReportNumber)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        setIncident(data);

        if (data) {
          setLoadingComments(true);
          const { data: commentsData, error: commentsError } =
            await getIncidentComments(data.id);

          if (commentsError) {
            console.error("Error fetching comments:", commentsError);
          } else {
            setComments(commentsData || []);
          }
          setLoadingComments(false);

          const subscription = supabase
            .channel(`incident-${data.id}-comments`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "incident_comments",
                filter: `incident_id=eq.${data.id}`,
              },
              async (payload) => {
                console.log("Comment updated:", payload.eventType);
                const { data: refreshedComments } = await getIncidentComments(
                  data.id
                );
                if (refreshedComments) {
                  setComments(refreshedComments);
                }
              }
            )
            .subscribe();

          return () => {
            subscription.unsubscribe();
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error fetching incident:", errorMessage);
        setError("Failed to load incident details.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentData();
  }, [originalReportNumber]);

  useEffect(() => {
    if (incident && comments.length > 0) {
      const loadedVotes: Record<string, number> = {};

      const loadVotesRecursive = (comments: Comment[]) => {
        comments.forEach((comment) => {
          const storageKey = `vote_${incident.id}_${comment.id}`;
          const savedVote = localStorage.getItem(storageKey);
          if (savedVote) {
            loadedVotes[comment.id] = parseInt(savedVote);
          }

          if (comment.replies && comment.replies.length > 0) {
            loadVotesRecursive(comment.replies);
          }
        });
      };

      loadVotesRecursive(comments);
      setUserVotes(loadedVotes);
    }
  }, [incident, comments]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const getIncidentTheme = (type: string) => {
    interface ThemeType {
      color: string;
      emoji: string;
      bgGradient: string;
      accentColor: string;
      accentBg: string;
    }

    const themes: Record<string, ThemeType> = {
      Larceny: {
        color: "text-yellow-500",
        emoji: "💰",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny of Bicycle": {
        color: "text-yellow-500",
        emoji: "🚲",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny of Laptop": {
        color: "text-yellow-500",
        emoji: "💻",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny of Property": {
        color: "text-yellow-500",
        emoji: "📱",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny of Vehicle": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny of Vehicle Parts": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny/Arrest": {
        color: "text-yellow-500",
        emoji: "💰",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny/Property": {
        color: "text-yellow-500",
        emoji: "📱",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny/Property Damage": {
        color: "text-yellow-500",
        emoji: "📱",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny/Property Theft": {
        color: "text-yellow-500",
        emoji: "📱",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny/Vehicle": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny/Vehicle Parts": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Larceny/Vehicle Theft": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      Theft: {
        color: "text-yellow-500",
        emoji: "💰",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Property Theft": {
        color: "text-yellow-500",
        emoji: "📱",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Property Theft/Arrest": {
        color: "text-yellow-500",
        emoji: "📱",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      Burglary: {
        color: "text-yellow-500",
        emoji: "🏠",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary/Arrest": {
        color: "text-yellow-500",
        emoji: "🏠",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary/Property": {
        color: "text-yellow-500",
        emoji: "🏠",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary/Property Damage": {
        color: "text-yellow-500",
        emoji: "🏠",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary/Property Theft": {
        color: "text-yellow-500",
        emoji: "🏠",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary of Vehicle": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary of Vehicle Parts": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary/Vehicle": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary/Vehicle Parts": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Burglary/Vehicle Theft": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle Parts": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle/Arrest": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle Parts/Arrest": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle/Property": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle/Property Damage": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle/Property Theft": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle Parts/Property": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle Parts/Property Damage": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Stolen Vehicle Parts/Property Theft": {
        color: "text-yellow-500",
        emoji: "🔧",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Motor Vehicle Theft": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Motor Vehicle Theft/Arrest": {
        color: "text-yellow-500",
        emoji: "🚗",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      Fraud: {
        color: "text-yellow-500",
        emoji: "💳",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Fraud/Arrest": {
        color: "text-yellow-500",
        emoji: "💳",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Identity Theft": {
        color: "text-yellow-500",
        emoji: "🪪",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      "Identity Theft/Arrest": {
        color: "text-yellow-500",
        emoji: "🪪",
        bgGradient: "from-yellow-500/5 to-yellow-500/10",
        accentColor: "text-yellow-500",
        accentBg: "bg-yellow-500/10",
      },
      Robbery: {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },
      "Robbery/Attempted": {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },
      "Attempted Robbery": {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },
      "Robbery/Arrest": {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },
      "Robbery/Property": {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },
      "Robbery/Property Damage": {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },
      "Robbery/Property Theft": {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },
      "Robbery/Vehicle": {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },
      "Robbery/Vehicle Parts": {
        color: "text-yellow-600",
        emoji: "🔫",
        bgGradient: "from-yellow-600/5 to-yellow-600/10",
        accentColor: "text-yellow-600",
        accentBg: "bg-yellow-600/10",
      },

      "Lost or Stolen": {
        color: "text-purple-500",
        emoji: "🔎",
        bgGradient: "from-purple-500/5 to-purple-500/10",
        accentColor: "text-purple-500",
        accentBg: "bg-purple-500/10",
      },
      "Lost Property": {
        color: "text-purple-500",
        emoji: "🔎",
        bgGradient: "from-purple-500/5 to-purple-500/10",
        accentColor: "text-purple-500",
        accentBg: "bg-purple-500/10",
      },
      "Property Found": {
        color: "text-purple-500",
        emoji: "✅",
        bgGradient: "from-purple-500/5 to-purple-500/10",
        accentColor: "text-purple-500",
        accentBg: "bg-purple-500/10",
      },
      "Missing/Found Person": {
        color: "text-purple-500",
        emoji: "👥",
        bgGradient: "from-purple-500/5 to-purple-500/10",
        accentColor: "text-purple-500",
        accentBg: "bg-purple-500/10",
      },
      "Missing/Found Subject": {
        color: "text-purple-500",
        emoji: "👥",
        bgGradient: "from-purple-500/5 to-purple-500/10",
        accentColor: "text-purple-500",
        accentBg: "bg-purple-500/10",
      },

      Accident: {
        color: "text-orange-500",
        emoji: "💥",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Arrest": {
        color: "text-orange-500",
        emoji: "💥",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Hit & Run": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Hit and Run": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Hit and Run/Property": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Hit and Run/Property Damage": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Personal Injury": {
        color: "text-orange-500",
        emoji: "🤕",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Personal Injury/Property Damage": {
        color: "text-orange-500",
        emoji: "🤕",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Property": {
        color: "text-orange-500",
        emoji: "💥",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Accident/Property Damage": {
        color: "text-orange-500",
        emoji: "💥",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Vehicle Accident": {
        color: "text-orange-500",
        emoji: "🚗",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Reckless Driving": {
        color: "text-orange-500",
        emoji: "🚗",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit & Run": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit & Run/Arrest": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit & Run/Property": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit & Run/Property Damage": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit and Run": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit and Run/Arrest": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit and Run/Property": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit and Run/Property Damage": {
        color: "text-orange-500",
        emoji: "🏃",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      Crash: {
        color: "text-orange-500",
        emoji: "💥",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Disabled Vehicle": {
        color: "text-orange-500",
        emoji: "🚘",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Vehicle Lockout": {
        color: "text-orange-500",
        emoji: "🔑",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Traffic Stop": {
        color: "text-orange-500",
        emoji: "🛑",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Traffic Violation": {
        color: "text-orange-500",
        emoji: "🛑",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Vehicle Stop": {
        color: "text-orange-500",
        emoji: "🛑",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Abandoned Vehicle": {
        color: "text-orange-400",
        emoji: "🚙",
        bgGradient: "from-orange-400/5 to-orange-400/10",
        accentColor: "text-orange-400",
        accentBg: "bg-orange-400/10",
      },
      "Parking Violation": {
        color: "text-orange-300",
        emoji: "🅿️",
        bgGradient: "from-orange-300/5 to-orange-300/10",
        accentColor: "text-orange-300",
        accentBg: "bg-orange-300/10",
      },
      "Parking Violation/Arrest": {
        color: "text-orange-300",
        emoji: "🅿️",
        bgGradient: "from-orange-300/5 to-orange-300/10",
        accentColor: "text-orange-300",
        accentBg: "bg-orange-300/10",
      },
      "Illegal Parking": {
        color: "text-orange-300",
        emoji: "🚫",
        bgGradient: "from-orange-300/5 to-orange-300/10",
        accentColor: "text-orange-300",
        accentBg: "bg-orange-300/10",
      },
      "Illegal Parking/Arrest": {
        color: "text-orange-300",
        emoji: "🚫",
        bgGradient: "from-orange-300/5 to-orange-300/10",
        accentColor: "text-orange-300",
        accentBg: "bg-orange-300/10",
      },

      "Suspicious Person": {
        color: "text-blue-500",
        emoji: "👤",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Person/Arrest": {
        color: "text-blue-500",
        emoji: "👤",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Person/Property": {
        color: "text-blue-500",
        emoji: "👤",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Person/Property Damage": {
        color: "text-blue-500",
        emoji: "👤",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Person/Property Theft": {
        color: "text-blue-500",
        emoji: "👤",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Vehicle": {
        color: "text-blue-500",
        emoji: "🚗",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Vehicle/Arrest": {
        color: "text-blue-500",
        emoji: "🚗",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Activity": {
        color: "text-blue-500",
        emoji: "👀",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Activity/Arrest": {
        color: "text-blue-500",
        emoji: "👀",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Activity/Property": {
        color: "text-blue-500",
        emoji: "👀",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Activity/Property Damage": {
        color: "text-blue-500",
        emoji: "👀",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Suspicious Activity/Property Theft": {
        color: "text-blue-500",
        emoji: "👀",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      Investigate: {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigate/Arrest": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigate/Property": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigate/Property Damage": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigate/Property Theft": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigate/Vehicle": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigate/Vehicle Parts": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigate/Vehicle Theft": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      Investigation: {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigation/Arrest": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigation/Property": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigation/Property Damage": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigation/Property Theft": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigation/Vehicle": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigation/Vehicle Parts": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Investigation/Vehicle Theft": {
        color: "text-blue-500",
        emoji: "🔍",
        bgGradient: "from-blue-500/5 to-blue-500/10",
        accentColor: "text-blue-500",
        accentBg: "bg-blue-500/10",
      },
      "Follow Up": {
        color: "text-blue-400",
        emoji: "📝",
        bgGradient: "from-blue-400/5 to-blue-400/10",
        accentColor: "text-blue-400",
        accentBg: "bg-blue-400/10",
      },
      BOLO: {
        color: "text-blue-600",
        emoji: "👁️",
        bgGradient: "from-blue-600/5 to-blue-600/10",
        accentColor: "text-blue-600",
        accentBg: "bg-blue-600/10",
      },
      "Pedestrian Check": {
        color: "text-blue-400",
        emoji: "🚶",
        bgGradient: "from-blue-400/5 to-blue-400/10",
        accentColor: "text-blue-400",
        accentBg: "bg-blue-400/10",
      },
      Loitering: {
        color: "text-blue-300",
        emoji: "🚷",
        bgGradient: "from-blue-300/5 to-blue-300/10",
        accentColor: "text-blue-300",
        accentBg: "bg-blue-300/10",
      },
      "Loitering/Arrest": {
        color: "text-blue-300",
        emoji: "🚷",
        bgGradient: "from-blue-300/5 to-blue-300/10",
        accentColor: "text-blue-300",
        accentBg: "bg-blue-300/10",
      },
      "Loitering/Trespassing": {
        color: "text-blue-300",
        emoji: "⛔",
        bgGradient: "from-blue-300/5 to-blue-300/10",
        accentColor: "text-blue-300",
        accentBg: "bg-blue-300/10",
      },
      Trespassing: {
        color: "text-blue-300",
        emoji: "⛔",
        bgGradient: "from-blue-300/5 to-blue-300/10",
        accentColor: "text-blue-300",
        accentBg: "bg-blue-300/10",
      },
      "Criminal Trespass": {
        color: "text-blue-300",
        emoji: "⛔",
        bgGradient: "from-blue-300/5 to-blue-300/10",
        accentColor: "text-blue-300",
        accentBg: "bg-blue-300/10",
      },
      "Criminal Trespass/Arrest": {
        color: "text-blue-300",
        emoji: "⛔",
        bgGradient: "from-blue-300/5 to-blue-300/10",
        accentColor: "text-blue-300",
        accentBg: "bg-blue-300/10",
      },

      "Damage to Property": {
        color: "text-red-500",
        emoji: "🏚️",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      "Damage to Vehicle": {
        color: "text-red-500",
        emoji: "🚗",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      "Property Damage": {
        color: "text-red-500",
        emoji: "🏚️",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      "Property Damage/Arrest": {
        color: "text-red-500",
        emoji: "🏚️",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      "Criminal Damage": {
        color: "text-red-500",
        emoji: "🏚️",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      "Criminal Damage to Property": {
        color: "text-red-500",
        emoji: "🏚️",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      "Criminal Damage to Vehicle": {
        color: "text-red-500",
        emoji: "🚗",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      Vandalism: {
        color: "text-red-500",
        emoji: "🖌️",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      Arson: {
        color: "text-red-600",
        emoji: "🔥",
        bgGradient: "from-red-600/5 to-red-600/10",
        accentColor: "text-red-600",
        accentBg: "bg-red-600/10",
      },

      "Welfare Check": {
        color: "text-green-500",
        emoji: "🏥",
        bgGradient: "from-green-500/5 to-green-500/10",
        accentColor: "text-green-500",
        accentBg: "bg-green-500/10",
      },
      "Injured/Ill Subject": {
        color: "text-green-500",
        emoji: "🤕",
        bgGradient: "from-green-500/5 to-green-500/10",
        accentColor: "text-green-500",
        accentBg: "bg-green-500/10",
      },
      "Injured Subject": {
        color: "text-green-500",
        emoji: "🤕",
        bgGradient: "from-green-500/5 to-green-500/10",
        accentColor: "text-green-500",
        accentBg: "bg-green-500/10",
      },
      "Injured Person": {
        color: "text-green-500",
        emoji: "🤕",
        bgGradient: "from-green-500/5 to-green-500/10",
        accentColor: "text-green-500",
        accentBg: "bg-green-500/10",
      },
      "Emergency Medical Call": {
        color: "text-green-500",
        emoji: "🚑",
        bgGradient: "from-green-500/5 to-green-500/10",
        accentColor: "text-green-500",
        accentBg: "bg-green-500/10",
      },
      "Assist Medic": {
        color: "text-green-500",
        emoji: "🚑",
        bgGradient: "from-green-500/5 to-green-500/10",
        accentColor: "text-green-500",
        accentBg: "bg-green-500/10",
      },
      Suicide: {
        color: "text-green-600",
        emoji: "💔",
        bgGradient: "from-green-600/5 to-green-600/10",
        accentColor: "text-green-600",
        accentBg: "bg-green-600/10",
      },
      "Suicide Attempt": {
        color: "text-green-600",
        emoji: "💔",
        bgGradient: "from-green-600/5 to-green-600/10",
        accentColor: "text-green-600",
        accentBg: "bg-green-600/10",
      },
      "Suicide Ideation": {
        color: "text-green-600",
        emoji: "💭",
        bgGradient: "from-green-600/5 to-green-600/10",
        accentColor: "text-green-600",
        accentBg: "bg-green-600/10",
      },
      "Drug Overdose": {
        color: "text-green-600",
        emoji: "💊",
        bgGradient: "from-green-600/5 to-green-600/10",
        accentColor: "text-green-600",
        accentBg: "bg-green-600/10",
      },
      Overdose: {
        color: "text-green-600",
        emoji: "💊",
        bgGradient: "from-green-600/5 to-green-600/10",
        accentColor: "text-green-600",
        accentBg: "bg-green-600/10",
      },
      "Health and Safety": {
        color: "text-green-400",
        emoji: "🏥",
        bgGradient: "from-green-400/5 to-green-400/10",
        accentColor: "text-green-400",
        accentBg: "bg-green-400/10",
      },
      "Intoxicated Person": {
        color: "text-green-400",
        emoji: "🍺",
        bgGradient: "from-green-400/5 to-green-400/10",
        accentColor: "text-green-400",
        accentBg: "bg-green-400/10",
      },
      "Intoxicated Subject": {
        color: "text-green-400",
        emoji: "🍺",
        bgGradient: "from-green-400/5 to-green-400/10",
        accentColor: "text-green-400",
        accentBg: "bg-green-400/10",
      },
      "Intoxicated/Disorderly": {
        color: "text-green-400",
        emoji: "🍺",
        bgGradient: "from-green-400/5 to-green-400/10",
        accentColor: "text-green-400",
        accentBg: "bg-green-400/10",
      },
      "Intoxicated/Disorderly Person": {
        color: "text-green-400",
        emoji: "🍺",
        bgGradient: "from-green-400/5 to-green-400/10",
        accentColor: "text-green-400",
        accentBg: "bg-green-400/10",
      },
      "Intoxicated/Disorderly Subject": {
        color: "text-green-400",
        emoji: "🍺",
        bgGradient: "from-green-400/5 to-green-400/10",
        accentColor: "text-green-400",
        accentBg: "bg-green-400/10",
      },
      "Intoxicated/Disorderly Subject/Arrest": {
        color: "text-green-400",
        emoji: "🍺",
        bgGradient: "from-green-400/5 to-green-400/10",
        accentColor: "text-green-400",
        accentBg: "bg-green-400/10",
      },

      "Elevator Call": {
        color: "text-cyan-500",
        emoji: "🛗",
        bgGradient: "from-cyan-500/5 to-cyan-500/10",
        accentColor: "text-cyan-500",
        accentBg: "bg-cyan-500/10",
      },
      "Elevator Emergency": {
        color: "text-cyan-500",
        emoji: "🛗",
        bgGradient: "from-cyan-500/5 to-cyan-500/10",
        accentColor: "text-cyan-500",
        accentBg: "bg-cyan-500/10",
      },
      "Elevator Emergency Call": {
        color: "text-cyan-500",
        emoji: "🛗",
        bgGradient: "from-cyan-500/5 to-cyan-500/10",
        accentColor: "text-cyan-500",
        accentBg: "bg-cyan-500/10",
      },
      "Disabled Elevator": {
        color: "text-cyan-500",
        emoji: "🛗",
        bgGradient: "from-cyan-500/5 to-cyan-500/10",
        accentColor: "text-cyan-500",
        accentBg: "bg-cyan-500/10",
      },
      "Elevator Entrapment": {
        color: "text-cyan-500",
        emoji: "⚠️",
        bgGradient: "from-cyan-500/5 to-cyan-500/10",
        accentColor: "text-cyan-500",
        accentBg: "bg-cyan-500/10",
      },
      "Commercial Alarm": {
        color: "text-cyan-400",
        emoji: "🚨",
        bgGradient: "from-cyan-400/5 to-cyan-400/10",
        accentColor: "text-cyan-400",
        accentBg: "bg-cyan-400/10",
      },
      "Commercial Alarm/Arrest": {
        color: "text-cyan-400",
        emoji: "🚨",
        bgGradient: "from-cyan-400/5 to-cyan-400/10",
        accentColor: "text-cyan-400",
        accentBg: "bg-cyan-400/10",
      },
      "Panic Alarm": {
        color: "text-cyan-400",
        emoji: "🆘",
        bgGradient: "from-cyan-400/5 to-cyan-400/10",
        accentColor: "text-cyan-400",
        accentBg: "bg-cyan-400/10",
      },
      "Emergency Call": {
        color: "text-cyan-400",
        emoji: "🆘",
        bgGradient: "from-cyan-400/5 to-cyan-400/10",
        accentColor: "text-cyan-400",
        accentBg: "bg-cyan-400/10",
      },
      "Utilities Outage": {
        color: "text-cyan-600",
        emoji: "💡",
        bgGradient: "from-cyan-600/5 to-cyan-600/10",
        accentColor: "text-cyan-600",
        accentBg: "bg-cyan-600/10",
      },
      "Assist Fire": {
        color: "text-cyan-600",
        emoji: "🚒",
        bgGradient: "from-cyan-600/5 to-cyan-600/10",
        accentColor: "text-cyan-600",
        accentBg: "bg-cyan-600/10",
      },
      "Assist CFD": {
        color: "text-cyan-600",
        emoji: "🚒",
        bgGradient: "from-cyan-600/5 to-cyan-600/10",
        accentColor: "text-cyan-600",
        accentBg: "bg-cyan-600/10",
      },
      "Assist Charlotte Fire": {
        color: "text-cyan-600",
        emoji: "🚒",
        bgGradient: "from-cyan-600/5 to-cyan-600/10",
        accentColor: "text-cyan-600",
        accentBg: "bg-cyan-600/10",
      },
      "Assist Charlotte Fire Department": {
        color: "text-cyan-600",
        emoji: "🚒",
        bgGradient: "from-cyan-600/5 to-cyan-600/10",
        accentColor: "text-cyan-600",
        accentBg: "bg-cyan-600/10",
      },
      "Assist Charlotte Fire Dept.": {
        color: "text-cyan-600",
        emoji: "🚒",
        bgGradient: "from-cyan-600/5 to-cyan-600/10",
        accentColor: "text-cyan-600",
        accentBg: "bg-cyan-600/10",
      },

      "Assist Other Agency": {
        color: "text-indigo-500",
        emoji: "🤝",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      Assist: {
        color: "text-indigo-500",
        emoji: "🤝",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      Admit: {
        color: "text-indigo-500",
        emoji: "🤝",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      "Assist Other": {
        color: "text-indigo-500",
        emoji: "🤝",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      "Assist CMPD": {
        color: "text-indigo-500",
        emoji: "🚔",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      "Campus Safety": {
        color: "text-indigo-500",
        emoji: "🏫",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      "Campus Safety/Arrest": {
        color: "text-indigo-500",
        emoji: "🏫",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      "Campus Safety/Property": {
        color: "text-indigo-500",
        emoji: "🏫",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      "Campus Safety/Property Damage": {
        color: "text-indigo-500",
        emoji: "🏫",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      "Campus Safety/Property Theft": {
        color: "text-indigo-500",
        emoji: "🏫",
        bgGradient: "from-indigo-500/5 to-indigo-500/10",
        accentColor: "text-indigo-500",
        accentBg: "bg-indigo-500/10",
      },
      Escort: {
        color: "text-indigo-400",
        emoji: "👮",
        bgGradient: "from-indigo-400/5 to-indigo-400/10",
        accentColor: "text-indigo-400",
        accentBg: "bg-indigo-400/10",
      },
      "Serving Papers": {
        color: "text-indigo-400",
        emoji: "📄",
        bgGradient: "from-indigo-400/5 to-indigo-400/10",
        accentColor: "text-indigo-400",
        accentBg: "bg-indigo-400/10",
      },
      "911 Hang Up": {
        color: "text-indigo-300",
        emoji: "📞",
        bgGradient: "from-indigo-300/5 to-indigo-300/10",
        accentColor: "text-indigo-300",
        accentBg: "bg-indigo-300/10",
      },

      "Verbal Confrontation": {
        color: "text-pink-500",
        emoji: "🗣️",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      Harassment: {
        color: "text-pink-500",
        emoji: "😠",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Harassment/Arrest": {
        color: "text-pink-500",
        emoji: "😠",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Communicating Threats": {
        color: "text-pink-500",
        emoji: "😡",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Communicating Threats/Property": {
        color: "text-pink-500",
        emoji: "😡",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Communicating Threats/Property Damage": {
        color: "text-pink-500",
        emoji: "😡",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Communicating Threats/Property Theft": {
        color: "text-pink-500",
        emoji: "😡",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Communicating Threats/Arrest": {
        color: "text-pink-500",
        emoji: "😡",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Disorderly Conduct": {
        color: "text-pink-500",
        emoji: "🗯️",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Disorderly Conduct/Arrest": {
        color: "text-pink-500",
        emoji: "🗯️",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      Disturbance: {
        color: "text-pink-500",
        emoji: "🗣️",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Disturbance/Arrest": {
        color: "text-pink-500",
        emoji: "🗣️",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Domestic Disturbance": {
        color: "text-pink-500",
        emoji: "🏠",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Domestic Violence": {
        color: "text-pink-500",
        emoji: "🏠",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Domestic Violence/Arrest": {
        color: "text-pink-500",
        emoji: "🏠",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      Domestic: {
        color: "text-pink-500",
        emoji: "🏠",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      "Domestic Dispute": {
        color: "text-pink-500",
        emoji: "🏠",
        bgGradient: "from-pink-500/5 to-pink-500/10",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500/10",
      },
      Assault: {
        color: "text-pink-600",
        emoji: "👊",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Assault/Arrest": {
        color: "text-pink-600",
        emoji: "👊",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Assault/Battery": {
        color: "text-pink-600",
        emoji: "👊",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Assault/Battery/Arrest": {
        color: "text-pink-600",
        emoji: "👊",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Sexual Assault": {
        color: "text-pink-600",
        emoji: "⚠️",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Sexual Assault/Arrest": {
        color: "text-pink-600",
        emoji: "⚠️",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Sexual Offense": {
        color: "text-pink-600",
        emoji: "⚠️",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Shots Fired": {
        color: "text-pink-600",
        emoji: "🔫",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Shots Fired/Arrest": {
        color: "text-pink-600",
        emoji: "🔫",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      Stalking: {
        color: "text-pink-600",
        emoji: "👁️",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Stalking/Arrest": {
        color: "text-pink-600",
        emoji: "👁️",
        bgGradient: "from-pink-600/5 to-pink-600/10",
        accentColor: "text-pink-600",
        accentBg: "bg-pink-600/10",
      },
      "Indecent Exposure": {
        color: "text-pink-400",
        emoji: "🙈",
        bgGradient: "from-pink-400/5 to-pink-400/10",
        accentColor: "text-pink-400",
        accentBg: "bg-pink-400/10",
      },
      "Indecent Exposure/Arrest": {
        color: "text-pink-400",
        emoji: "🙈",
        bgGradient: "from-pink-400/5 to-pink-400/10",
        accentColor: "text-pink-400",
        accentBg: "bg-pink-400/10",
      },

      "Drug Related": {
        color: "text-rose-500",
        emoji: "💊",
        bgGradient: "from-rose-500/5 to-rose-500/10",
        accentColor: "text-rose-500",
        accentBg: "bg-rose-500/10",
      },
      "Drug Related/Arrest": {
        color: "text-rose-500",
        emoji: "💊",
        bgGradient: "from-rose-500/5 to-rose-500/10",
        accentColor: "text-rose-500",
        accentBg: "bg-rose-500/10",
      },
      "Drug Activity": {
        color: "text-rose-500",
        emoji: "💊",
        bgGradient: "from-rose-500/5 to-rose-500/10",
        accentColor: "text-rose-500",
        accentBg: "bg-rose-500/10",
      },
      "Drug Activity/Arrest": {
        color: "text-rose-500",
        emoji: "💊",
        bgGradient: "from-rose-500/5 to-rose-500/10",
        accentColor: "text-rose-500",
        accentBg: "bg-rose-500/10",
      },
      Drug: {
        color: "text-rose-500",
        emoji: "💊",
        bgGradient: "from-rose-500/5 to-rose-500/10",
        accentColor: "text-rose-500",
        accentBg: "bg-rose-500/10",
      },
      "Missing Person": {
        color: "text-rose-400",
        emoji: "❓",
        bgGradient: "from-rose-400/5 to-rose-400/10",
        accentColor: "text-rose-400",
        accentBg: "bg-rose-400/10",
      },
      "Missing Subject": {
        color: "text-rose-400",
        emoji: "❓",
        bgGradient: "from-rose-400/5 to-rose-400/10",
        accentColor: "text-rose-400",
        accentBg: "bg-rose-400/10",
      },
      "Missing Child": {
        color: "text-rose-400",
        emoji: "👶",
        bgGradient: "from-rose-400/5 to-rose-400/10",
        accentColor: "text-rose-400",
        accentBg: "bg-rose-400/10",
      },
      "Animal Control": {
        color: "text-rose-300",
        emoji: "🐕",
        bgGradient: "from-rose-300/5 to-rose-300/10",
        accentColor: "text-rose-300",
        accentBg: "bg-rose-300/10",
      },
      Noise: {
        color: "text-rose-300",
        emoji: "📢",
        bgGradient: "from-rose-300/5 to-rose-300/10",
        accentColor: "text-rose-300",
        accentBg: "bg-rose-300/10",
      },
      "Noise Complaint": {
        color: "text-rose-300",
        emoji: "📢",
        bgGradient: "from-rose-300/5 to-rose-300/10",
        accentColor: "text-rose-300",
        accentBg: "bg-rose-300/10",
      },
      Solicitation: {
        color: "text-rose-300",
        emoji: "📋",
        bgGradient: "from-rose-300/5 to-rose-300/10",
        accentColor: "text-rose-300",
        accentBg: "bg-rose-300/10",
      },
      "Solicitation/Arrest": {
        color: "text-rose-300",
        emoji: "📋",
        bgGradient: "from-rose-300/5 to-rose-300/10",
        accentColor: "text-rose-300",
        accentBg: "bg-rose-300/10",
      },
      Arrest: {
        color: "text-rose-400",
        emoji: "🚓",
        bgGradient: "from-rose-400/5 to-rose-400/10",
        accentColor: "text-rose-400",
        accentBg: "bg-rose-400/10",
      },

      Default: {
        color: "text-gray-500",
        emoji: "❗",
        bgGradient: "from-gray-500/5 to-gray-500/10",
        accentColor: "text-gray-500",
        accentBg: "bg-gray-500/10",
      },
    };

    return themes[type] || themes.Default;
  };

  const theme = incident
    ? getIncidentTheme(incident.incident_type)
    : getIncidentTheme("Default");

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !incident) return;

    const colors = [
      "#FF4B66",
      "#3B82F6",
      "#10B981",
      "#8B5CF6",
      "#F59E0B",
      "#EC4899",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    try {
      const { error } = await addComment(incident.id, commentText, randomColor);

      if (error) {
        console.error("Error adding comment:", error);
        return;
      }

      const { data: refreshedComments } = await getIncidentComments(
        incident.id
      );
      if (refreshedComments) {
        setComments(refreshedComments);
      }

      setCommentText("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const handleVote = async (
    id: string,
    increment: number,
    previousVote: number
  ) => {
    try {
      let newVoteState = 0;

      if (previousVote === 0) {
        newVoteState = increment > 0 ? 1 : -1;
      } else if (previousVote === 1 && increment < 0) {
        newVoteState = 0;
      } else if (previousVote === -1 && increment > 0) {
        newVoteState = 0;
      } else {
        newVoteState = increment > 0 ? 1 : -1;
      }

      const voteChange = newVoteState - previousVote;
      const updatedUserVotes = { ...userVotes };

      if (newVoteState === 0) {
        delete updatedUserVotes[id];
      } else {
        updatedUserVotes[id] = newVoteState;
      }

      const storageKey = `vote_${incident?.id}_${id}`;

      if (newVoteState !== 0) {
        localStorage.setItem(storageKey, newVoteState.toString());
      } else {
        localStorage.removeItem(storageKey);
      }

      setUserVotes(updatedUserVotes);

      const { error } = await updateCommentVotes(id, voteChange);

      if (error) {
        console.error("Error updating votes:", error);
        return;
      }

      const updateCommentVotesRecursive = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === id) {
            return { ...comment, votes: comment.votes + voteChange };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentVotesRecursive(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateCommentVotesRecursive([...comments]));

      if (continuedThreadComment) {
        const updateContinuedThreadVotes = (comment: Comment): Comment => {
          if (comment.id === id) {
            return { ...comment, votes: comment.votes + voteChange };
          }

          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                updateContinuedThreadVotes(reply)
              ),
            };
          }

          return comment;
        };

        setContinuedThreadComment(
          updateContinuedThreadVotes({ ...continuedThreadComment })
        );
      }

      if (continuedThreadComment && originalThreadState) {
        const updateVotesInOriginalState = (comments: Comment[]): Comment[] => {
          return comments.map((c) => {
            if (c.id === id) {
              return { ...c, votes: c.votes + voteChange };
            } else if (c.replies && c.replies.length > 0) {
              return {
                ...c,
                replies: updateVotesInOriginalState(c.replies),
              };
            }
            return c;
          });
        };

        setOriginalThreadState(
          updateVotesInOriginalState([...originalThreadState])
        );
      }
    } catch (err) {
      console.error("Error voting on comment:", err);
    }
  };

  const handleReply = async (
    parentId: string,
    replyToId: string,
    replyText: string
  ) => {
    if (!replyText.trim() || !incident) return;

    const colors = [
      "#FF4B66",
      "#3B82F6",
      "#10B981",
      "#8B5CF6",
      "#F59E0B",
      "#EC4899",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    try {
      const { error } = await addReply(
        incident.id,
        parentId,
        replyToId,
        replyText,
        randomColor
      );

      if (error) {
        console.error("Error adding reply:", error);
        return;
      }

      const { data: refreshedComments } = await getIncidentComments(
        incident.id
      );

      if (refreshedComments) {
        setComments(refreshedComments);

        if (continuedThreadComment) {
          const findUpdatedThreadComment = (
            comments: Comment[]
          ): Comment | null => {
            for (const comment of comments) {
              if (comment.id === continuedThreadComment.id) {
                return comment;
              }

              if (comment.replies && comment.replies.length > 0) {
                const found = findUpdatedThreadComment(comment.replies);
                if (found) return found;
              }
            }
            return null;
          };

          const updatedThreadComment =
            findUpdatedThreadComment(refreshedComments);
          if (updatedThreadComment) {
            setContinuedThreadComment(updatedThreadComment);
          }
        }
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
    }
  };

  const [threadHistory, setThreadHistory] = useState<
    {
      comment: Comment;
      originalState: Comment[];
    }[]
  >([]);

  const handleContinueThread = (comment: Comment) => {
    if (continuedThreadComment) {
      setThreadHistory([
        ...threadHistory,
        {
          comment: continuedThreadComment,
          originalState: originalThreadState || [],
        },
      ]);
    } else if (!originalThreadState) {
      setOriginalThreadState([...comments]);
    }

    setContinuedThreadComment(comment);
  };

  const handleBackToThread = () => {
    if (threadHistory.length > 0) {
      const newHistory = [...threadHistory];
      const lastEntry = newHistory.pop();

      setContinuedThreadComment(lastEntry?.comment || null);
      setThreadHistory(newHistory);
    } else if (originalThreadState) {
      setComments(originalThreadState);
      setContinuedThreadComment(null);
      setOriginalThreadState(null);
    }
  };

  const getTotalCommentCount = () => {
    let count = comments.length;
    comments.forEach((comment) => {
      if (comment.replies) {
        count += getTotalRepliesCount(comment);
      }
    });
    return count;
  };

  const getTotalVotes = () => {
    const countVotesRecursively = (comments: Comment[]): number => {
      return comments.reduce((sum, comment) => {
        let total = sum + comment.votes;
        if (comment.replies && comment.replies.length > 0) {
          total += countVotesRecursively(comment.replies);
        }
        return total;
      }, 0);
    };

    return countVotesRecursively(comments);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Button>
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
              >
                <path d="M12 19l-7-7 7-7"></path>
              </svg>
              Back
            </Button>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.share
                  ? navigator
                      .share({
                        title: incident
                          ? `NinerWatch: ${incident.incident_type} Incident`
                          : "NinerWatch Incident",
                        text: incident
                          ? `Check out this ${incident.incident_type} incident at ${incident.incident_location}`
                          : "Check out this incident on NinerWatch",
                        url: window.location.href,
                      })
                      .catch((err) => console.log("Error sharing", err))
                  : navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => {
                        alert("Link copied to clipboard!");
                      });
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>
          </div>
        </div>

        {loading ? (
          <IncidentSkeleton />
        ) : error ? (
          <div className="py-20 text-center">
            <div className="inline-block bg-red-500/10 rounded-full h-20 w-20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : incident ? (
          <div className="space-y-6">
            <div
              className={`rounded-xl overflow-hidden bg-gradient-to-r ${theme.bgGradient} p-6 backdrop-blur-sm shadow-md`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div
                  className={`flex-shrink-0 h-24 w-24 rounded-xl flex items-center justify-center text-4xl ${theme.color} bg-black/20`}
                >
                  {theme.emoji}
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${theme.color} bg-${theme.color} backdrop-blur-sm`}
                    >
                      {incident.incident_type}
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-secondary/60 backdrop-blur-sm">
                      {incident.disposition || "Open"}
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Incident at {incident.incident_location}
                  </h1>
                  <div className="text-sm text-muted-foreground">
                    Reported {formatDate(incident.time_reported)} • Report #
                    {incident.report_number}
                  </div>
                  <p className="pt-2 text-muted-foreground">
                    {incident.incident_description ||
                      "No description available."}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-border">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("community")}
                  className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "community"
                      ? `border-b-2 border-${theme.color.split("-")[1]} ${
                          theme.accentColor
                        }`
                      : "text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
                  }`}
                >
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
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Community Discussion
                  <span className="bg-secondary/80 text-xs px-2 py-0.5 rounded-full">
                    {getTotalCommentCount()}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "details"
                      ? `border-b-2 border-${theme.color.split("-")[1]} ${
                          theme.accentColor
                        }`
                      : "text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
                  }`}
                >
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
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Incident Details
                </button>
              </div>
            </div>

            {activeTab === "community" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={theme.accentColor}
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Say Something
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form
                        onSubmit={handleCommentSubmit}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-full ${theme.accentBg} flex items-center justify-center text-white text-sm font-bold`}
                          >
                            A
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Anonymous Niner</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Your comments are anonymous
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <textarea
                            className="w-full rounded-lg bg-secondary/30 border-secondary p-3 text-sm h-20 focus:outline-none focus:ring-1 focus:ring-primary/40"
                            placeholder="Share info or comment on this incident... (Your identity will remain anonymous)"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          ></textarea>
                          <div className="absolute bottom-3 right-3 flex gap-2">
                            <button
                              type="submit"
                              className={`${theme.accentBg} text-white px-4 py-1 rounded-md font-semibold text-sm hover:opacity-90 transition-colors`}
                              disabled={!commentText.trim()}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Please follow community guidelines. Offensive or
                          harmful content will be removed.
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4 px-1">
                      <h2 className="text-lg font-semibold">
                        Comments ({getTotalCommentCount()})
                      </h2>
                      <div className="flex gap-3">
                        <button className={`text-sm ${theme.accentColor}`}>
                          Top
                        </button>
                        <button className="text-sm text-muted-foreground hover:text-foreground">
                          Latest
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {loadingComments ? (
                        <Card>
                          <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">
                              Loading comments...
                            </p>
                          </CardContent>
                        </Card>
                      ) : comments.length === 0 ? (
                        <Card>
                          <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">
                              Be the first to comment on this incident
                            </p>
                          </CardContent>
                        </Card>
                      ) : continuedThreadComment ? (
                        <CommentComponent
                          key={continuedThreadComment.id}
                          comment={continuedThreadComment}
                          onVote={handleVote}
                          onReply={handleReply}
                          theme={theme}
                          userVotes={userVotes}
                          isPartOfContinuedThread={true}
                          onBackToThread={handleBackToThread}
                          onContinueThread={handleContinueThread}
                        />
                      ) : (
                        comments.map((comment) => (
                          <CommentComponent
                            key={comment.id}
                            comment={comment}
                            onVote={handleVote}
                            onReply={handleReply}
                            theme={theme}
                            userVotes={userVotes}
                            onContinueThread={handleContinueThread}
                          />
                        ))
                      )}
                    </div>

                    {comments.length > 5 && (
                      <div className="mt-4 flex justify-center">
                        <button className="text-sm bg-secondary/50 hover:bg-secondary px-4 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                          Show more comments
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <Card className="overflow-hidden">
                    <div className="h-[250px] w-full relative">
                      <IncidentDetailMap incident={incident} />
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md shadow-lg bg-opacity-90 text-white px-3 py-1.5 rounded-lg text-sm">
                        {incident.incident_location}
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={theme.accentColor}
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Community Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-secondary/30 p-3 rounded-lg text-center">
                            <div
                              className={`text-2xl font-bold ${theme.accentColor}`}
                            >
                              {getTotalCommentCount()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Comments
                            </div>
                          </div>
                          <div className="bg-secondary/30 p-3 rounded-lg text-center">
                            <div
                              className={`text-2xl font-bold ${theme.accentColor}`}
                            >
                              23
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Views
                            </div>
                          </div>
                          <div className="bg-secondary/30 p-3 rounded-lg text-center">
                            <div
                              className={`text-2xl font-bold ${theme.accentColor}`}
                            >
                              5
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Shares
                            </div>
                          </div>
                          <div className="bg-secondary/30 p-3 rounded-lg text-center">
                            <div
                              className={`text-2xl font-bold ${theme.accentColor}`}
                            >
                              {getTotalVotes()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Total Votes
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                          <div className="text-sm text-muted-foreground mb-2">
                            Most Active Users
                          </div>
                          <div className="flex -space-x-2">
                            {loadingComments ? (
                              <div className="text-xs text-muted-foreground">
                                Loading user data...
                              </div>
                            ) : (
                              <>
                                {comments.slice(0, 5).map((comment, index) => (
                                  <div
                                    key={index}
                                    className="h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                                    style={{
                                      backgroundColor: comment.user_color,
                                    }}
                                  >
                                    A
                                  </div>
                                ))}
                                {getTotalCommentCount() > 5 && (
                                  <div className="h-8 w-8 rounded-full border-2 border-background bg-secondary/50 flex items-center justify-center text-xs font-medium">
                                    +{getTotalCommentCount() - 5}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Quick Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            Incident Type:
                          </div>
                          <div
                            className={`text-sm font-medium ${theme.accentColor}`}
                          >
                            {incident.incident_type}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            Status:
                          </div>
                          <div className="text-sm font-medium">
                            {incident.disposition || "Open"}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            Reported:
                          </div>
                          <div className="text-sm font-medium">
                            {formatDate(incident.time_reported)}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            Report #:
                          </div>
                          <div className="text-sm font-mono">
                            {incident.report_number}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="overflow-hidden">
                    <div className="h-[400px] w-full relative">
                      <IncidentDetailMap incident={incident} />
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md shadow-lg bg-opacity-90 text-white px-3 py-1.5 rounded-lg text-sm">
                        {incident.incident_location}
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Incident Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Incident Type
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{theme.emoji}</span>
                            <span
                              className={`font-medium ${theme.accentColor}`}
                            >
                              {incident.incident_type}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Location
                          </div>
                          <div className="font-medium">
                            {incident.incident_location}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Reported Time
                          </div>
                          <div className="font-medium">
                            {formatDate(incident.time_reported)}
                          </div>
                        </div>

                        {incident.time_of_occurrence && (
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Occurred Time
                            </div>
                            <div className="font-medium">
                              {formatDate(incident.time_of_occurrence)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-border space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Description
                        </div>
                        <p className="text-foreground">
                          {incident.incident_description ||
                            "No description available."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Status Update</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              incident.disposition === "Closed"
                                ? "bg-green-500/10"
                                : theme.accentBg
                            }`}
                          >
                            {incident.disposition === "Closed" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-500"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={theme.accentColor}
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {incident.disposition || "Under Investigation"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Current Status
                            </div>
                          </div>
                        </div>

                        <div className="bg-secondary/50 rounded-lg p-4">
                          {incident.disposition ? (
                            <p className="text-sm">
                              This incident has been marked as{" "}
                              <span className="font-medium">
                                {incident.disposition}
                              </span>
                              . No further updates are expected.
                            </p>
                          ) : (
                            <p className="text-sm">
                              This incident is currently under investigation.
                              Status updates will be posted as they become
                              available.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Additional Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Report Number
                            </div>
                            <div className="font-mono bg-secondary/50 rounded px-2 py-1 text-sm">
                              {incident.report_number}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Date Reported
                            </div>
                            <div>{incident.date_reported}</div>
                          </div>

                          {incident.time_secured && (
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">
                                Time Secured
                              </div>
                              <div>{formatDate(incident.time_secured)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <button
                      onClick={() => setActiveTab("community")}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md ${theme.accentBg} ${theme.accentColor} hover:opacity-90 transition-colors`}
                    >
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
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Join the Discussion ({getTotalCommentCount()} comments)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-block bg-secondary rounded-full h-20 w-20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className="text-muted-foreground mb-2">
              Incident not found. Please check the report number and try again.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
