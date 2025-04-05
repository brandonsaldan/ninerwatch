"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import { supabase, Incident } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { CampusMap } from "@/components/map/campus-map";

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

  const [comments, setComments] = useState([
    {
      id: "1",
      text: "Comment 1",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      votes: 12,
      userColor: "#FF4B66",
    },
    {
      id: "2",
      text: "Comment 2",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      votes: 7,
      userColor: "#3B82F6",
    },
    {
      id: "3",
      text: "Comment 3",
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      votes: 4,
      userColor: "#10B981",
    },
  ]);

  useEffect(() => {
    const fetchIncident = async () => {
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
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error fetching incident:", errorMessage);
        setError("Failed to load incident details.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [originalReportNumber]);

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
      Theft: {
        color: "text-yellow-500",
        emoji: "💰",
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

      "Lost or Stolen": {
        color: "text-purple-500",
        emoji: "🔎",
        bgGradient: "from-purple-500/5 to-purple-500/10",
        accentColor: "text-purple-500",
        accentBg: "bg-purple-500/10",
      },

      "Accident/Property": {
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
      "Hit and Run": {
        color: "text-orange-500",
        emoji: "🚙",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Hit and Run/Property": {
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
      Crash: {
        color: "text-orange-500",
        emoji: "💥",
        bgGradient: "from-orange-500/5 to-orange-500/10",
        accentColor: "text-orange-500",
        accentBg: "bg-orange-500/10",
      },
      "Parking Violation": {
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

      "Suspicious Person": {
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
      Investigate: {
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
      Loitering: {
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

      "Damage to Property": {
        color: "text-red-500",
        emoji: "🏚️",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
      },
      Vandalism: {
        color: "text-red-500",
        emoji: "🏚️",
        bgGradient: "from-red-500/5 to-red-500/10",
        accentColor: "text-red-500",
        accentBg: "bg-red-500/10",
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
      Suicide: {
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
      "Intoxicated Person": {
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
      "Panic Alarm": {
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

      "Assist Other Agency": {
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
      Assault: {
        color: "text-pink-600",
        emoji: "👊",
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

      "Drug Related": {
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const colors = [
      "#FF4B66",
      "#3B82F6",
      "#10B981",
      "#8B5CF6",
      "#F59E0B",
      "#EC4899",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: new Date().toISOString(),
      votes: 0,
      userColor: randomColor,
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleVote = (id: string, increment: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? { ...comment, votes: comment.votes + increment }
          : comment
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
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
          <div className="py-20 text-center">
            <div className="inline-block animate-pulse bg-secondary rounded-full h-20 w-20 flex items-center justify-center mb-4">
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
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <p className="text-muted-foreground">Loading incident details...</p>
          </div>
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
                      : "text-muted-foreground hover:text-foreground"
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
                    {comments.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "details"
                      ? `border-b-2 border-${theme.color.split("-")[1]} ${
                          theme.accentColor
                        }`
                      : "text-muted-foreground hover:text-foreground"
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
                              className={`${theme.accentBg} text-white rounded-full px-4 py-1 text-sm font-medium hover:opacity-90 transition-colors`}
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
                        Comments ({comments.length})
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
                      {comments.length === 0 ? (
                        <Card>
                          <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">
                              Be the first to comment on this incident
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        comments.map((comment) => (
                          <Card key={comment.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex gap-3">
                                <div
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                  style={{ backgroundColor: comment.userColor }}
                                >
                                  A
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="font-medium text-sm">
                                      Anonymous Niner
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatDate(comment.timestamp)}
                                    </div>
                                  </div>
                                  <div className="text-sm mb-3">
                                    {comment.text}
                                  </div>
                                  <div className="flex gap-4 text-xs">
                                    <button
                                      onClick={() => handleVote(comment.id, 1)}
                                      className={`flex items-center gap-1 text-muted-foreground hover:${theme.accentColor} transition-colors`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M12 8L18 14M12 8L6 14M12 8V20M6 4H18" />
                                      </svg>
                                      Upvote
                                    </button>
                                    <span className="text-muted-foreground">
                                      {comment.votes} votes
                                    </span>
                                    <button
                                      onClick={() => handleVote(comment.id, -1)}
                                      className={`flex items-center gap-1 text-muted-foreground hover:${theme.accentColor} transition-colors`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M12 16L18 10M12 16L6 10M12 16V4M6 20H18" />
                                      </svg>
                                      Downvote
                                    </button>
                                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                                      Reply
                                    </button>
                                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                                      Report
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
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
                      <CampusMap incidentId={incident.id} />
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
                              {comments.length}
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
                              {comments.reduce(
                                (sum, comment) => sum + comment.votes,
                                0
                              )}
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
                            {comments.slice(0, 5).map((comment, index) => (
                              <div
                                key={index}
                                className="h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: comment.userColor }}
                              >
                                A
                              </div>
                            ))}
                            {comments.length > 5 && (
                              <div className="h-8 w-8 rounded-full border-2 border-background bg-secondary/50 flex items-center justify-center text-xs font-medium">
                                +{comments.length - 5}
                              </div>
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
                      <CampusMap incidentId={incident.id} />
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
                      Join the Discussion ({comments.length} comments)
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
