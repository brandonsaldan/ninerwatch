"use client";

import React, { useMemo } from "react";
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
import Link from "next/link";
import {
  SnitchRating,
  useTopSnitchRating,
} from "@/components/dashboard/snitch-rating";

export default function Home() {
  const { incidents, loading, error, incidentTypes } = useIncidents();
  const topRating = useTopSnitchRating();

  const topHotSpot = useMemo(() => {
    if (!incidents.length) return { location: "N/A", count: 0 };

    const locationCounts: Record<string, number> = {};

    incidents.forEach((incident) => {
      const location = incident.incident_location;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    let topLocation = "";
    let maxCount = 0;

    Object.entries(locationCounts).forEach(([location, count]) => {
      if (count > maxCount) {
        topLocation = location;
        maxCount = count;
      }
    });

    return { location: topLocation, count: maxCount };
  }, [incidents]);

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
    };

    return typeToColor[type] || "bg-gray-500/10 text-gray-500";
  };

  const getProgressBarColor = (type: string): string => {
    const typeToBarColor: Record<string, string> = {
      Larceny: "bg-yellow-500",
      "Larceny of Bicycle": "bg-yellow-500",
      "Larceny of Laptop": "bg-yellow-500",
      "Larceny of Property": "bg-yellow-500",
      "Larceny of Vehicle": "bg-yellow-500",
      "Larceny of Vehicle Parts": "bg-yellow-500",
      "Larceny/Arrest": "bg-yellow-500",
      "Larceny/Property": "bg-yellow-500",
      "Larceny/Property Damage": "bg-yellow-500",
      "Larceny/Property Theft": "bg-yellow-500",
      "Larceny/Vehicle": "bg-yellow-500",
      "Larceny/Vehicle Parts": "bg-yellow-500",
      "Larceny/Vehicle Theft": "bg-yellow-500",
      Theft: "bg-yellow-500",
      "Property Theft": "bg-yellow-500",
      "Property Theft/Arrest": "bg-yellow-500",
      Burglary: "bg-yellow-500",
      "Burglary/Arrest": "bg-yellow-500",
      "Burglary/Property": "bg-yellow-500",
      "Burglary/Property Damage": "bg-yellow-500",
      "Burglary/Property Theft": "bg-yellow-500",
      "Burglary of Vehicle": "bg-yellow-500",
      "Burglary of Vehicle Parts": "bg-yellow-500",
      "Burglary/Vehicle": "bg-yellow-500",
      "Burglary/Vehicle Parts": "bg-yellow-500",
      "Burglary/Vehicle Theft": "bg-yellow-500",
      "Stolen Vehicle": "bg-yellow-500",
      "Stolen Vehicle Parts": "bg-yellow-500",
      "Stolen Vehicle/Arrest": "bg-yellow-500",
      "Stolen Vehicle Parts/Arrest": "bg-yellow-500",
      "Stolen Vehicle/Property": "bg-yellow-500",
      "Stolen Vehicle/Property Damage": "bg-yellow-500",
      "Stolen Vehicle/Property Theft": "bg-yellow-500",
      "Stolen Vehicle Parts/Property": "bg-yellow-500",
      "Stolen Vehicle Parts/Property Damage": "bg-yellow-500",
      "Stolen Vehicle Parts/Property Theft": "bg-yellow-500",
      "Motor Vehicle Theft": "bg-yellow-500",
      "Motor Vehicle Theft/Arrest": "bg-yellow-500",
      Fraud: "bg-yellow-500",
      "Fraud/Arrest": "bg-yellow-500",
      "Identity Theft": "bg-yellow-500",
      "Identity Theft/Arrest": "bg-yellow-500",
      Robbery: "bg-yellow-600",
      "Robbery/Attempted": "bg-yellow-600",
      "Attempted Robbery": "bg-yellow-600",
      "Robbery/Arrest": "bg-yellow-600",
      "Robbery/Property": "bg-yellow-600",
      "Robbery/Property Damage": "bg-yellow-600",
      "Robbery/Property Theft": "bg-yellow-600",
      "Robbery/Vehicle": "bg-yellow-600",
      "Robbery/Vehicle Parts": "bg-yellow-600",

      "Lost or Stolen": "bg-purple-500",
      "Lost Property": "bg-purple-500",
      "Property Found": "bg-purple-500",
      "Missing/Found Person": "bg-purple-500",
      "Missing/Found Subject": "bg-purple-500",

      Accident: "bg-orange-500",
      "Accident/Arrest": "bg-orange-500",
      "Accident/Hit & Run": "bg-orange-500",
      "Accident/Hit and Run": "bg-orange-500",
      "Accident/Hit and Run/Property": "bg-orange-500",
      "Accident/Hit and Run/Property Damage": "bg-orange-500",
      "Accident/Personal Injury": "bg-orange-500",
      "Accident/Personal Injury/Property Damage": "bg-orange-500",
      "Accident/Property": "bg-orange-500",
      "Accident/Property Damage": "bg-orange-500",
      "Vehicle Accident": "bg-orange-500",
      "Hit & Run": "bg-orange-500",
      "Hit & Run/Arrest": "bg-orange-500",
      "Hit & Run/Property": "bg-orange-500",
      "Hit & Run/Property Damage": "bg-orange-500",
      "Hit and Run": "bg-orange-500",
      "Hit and Run/Arrest": "bg-orange-500",
      "Hit and Run/Property": "bg-orange-500",
      "Hit and Run/Property Damage": "bg-orange-500",
      Crash: "bg-orange-500",
      "Disabled Vehicle": "bg-orange-500",
      "Vehicle Lockout": "bg-orange-500",
      "Traffic Stop": "bg-orange-500",
      "Traffic Violation": "bg-orange-500",
      "Vehicle Stop": "bg-orange-500",
      "Abandoned Vehicle": "bg-orange-400",
      "Parking Violation": "bg-orange-300",
      "Parking Violation/Arrest": "bg-orange-300",
      "Illegal Parking": "bg-orange-300",
      "Illegal Parking/Arrest": "bg-orange-300",

      "Suspicious Person": "bg-blue-500",
      "Suspicious Person/Arrest": "bg-blue-500",
      "Suspicious Person/Property": "bg-blue-500",
      "Suspicious Person/Property Damage": "bg-blue-500",
      "Suspicious Person/Property Theft": "bg-blue-500",
      "Suspicious Vehicle": "bg-blue-500",
      "Suspicious Vehicle/Arrest": "bg-blue-500",
      "Suspicious Activity": "bg-blue-500",
      "Suspicious Activity/Arrest": "bg-blue-500",
      "Suspicious Activity/Property": "bg-blue-500",
      "Suspicious Activity/Property Damage": "bg-blue-500",
      "Suspicious Activity/Property Theft": "bg-blue-500",
      Investigate: "bg-blue-500",
      "Investigate/Arrest": "bg-blue-500",
      "Investigate/Property": "bg-blue-500",
      "Investigate/Property Damage": "bg-blue-500",
      "Investigate/Property Theft": "bg-blue-500",
      "Investigate/Vehicle": "bg-blue-500",
      "Investigate/Vehicle Parts": "bg-blue-500",
      "Investigate/Vehicle Theft": "bg-blue-500",
      Investigation: "bg-blue-500",
      "Investigation/Arrest": "bg-blue-500",
      "Investigation/Property": "bg-blue-500",
      "Investigation/Property Damage": "bg-blue-500",
      "Investigation/Property Theft": "bg-blue-500",
      "Investigation/Vehicle": "bg-blue-500",
      "Investigation/Vehicle Parts": "bg-blue-500",
      "Investigation/Vehicle Theft": "bg-blue-500",
      "Follow Up": "bg-blue-400",
      BOLO: "bg-blue-600",
      "Pedestrian Check": "bg-blue-400",
      Loitering: "bg-blue-300",
      "Loitering/Arrest": "bg-blue-300",
      "Loitering/Trespassing": "bg-blue-300",
      Trespassing: "bg-blue-300",
      "Criminal Trespass": "bg-blue-300",
      "Criminal Trespass/Arrest": "bg-blue-300",

      "Damage to Property": "bg-red-500",
      "Damage to Vehicle": "bg-red-500",
      "Property Damage": "bg-red-500",
      "Property Damage/Arrest": "bg-red-500",
      "Criminal Damage": "bg-red-500",
      "Criminal Damage to Property": "bg-red-500",
      "Criminal Damage to Vehicle": "bg-red-500",
      Vandalism: "bg-red-500",
      Arson: "bg-red-600",

      "Welfare Check": "bg-green-500",
      "Injured/Ill Subject": "bg-green-500",
      "Injured Subject": "bg-green-500",
      "Injured Person": "bg-green-500",
      "Emergency Medical Call": "bg-green-500",
      "Assist Medic": "bg-green-500",
      Suicide: "bg-green-600",
      "Suicide Attempt": "bg-green-600",
      "Suicide Ideation": "bg-green-600",
      "Drug Overdose": "bg-green-600",
      Overdose: "bg-green-600",
      "Health and Safety": "bg-green-400",
      "Intoxicated Person": "bg-green-400",
      "Intoxicated Subject": "bg-green-400",
      "Intoxicated/Disorderly": "bg-green-400",
      "Intoxicated/Disorderly Person": "bg-green-400",
      "Intoxicated/Disorderly Subject": "bg-green-400",
      "Intoxicated/Disorderly Subject/Arrest": "bg-green-400",

      "Elevator Call": "bg-cyan-500",
      "Elevator Emergency": "bg-cyan-500",
      "Elevator Emergency Call": "bg-cyan-500",
      "Disabled Elevator": "bg-cyan-500",
      "Elevator Entrapment": "bg-cyan-500",
      "Commercial Alarm": "bg-cyan-400",
      "Commercial Alarm/Arrest": "bg-cyan-400",
      "Panic Alarm": "bg-cyan-400",
      "Emergency Call": "bg-cyan-400",
      "Utilities Outage": "bg-cyan-600",
      "Assist Fire": "bg-cyan-600",
      "Assist CFD": "bg-cyan-600",
      "Assist Charlotte Fire": "bg-cyan-600",
      "Assist Charlotte Fire Department": "bg-cyan-600",
      "Assist Charlotte Fire Dept.": "bg-cyan-600",

      "Assist Other Agency": "bg-indigo-500",
      Assist: "bg-indigo-500",
      "Assist Other": "bg-indigo-500",
      "Assist CMPD": "bg-indigo-500",
      "Campus Safety": "bg-indigo-500",
      "Campus Safety/Arrest": "bg-indigo-500",
      "Campus Safety/Property": "bg-indigo-500",
      "Campus Safety/Property Damage": "bg-indigo-500",
      "Campus Safety/Property Theft": "bg-indigo-500",
      Escort: "bg-indigo-400",
      "Serving Papers": "bg-indigo-400",
      "911 Hang Up": "bg-indigo-300",

      "Verbal Confrontation": "bg-pink-500",
      Harassment: "bg-pink-500",
      "Harassment/Arrest": "bg-pink-500",
      "Communicating Threats": "bg-pink-500",
      "Communicating Threats/Property": "bg-pink-500",
      "Communicating Threats/Property Damage": "bg-pink-500",
      "Communicating Threats/Property Theft": "bg-pink-500",
      "Communicating Threats/Arrest": "bg-pink-500",
      "Disorderly Conduct": "bg-pink-500",
      "Disorderly Conduct/Arrest": "bg-pink-500",
      Disturbance: "bg-pink-500",
      "Disturbance/Arrest": "bg-pink-500",
      "Domestic Disturbance": "bg-pink-500",
      "Domestic Violence": "bg-pink-500",
      "Domestic Violence/Arrest": "bg-pink-500",
      Domestic: "bg-pink-500",
      "Domestic Dispute": "bg-pink-500",
      Assault: "bg-pink-600",
      "Assault/Arrest": "bg-pink-600",
      "Assault/Battery": "bg-pink-600",
      "Assault/Battery/Arrest": "bg-pink-600",
      "Sexual Assault": "bg-pink-600",
      "Sexual Assault/Arrest": "bg-pink-600",
      "Sexual Offense": "bg-pink-600",
      "Shots Fired": "bg-pink-600",
      "Shots Fired/Arrest": "bg-pink-600",
      Stalking: "bg-pink-600",
      "Stalking/Arrest": "bg-pink-600",
      "Indecent Exposure": "bg-pink-400",
      "Indecent Exposure/Arrest": "bg-pink-400",

      "Drug Related": "bg-rose-500",
      "Drug Related/Arrest": "bg-rose-500",
      "Drug Activity": "bg-rose-500",
      "Drug Activity/Arrest": "bg-rose-500",
      Drug: "bg-rose-500",
      "Missing Person": "bg-rose-400",
      "Missing Subject": "bg-rose-400",
      "Missing Child": "bg-rose-400",
      "Animal Control": "bg-rose-300",
      Noise: "bg-rose-300",
      "Noise Complaint": "bg-rose-300",
      Solicitation: "bg-rose-300",
      "Solicitation/Arrest": "bg-rose-300",
      Arrest: "bg-rose-400",
    };

    return typeToBarColor[type] || "bg-gray-500";
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-red-500/10 to-red-500/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">
                🚨
              </div>
              <div>
                <p className="text-2xl font-bold">{incidents.length}</p>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl">
                📍
              </div>
              <div>
                <p className="text-2xl font-bold">{topHotSpot.location}</p>
                <p className="text-sm text-muted-foreground">
                  Top Hot Spot ({topHotSpot.count} incidents)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                👮‍♀️
              </div>
              <div>
                <p className="text-2xl font-bold">{topRating?.score || "--"}</p>
                <p className="text-sm text-muted-foreground">
                  Highest Snitch Rating
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card className="shadow-lg">
              <CardContent className="p-0 h-[550px]">
                <CampusMap />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Incident Types</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-4 text-center">
                    <p className="text-muted-foreground">
                      Loading incident data...
                    </p>
                  </div>
                ) : incidentTypes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {incidentTypes.slice(0, 3).map((item) => (
                        <div
                          key={item.incident_type}
                          className="flex items-center"
                        >
                          <div className="flex-1 text-sm">
                            {item.incident_type}
                          </div>
                          <div className="text-sm font-medium">
                            {item.count}
                          </div>
                          <div className="ml-2 w-24 h-2 bg-secondary/30 rounded-full">
                            <div
                              className={`h-2 rounded-full ${getProgressBarColor(
                                item.incident_type
                              )}`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (item.count / incidentTypes[0].count) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {incidentTypes.slice(3, 6).map((item) => (
                        <div
                          key={item.incident_type}
                          className="flex items-center"
                        >
                          <div className="flex-1 text-sm">
                            {item.incident_type}
                          </div>
                          <div className="text-sm font-medium">
                            {item.count}
                          </div>
                          <div className="ml-2 w-24 h-2 bg-secondary/30 rounded-full">
                            <div
                              className={`h-2 rounded-full ${getProgressBarColor(
                                item.incident_type
                              )}`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (item.count / incidentTypes[0].count) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-muted-foreground">
                      No incident data available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="shadow-md border-[#ff4b66]/20">
              <CardHeader className="pb-4 rounded-t-xl text-card-foreground shadow bg-gradient-to-r from-[#ff4b66]/10 to-transparent">
                <CardTitle className="flex items-center gap-2 text-[#ff4b66]">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4b66] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff4b66]"></span>
                  </span>
                  Live Incidents
                </CardTitle>
                <CardDescription>Latest reported events</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-10 text-center">
                    <p className="text-muted-foreground">
                      Loading incidents...
                    </p>
                  </div>
                ) : error ? (
                  <div className="py-10 text-center">
                    <p className="text-red-500">Error: {error}</p>
                  </div>
                ) : (
                  <div className="h-[380px] overflow-y-auto divide-y divide-border">
                    {recentIncidents.slice(0, 5).map((incident) => (
                      <Link
                        key={incident.id}
                        href={`/incident/${incident.report_number.replace(
                          /\//g,
                          "-"
                        )}`}
                        className="block hover:bg-secondary/10 transition-colors"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">
                              {incident.incident_location}
                            </div>
                            <div
                              className={`${getBadgeColor(
                                incident.incident_type
                              )} text-xs px-2 py-1 rounded-full whitespace-nowrap`}
                            >
                              {incident.incident_type}
                            </div>
                          </div>
                          <div className="relative group">
                            <p className="text-sm text-muted-foreground line-clamp-2 overflow-hidden">
                              {incident.incident_description ||
                                "No description available."}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-xs text-muted-foreground">
                              {formatDate(incident.time_reported)}
                            </p>
                            <span className="text-xs bg-secondary/60 hover:bg-secondary/80 px-2 py-1 rounded text-foreground transition-colors">
                              View Details →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="p-3 border-t border-border text-center">
                  <Link href="/incidents" passHref>
                    <button className="text-sm bg-secondary/50 hover:bg-secondary px-4 py-2 rounded-md text-foreground hover:text-foreground transition-colors">
                      View all incidents →
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <SnitchRating />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
