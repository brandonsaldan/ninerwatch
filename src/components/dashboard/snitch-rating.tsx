import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncidents } from "@/context/incidents-context";

export function useTopSnitchRating() {
  const { incidents } = useIncidents();
  const [topRating, setTopRating] = useState<{
    location: string;
    score: number;
    incidents: number;
  } | null>(null);

  useEffect(() => {
    if (!incidents.length) return;

    const locationCounts: Record<string, { total: number; recent: number }> =
      {};

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    incidents.forEach((incident) => {
      const location = incident.incident_location;

      if (!locationCounts[location]) {
        locationCounts[location] = { total: 0, recent: 0 };
      }

      locationCounts[location].total += 1;

      try {
        const reportedDate = new Date(incident.time_reported);
        if (reportedDate >= thirtyDaysAgo) {
          locationCounts[location].recent += 1;
        }
      } catch (e) {
        console.error("Error parsing date:", incident.time_reported, e);
      }
    });

    let maxScore = 0;
    let topLocation = "";
    let topIncidents = 0;

    Object.entries(locationCounts)
      .filter((entry) => entry[1].total >= 3)
      .forEach(([location, stats]) => {
        const baseScore = Math.min(50, Math.round(Math.sqrt(stats.total) * 10));

        const recencyRatio = stats.recent / stats.total;
        const recencyBonus = Math.round(Math.pow(recencyRatio, 0.7) * 50);
        const randomNoise = Math.floor(Math.random() * 11) - 5;
        const snitchScore = Math.max(
          10,
          Math.min(100, baseScore + recencyBonus + randomNoise)
        );

        if (snitchScore > maxScore) {
          maxScore = snitchScore;
          topLocation = location;
          topIncidents = stats.total;
        }
      });

    setTopRating({
      location: topLocation,
      score: maxScore,
      incidents: topIncidents,
    });
  }, [incidents]);

  return topRating;
}

export function SnitchRating() {
  const { incidents } = useIncidents();
  const [snitchRatings, setSnitchRatings] = useState<
    {
      location: string;
      score: number;
      incidents: number;
      recentIncidents: number;
    }[]
  >([]);

  useEffect(() => {
    if (!incidents.length) return;

    const locationCounts: Record<string, { total: number; recent: number }> =
      {};

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    incidents.forEach((incident) => {
      const location = incident.incident_location;

      if (!locationCounts[location]) {
        locationCounts[location] = { total: 0, recent: 0 };
      }

      locationCounts[location].total += 1;

      try {
        const reportedDate = new Date(incident.time_reported);
        if (reportedDate >= thirtyDaysAgo) {
          locationCounts[location].recent += 1;
        }
      } catch (e) {
        console.error("Error parsing date:", incident.time_reported, e);
      }
    });

    const ratingsArray = Object.entries(locationCounts)
      .filter((entry) => entry[1].total >= 3)
      .map(([location, stats]) => {
        const baseScore = Math.min(50, Math.round(Math.sqrt(stats.total) * 10));

        const recencyRatio = stats.recent / stats.total;
        const recencyBonus = Math.round(Math.pow(recencyRatio, 0.7) * 50);

        const randomNoise = Math.floor(Math.random() * 11) - 5;
        const snitchScore = Math.max(
          10,
          Math.min(100, baseScore + recencyBonus + randomNoise)
        );

        return {
          location,
          score: snitchScore,
          incidents: stats.total,
          recentIncidents: stats.recent,
        };
      })
      .sort((a, b) => b.score - a.score);

    setSnitchRatings(ratingsArray);
  }, [incidents]);

  const getSnitchEmoji = (score: number) => {
    if (score >= 95) return "🚨";
    if (score >= 90) return "👮‍♀️";
    if (score >= 85) return "🚔";
    if (score >= 80) return "👀";
    if (score >= 75) return "🐀";
    if (score >= 70) return "🔍";
    if (score >= 65) return "📱";
    if (score >= 60) return "📢";
    if (score >= 55) return "👥";
    if (score >= 50) return "🗣️";
    if (score >= 40) return "💬";
    if (score >= 30) return "👂";
    if (score >= 20) return "🤫";
    return "🤐";
  };

  const getSnitchColor = (score: number) => {
    if (score >= 95) return "text-red-700";
    if (score >= 90) return "text-red-600";
    if (score >= 85) return "text-red-500";
    if (score >= 80) return "text-orange-600";
    if (score >= 75) return "text-orange-500";
    if (score >= 70) return "text-amber-500";
    if (score >= 65) return "text-yellow-500";
    if (score >= 60) return "text-lime-500";
    if (score >= 55) return "text-green-500";
    if (score >= 50) return "text-emerald-500";
    if (score >= 40) return "text-teal-500";
    if (score >= 30) return "text-blue-500";
    if (score >= 20) return "text-indigo-500";
    return "text-purple-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-red-500">🚨</span> Snitch Index
          <div className="ml-auto text-xs bg-secondary/60 px-2 py-1 rounded-full">
            UNOFFICIAL
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-3 flex justify-between">
          <div>Locations ranked by current watchfulness</div>
        </div>

        {snitchRatings.length > 0 ? (
          <div className="space-y-3">
            {snitchRatings.slice(0, 10).map((location, index) => (
              <div key={location.location} className="flex items-center">
                <div className="font-mono font-bold text-lg mr-3 text-muted-foreground">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{location.location}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>{location.incidents} total</span>
                    <span className="text-[#ff4b66]">•</span>
                    <span>{location.recentIncidents} recent</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xl ${getSnitchColor(location.score)}`}>
                    {getSnitchEmoji(location.score)}
                  </span>
                  <span className="font-mono font-bold text-lg">
                    {location.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Not enough data for snitch ratings yet...
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground italic text-center">
          Snitch Index: Higher scores mean more incidents get reported
        </div>
      </CardContent>
    </Card>
  );
}
