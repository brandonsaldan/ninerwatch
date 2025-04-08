"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import { useIncidents } from "@/context/incidents-context";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function StatisticsPage() {
  const { incidents, loading, error, incidentTypes } = useIncidents();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "all">(
    "month"
  );
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const filteredIncidents = useMemo(() => {
    if (timeRange === "all") return incidents;

    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === "week") {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === "month") {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === "year") {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }

    return incidents.filter((incident) => {
      try {
        const incidentDate = new Date(incident.time_reported);
        return incidentDate >= cutoffDate;
      } catch {
        return false;
      }
    });
  }, [incidents, timeRange]);

  const incidentsByType = useMemo(() => {
    const counts: Record<string, number> = {};

    filteredIncidents.forEach((incident) => {
      counts[incident.incident_type] =
        (counts[incident.incident_type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredIncidents]);

  const incidentsByLocation = useMemo(() => {
    const counts: Record<string, number> = {};

    filteredIncidents.forEach((incident) => {
      counts[incident.incident_location] =
        (counts[incident.incident_location] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredIncidents]);

  const incidentsByHour = useMemo(() => {
    const hourCounts = Array(24).fill(0);

    filteredIncidents.forEach((incident) => {
      try {
        const time = incident.time_reported;
        const date = new Date(time);
        const hour = date.getHours();
        hourCounts[hour]++;
      } catch {}
    });

    return hourCounts;
  }, [filteredIncidents]);

  const incidentsByDay = useMemo(() => {
    const dayCounts = Array(7).fill(0);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    filteredIncidents.forEach((incident) => {
      try {
        const time = incident.time_reported;
        const date = new Date(time);
        const day = date.getDay();
        dayCounts[day]++;
      } catch {}
    });

    return dayCounts.map((count, index) => ({
      day: dayNames[index],
      count,
    }));
  }, [filteredIncidents]);

  const dangerIndex = useMemo(() => {
    const locationData: Record<
      string,
      { count: number; recency: number; severity: number }
    > = {};

    const severityWeights: Record<string, number> = {
      Larceny: 3,
      Burglary: 5,
      Assault: 8,
      Robbery: 7,
      "Drug Related": 4,
      "Suspicious Person": 2,
      "Suspicious Activity": 2,
      "Hit and Run": 4,
      "Vehicle Accident": 3,
      "Welfare Check": 1,
      "Damage to Property": 2,
      "Stolen Vehicle": 6,
    };

    const defaultWeight = 3;

    const now = new Date().getTime();

    filteredIncidents.forEach((incident) => {
      const location = incident.incident_location;

      if (!locationData[location]) {
        locationData[location] = { count: 0, recency: 0, severity: 0 };
      }

      locationData[location].count++;

      try {
        const incidentTime = new Date(incident.time_reported).getTime();
        const daysSince = (now - incidentTime) / (1000 * 60 * 60 * 24);
        const recencyFactor = Math.max(0, 30 - daysSince) / 30;
        locationData[location].recency += recencyFactor;
      } catch {}

      let severity = defaultWeight;

      Object.keys(severityWeights).forEach((key) => {
        if (incident.incident_type.includes(key)) {
          severity = severityWeights[key];
        }
      });

      locationData[location].severity += severity;
    });

    return Object.entries(locationData)
      .filter(([_, data]) => data.count >= 3)
      .map(([location, data]) => {
        const noise = Math.floor(Math.random() * 5);
        const dangerScore = Math.round(
          data.count *
            (data.severity / data.count) *
            (data.recency / data.count) +
            noise
        );

        return {
          location,
          score: Math.min(99, dangerScore),
          count: data.count,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [filteredIncidents]);

  const sketchyHours = useMemo(() => {
    const hourLabels = Array(24)
      .fill(0)
      .map((_, i) => {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const ampm = i < 12 ? "AM" : "PM";
        return `${hour}${ampm}`;
      });

    const hourCounts = [...incidentsByHour];
    const topHours = Array(24)
      .fill(0)
      .map((_, i) => i)
      .sort((a, b) => hourCounts[b] - hourCounts[a])
      .slice(0, 10);

    return topHours.map((hourIndex) => ({
      hour: hourLabels[hourIndex],
      count: hourCounts[hourIndex],
      riskScore: Math.min(
        99,
        Math.round(
          (hourCounts[hourIndex] / Math.max(...hourCounts)) * 90 +
            Math.random() * 10
        )
      ),
    }));
  }, [incidentsByHour]);

  const partyFoulIndex = useMemo(() => {
    const weekdayCount =
      incidentsByDay[1].count +
      incidentsByDay[2].count +
      incidentsByDay[3].count +
      incidentsByDay[4].count;
    const weekendCount =
      incidentsByDay[0].count +
      incidentsByDay[5].count +
      incidentsByDay[6].count;

    const weekdayAvg = weekdayCount / 4;
    const weekendAvg = weekendCount / 3;

    const ratio = weekendAvg / (weekdayAvg || 1);

    const noise = Math.random() * 0.4 - 0.2;
    const score = Math.min(99, Math.round(ratio * 50 + noise * 5));

    return {
      score,
      weekdayCount,
      weekendCount,
      ratio: ratio.toFixed(2),
    };
  }, [incidentsByDay]);

  const narcRating = useMemo(() => {
    const categories = {
      Theft: [
        "Larceny",
        "Burglary",
        "Stolen",
        "Theft",
        "Robbery",
        "Attempted Robbery",
        "Larceny of Laptop",
        "Larceny of Property",
        "Larceny of Vehicle",
        "Larceny of Vehicle Parts",
        "Lost or Stolen",
        "Motor Vehicle Theft",
      ],
      "Drug Related": [
        "Drug",
        "Marijuana",
        "Narcotic",
        "Drug Activity",
        "Drug Related",
        "Drug Overdose",
        "Overdose",
      ],
      Violence: [
        "Assault",
        "Fight",
        "Battery",
        "Weapon",
        "Assault/Battery",
        "Shots Fired",
        "Sexual Assault",
        "Sexual Offense",
        "Robbery/Attempted",
      ],
      "Suspicious Behavior": [
        "Suspicious",
        "Trespassing",
        "Loitering",
        "BOLO",
        "Suspicious Person",
        "Suspicious Vehicle",
        "Suspicious Activity",
        "Investigate",
        "Investigation",
        "Pedestrian Check",
        "Criminal Trespass",
      ],
      "Vehicle Related": [
        "Vehicle",
        "Parking",
        "Accident",
        "Hit and Run",
        "Traffic",
        "Vehicle Accident",
        "Vehicle Stop",
        "Traffic Stop",
        "Traffic Violation",
        "Parking Violation",
        "Illegal Parking",
        "Hit & Run",
        "Abandoned Vehicle",
        "Crash",
        "Disabled Vehicle",
        "Vehicle Lockout",
      ],
      "Alcohol Related": [
        "Intoxicated",
        "Alcohol",
        "Drunk",
        "Intoxicated Person",
        "Intoxicated Subject",
        "Intoxicated/Disorderly",
      ],
      Disturbance: [
        "Disturbance",
        "Noise",
        "Disorderly",
        "Disorderly Conduct",
        "Noise Complaint",
        "Verbal Confrontation",
        "Domestic Disturbance",
        "Domestic Dispute",
        "Domestic Violence",
      ],
      "Property Related": [
        "Property",
        "Damage",
        "Vandalism",
        "Property Damage",
        "Damage to Property",
        "Damage to Vehicle",
        "Criminal Damage",
        "Property Found",
        "Property Theft",
        "Lost Property",
        "Arson",
      ],
      "Safety and Welfare": [
        "Welfare",
        "Check",
        "Safety",
        "Welfare Check",
        "Health and Safety",
        "Campus Safety",
      ],
      Harassment: [
        "Harassment",
        "Stalking",
        "Threats",
        "Communicating Threats",
        "Indecent Exposure",
      ],
      Fraud: ["Fraud", "Identity", "Identity Theft", "Solicitation"],
      Medical: [
        "Medical",
        "Injured",
        "Illness",
        "Injured Subject",
        "Injured Person",
        "Injured/Ill Subject",
        "Emergency Medical Call",
        "Assist Medic",
        "Suicide",
        "Suicide Attempt",
        "Suicide Ideation",
      ],
      Fire: [
        "Fire",
        "Alarm",
        "Emergency",
        "Emergency Call",
        "Assist Fire",
        "Assist CFD",
        "Assist Charlotte Fire",
        "Commercial Alarm",
        "Panic Alarm",
        "Elevator Emergency",
        "Elevator Emergency Call",
        "Elevator Entrapment",
        "Utilities Outage",
      ],
      "Sex Offenses": [
        "Sexual",
        "Indecent",
        "Exposure",
        "Sexual Assault",
        "Sexual Offense",
        "Indecent Exposure",
      ],
      "Missing Persons": [
        "Missing",
        "Missing Person",
        "Missing Subject",
        "Missing Child",
        "Missing/Found Person",
        "Missing/Found Subject",
      ],
      "Animal Issues": ["Animal", "Animal Control"],
      Assistance: [
        "Assist",
        "Escort",
        "Assist Other",
        "Assist Other Agency",
        "Assist CMPD",
        "Serving Papers",
        "Follow Up",
      ],
    };

    const categoryData: Record<string, { count: number; reportRate: number }> =
      {};

    Object.keys(categories).forEach((category) => {
      categoryData[category] = { count: 0, reportRate: 0 };
    });

    filteredIncidents.forEach((incident) => {
      Object.entries(categories).forEach(([category, keywords]) => {
        for (const keyword of keywords) {
          if (incident.incident_type.includes(keyword)) {
            categoryData[category].count++;

            const descriptionLower = (
              incident.incident_description || ""
            ).toLowerCase();
            const isReported =
              descriptionLower.includes("reported") ||
              descriptionLower.includes("call") ||
              descriptionLower.includes("complaint");

            if (isReported) {
              categoryData[category].reportRate++;
            }

            break;
          }
        }
      });
    });

    return Object.entries(categoryData)
      .filter(([_, data]) => data.count >= 2)
      .map(([category, data]) => {
        const reportRate = data.count > 0 ? data.reportRate / data.count : 0;
        const weightedScore = data.count * 0.3 + reportRate * 70;
        const noise = Math.random() * 10 - 5;
        const narcScore = Math.min(
          99,
          Math.max(1, Math.round(weightedScore + noise))
        );

        return {
          category,
          narcScore,
          count: data.count,
        };
      })
      .sort((a, b) => b.narcScore - a.narcScore)
      .slice(0, 10);
  }, [filteredIncidents]);

  const insights = useMemo(
    () => [
      {
        text: `Students are ${partyFoulIndex.ratio}x more likely to get in trouble on weekends than weekdays.`,
        icon: "🎉",
        color: "pink",
      },
      {
        text: `${
          dangerIndex[0]?.location || "Unknown"
        } is officially the sketchiest place on campus with a Danger Score of ${
          dangerIndex[0]?.score
        }.`,
        icon: "⚠️",
        color: "yellow",
      },
      {
        text: `The most dangerous time to be on campus is ${sketchyHours[0]?.hour} with a Risk Score of ${sketchyHours[0]?.riskScore}.`,
        icon: "⏰",
        color: "purple",
      },
      {
        text: `${
          narcRating[0]?.category || "Unknown"
        } has the highest Narc Rating at ${
          narcRating[0]?.narcScore
        } - watch what you do!`,
        icon: "🚔",
        color: "green",
      },
      {
        text: `${
          incidentsByType[0]?.type || "Unknown"
        } is the most common incident type with ${
          incidentsByType[0]?.count
        } reports.`,
        icon: "📊",
        color: "blue",
      },
      {
        text: `Based on our data, avoid ${
          dangerIndex[
            Math.floor(Math.random() * Math.min(3, dangerIndex.length))
          ]?.location || "Unknown"
        } at ${
          sketchyHours[
            Math.floor(Math.random() * Math.min(3, sketchyHours.length))
          ]?.hour
        } unless you want trouble.`,
        icon: "👀",
        color: "red",
      },
      {
        text: `${
          incidentsByDay.sort((a, b) => b.count - a.count)[0]?.day || "Unknown"
        }s are the riskiest day of the week with ${
          incidentsByDay.sort((a, b) => b.count - a.count)[0]?.count || 0
        } incidents.`,
        icon: "📅",
        color: "indigo",
      },
      {
        text: `The "Safest" building on campus is ${
          incidentsByLocation.slice(-1)[0]?.location || "Unknown"
        } with only ${incidentsByLocation.slice(-1)[0]?.count || 0} incidents.`,
        icon: "🛡️",
        color: "emerald",
      },
    ],
    [
      dangerIndex,
      incidentsByDay,
      incidentsByLocation,
      incidentsByType,
      narcRating,
      partyFoulIndex,
      sketchyHours,
    ]
  );

  const getGradientClasses = (colorName: string) => {
    const colorMap: Record<string, string> = {
      red: "from-red-500/10 to-red-500/5 border-red-500/20",
      yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
      green: "from-green-500/10 to-green-500/5 border-green-500/20",
      blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
      purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
      pink: "from-pink-500/10 to-pink-500/5 border-pink-500/20",
      indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20",
      emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    };

    return (
      colorMap[colorName] || "from-gray-500/10 to-gray-500/5 border-gray-500/20"
    );
  };

  useEffect(() => {
    if (!autoRotate) return;

    const timer = setInterval(() => {
      setCurrentInsightIndex((prevIndex) =>
        prevIndex === insights.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [insights.length, autoRotate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-4xl flex items-center gap-2 font-bold mb-6 md:mb-0">
            <span className="text-blue-500">📊</span> Campus Statistics
          </h1>
          <div className="flex gap-3">
            <Select
              value={timeRange}
              onValueChange={(value) =>
                setTimeRange(value as "week" | "month" | "year" | "all")
              }
            >
              <SelectTrigger className="w-[180px] bg-secondary/30 border-border">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card
          className={`mb-6 overflow-hidden shadow-md bg-gradient-to-r ${getGradientClasses(
            insights[currentInsightIndex].color
          )} backdrop-blur-sm transition-all duration-500`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div
                className={`flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-xl flex items-center justify-center text-3xl text-${insights[currentInsightIndex].color}-500 bg-black/20`}
              >
                {insights[currentInsightIndex].icon}
              </div>
              <div className="flex-grow space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  {insights[currentInsightIndex].text}
                </h3>
                <div className="text-sm text-muted-foreground">
                  Based on {filteredIncidents.length} incidents • Updated{" "}
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() =>
                    setCurrentInsightIndex((current) =>
                      current === 0 ? insights.length - 1 : current - 1
                    )
                  }
                  className="p-1.5 rounded-full hover:bg-black/20 transition-colors"
                  aria-label="Previous insight"
                >
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
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setCurrentInsightIndex((current) =>
                      current === insights.length - 1 ? 0 : current + 1
                    )
                  }
                  className="p-1.5 rounded-full hover:bg-black/20 transition-colors"
                  aria-label="Next insight"
                >
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
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span> Danger Index
                <span className="ml-auto text-xs bg-secondary/60 px-2 py-1 rounded-full">
                  TOP 10
                </span>
              </CardTitle>
              <CardDescription>Most dangerous spots on campus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dangerIndex.length > 0 ? (
                  dangerIndex.map((location, index) => (
                    <div key={location.location} className="flex items-center">
                      <div className="font-mono font-bold text-lg mr-3 text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{location.location}</div>
                        <div className="text-xs text-muted-foreground">
                          {location.count} incidents
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-lg ${
                            location.score > 80
                              ? "text-red-500"
                              : location.score > 50
                              ? "text-orange-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {location.score > 80
                            ? "🔥"
                            : location.score > 50
                            ? "⚠️"
                            : "⚡"}
                        </span>
                        <span className="font-mono font-bold text-lg">
                          {location.score}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Not enough data for the selected time period
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground italic text-center">
                Higher scores indicate more incidents, severity, and recent
                activity.
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-purple-500">⏰</span> Sketchy Hours
                <span className="ml-auto text-xs bg-secondary/60 px-2 py-1 rounded-full">
                  AVOID
                </span>
              </CardTitle>
              <CardDescription>
                When you're most likely to get in trouble
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sketchyHours.map((hour, index) => (
                  <div key={hour.hour} className="flex items-center">
                    <div className="font-mono font-bold text-lg mr-3 text-muted-foreground">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{hour.hour}</div>
                      <div className="text-xs text-muted-foreground">
                        {hour.count} incidents
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-lg ${
                          hour.riskScore > 80
                            ? "text-red-500"
                            : hour.riskScore > 60
                            ? "text-orange-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {hour.riskScore > 80
                          ? "💀"
                          : hour.riskScore > 60
                          ? "🌙"
                          : "🕰️"}
                      </span>
                      <span className="font-mono font-bold text-lg">
                        {hour.riskScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground italic text-center">
                Higher scores indicate more incidents during these hours.
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-500">🚔</span> Narc Rating
                <span className="ml-auto text-xs bg-secondary/60 px-2 py-1 rounded-full">
                  SNITCHES
                </span>
              </CardTitle>
              <CardDescription>
                Which incidents get reported most
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {narcRating.length > 0 ? (
                  narcRating.map((category, index) => (
                    <div key={category.category} className="flex items-center">
                      <div className="font-mono font-bold text-lg mr-3 text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{category.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {category.count} incidents
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-lg ${
                            category.narcScore > 75
                              ? "text-red-500"
                              : category.narcScore > 50
                              ? "text-orange-500"
                              : "text-green-500"
                          }`}
                        >
                          {category.narcScore > 75
                            ? "📱"
                            : category.narcScore > 50
                            ? "🗣️"
                            : "🤫"}
                        </span>
                        <span className="font-mono font-bold text-lg">
                          {category.narcScore}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Not enough incident data in each category
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground italic text-center">
                Higher scores mean more incidents reported vs. discovered by
                campus faculty.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-blue-500">📅</span> Day of Week Analysis
              </CardTitle>
              <CardDescription>When incidents happen most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {incidentsByDay
                  .sort((a, b) => b.count - a.count)
                  .map((day) => (
                    <div key={day.day} className="flex items-center">
                      <div className="w-24 font-medium">{day.day}</div>
                      <div className="flex-1 h-2 bg-secondary/30 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            day.day === "Friday" ||
                            day.day === "Saturday" ||
                            day.day === "Sunday"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.max(
                              5,
                              (day.count /
                                Math.max(
                                  ...incidentsByDay.map((d) => d.count)
                                )) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="ml-2 text-sm font-medium">
                        {day.count}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-pink-500/5 rounded-xl backdrop-blur-sm shadow-sm border border-pink-500/10">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-black/20 flex items-center justify-center text-3xl text-pink-500">
                    🎉
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      Party Foul Index: {partyFoulIndex.score}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Weekend incidents are {partyFoulIndex.ratio}x more common
                      than weekdays
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-red-500">🚨</span> Incident Type Breakdown
              </CardTitle>
              <CardDescription>
                Most common reasons people get in trouble
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {incidentsByType.slice(0, 7).map((incident) => (
                  <div key={incident.type} className="flex items-center">
                    <div
                      className="w-28 text-sm font-medium truncate"
                      title={incident.type}
                    >
                      {incident.type.length > 15
                        ? incident.type.substring(0, 15) + "..."
                        : incident.type}
                    </div>
                    <div className="flex-1 h-2 bg-secondary/30 rounded-full">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{
                          width: `${Math.max(
                            5,
                            (incident.count / incidentsByType[0].count) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="ml-2 text-sm font-medium">
                      {incident.count}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium mb-2">
                  Top Incident Locations
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {incidentsByLocation.slice(0, 6).map((location) => (
                    <div
                      key={location.location}
                      className="flex items-center justify-between bg-secondary/20 rounded p-2"
                    >
                      <div
                        className="text-sm truncate"
                        title={location.location}
                      >
                        {location.location.length > 20
                          ? location.location.substring(0, 20) + "..."
                          : location.location}
                      </div>
                      <div className="text-sm font-mono font-bold">
                        {location.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground pb-6">
          <p className="mt-1 text-xs">
            Note: Metrics like Danger Index, Sketchy Hours, and Narc Rating are
            for entertainment purposes and not official safety metrics.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
