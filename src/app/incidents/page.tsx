"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import { useIncidents } from "@/context/incidents-context";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";

export default function IncidentsPage() {
  const { incidents, loading, error, incidentTypes } = useIncidents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    incidents.forEach((incident) => {
      locations.add(incident.incident_location);
    });
    return Array.from(locations).sort();
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        searchQuery === "" ||
        incident.incident_description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        incident.incident_type
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        incident.incident_location
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        incident.report_number
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === null || incident.incident_type === selectedType;

      const matchesLocation =
        selectedLocation === null ||
        incident.incident_location === selectedLocation;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [incidents, searchQuery, selectedType, selectedLocation]);

  const groupedIncidents = useMemo(() => {
    const groups: { [key: string]: typeof incidents } = {};

    filteredIncidents.forEach((incident) => {
      try {
        const date = new Date(incident.time_reported);
        const dateKey = format(date, "yyyy-MM-dd");

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }

        groups[dateKey].push(incident);
      } catch (e) {
        const dateKey = "Unknown Date";
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(incident);
      }
    });

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .slice((currentPage - 1) * 5, currentPage * 5);
  }, [filteredIncidents, currentPage]);

  const totalPages = Math.ceil(
    Object.keys(
      groupedIncidents.reduce((acc, [_, incidents]) => {
        incidents.forEach((incident) => {
          acc[incident.id] = true;
        });
        return acc;
      }, {} as Record<string, boolean>)
    ).length / itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedLocation]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const formatGroupDate = (dateString: string) => {
    try {
      if (dateString === "Unknown Date") return dateString;
      const date = new Date(dateString);
      return format(date, "EEEE, MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const getIncidentEmoji = (type: string): string => {
    const typeToEmoji: Record<string, string> = {
      Larceny: "💰",
      "Larceny of Bicycle": "🚲",
      "Larceny of Laptop": "💻",
      "Larceny of Property": "📱",
      "Larceny of Vehicle": "🚗",
      "Stolen Vehicle": "🚗",
      Burglary: "🏠",
      Robbery: "🔫",
      "Lost or Stolen": "🔎",
      "Lost Property": "🔎",
      "Property Found": "✅",
      Accident: "💥",
      "Hit and Run": "🏃",
      Crash: "💥",
      "Traffic Stop": "🛑",
      "Parking Violation": "🅿️",
      "Suspicious Person": "👤",
      "Suspicious Vehicle": "🚗",
      Investigate: "🔍",
      Investigation: "🔍",
      Loitering: "🚷",
      Trespassing: "⛔",
      "Damage to Property": "🏚️",
      "Property Damage": "🏚️",
      Vandalism: "🖌️",
      "Welfare Check": "🏥",
      "Injured Subject": "🤕",
      "Intoxicated Person": "🍺",
      Alarm: "🚨",
      "Emergency Call": "🆘",
      Assist: "🤝",
      "Assist CMPD": "🚔",
      Harassment: "😠",
      Assault: "👊",
      "Drug Related": "💊",
      Arrest: "🚓",
    };

    if (typeToEmoji[type]) {
      return typeToEmoji[type];
    }

    for (const [key, value] of Object.entries(typeToEmoji)) {
      if (type.includes(key)) {
        return value;
      }
    }

    return "❗";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-4xl flex items-center gap-2 font-bold mb-6 md:mb-0">
            <span className="text-blue-500">🕵️‍♂️</span> Campus Incidents
          </h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search incidents..."
                className="w-full md:w-64 px-4 py-2 rounded-md bg-secondary/30 border border-border focus:outline-none focus:ring-0 focus:border-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <Select
              value={selectedType || "all"}
              onValueChange={(value) =>
                setSelectedType(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full md:w-[220px] bg-secondary/30 border-border">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {incidentTypes.map((type) => (
                  <SelectItem
                    key={type.incident_type}
                    value={type.incident_type}
                  >
                    {type.incident_type} ({type.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedLocation || "all"}
              onValueChange={(value) =>
                setSelectedLocation(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full md:w-[220px] bg-secondary/30 border-border">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredIncidents.length} incidents
            {selectedType && ` of type "${selectedType}"`}
            {selectedLocation && ` at location "${selectedLocation}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading incidents...</p>
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
        ) : filteredIncidents.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                No incidents found matching your criteria. Try adjusting your
                filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12 mb-6">
            {groupedIncidents.map(([dateKey, incidents]) => (
              <div key={dateKey} className="relative">
                <div className="sticky top-0 z-10 py-2">
                  <h2 className="text-lg font-semibold bg-black/60 shadow-lg p-4 backdrop-blur-md bg-opacity-90 inline-block px-4 py-2 rounded-lg">
                    {formatGroupDate(dateKey)}
                  </h2>
                </div>
                <div className="md:ml-8 md:border-l-2 border-border md:pl-8 space-y-6 pt-2 pb-6 relative">
                  {incidents.map((incident) => (
                    <Link
                      key={incident.id}
                      href={`/incident/${incident.report_number.replace(
                        /\//g,
                        "-"
                      )}`}
                      className="block"
                    >
                      <div className="hidden absolute -left-4 w-8 h-8 rounded-full bg-background border-2 border-border md:flex items-center justify-center">
                        <span className="text-lg">
                          {getIncidentEmoji(incident.incident_type)}
                        </span>
                      </div>
                      <Card className="hover:bg-secondary/10 transition-colors border-border/50 overflow-hidden">
                        <CardContent className="p-4 md:p-5">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-base">
                                  {incident.incident_type}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {incident.incident_location}
                                </p>
                              </div>
                              <div className="text-xs text-muted-foreground flex gap-2 items-center">
                                <span>
                                  {formatDate(incident.time_reported)}
                                </span>
                                <span className="bg-secondary/40 px-2 py-1 rounded">
                                  {incident.disposition || "Open"}
                                </span>
                              </div>
                            </div>
                            {incident.incident_description && (
                              <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                                {incident.incident_description}
                              </p>
                            )}
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs font-mono opacity-50">
                                {incident.report_number}
                              </span>
                              <span className="text-xs text-primary">
                                View details →
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
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
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
