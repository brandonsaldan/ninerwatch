import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CampusMap } from "@/components/map/campus-map";
import Header from "@/components/dashboard/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Campus Map</CardTitle>
              <CardDescription>
                Real-time incident tracking at UNC Charlotte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CampusMap />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Latest reported events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Theft Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Student Union
                      </p>
                    </div>
                    <div className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded-full">
                      Theft
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Today, 2:30 PM
                  </p>
                </div>

                <div className="pb-4 border-b border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Traffic Accident</h3>
                      <p className="text-sm text-muted-foreground">
                        East Deck 1
                      </p>
                    </div>
                    <div className="bg-orange-500/10 text-orange-500 text-xs px-2 py-1 rounded-full">
                      Accident
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Today, 11:15 AM
                  </p>
                </div>

                <div className="pb-4 border-b border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Suspicious Activity</h3>
                      <p className="text-sm text-muted-foreground">
                        Fretwell Building
                      </p>
                    </div>
                    <div className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded-full">
                      Report
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Yesterday, 8:45 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Incidents This Week</CardTitle>
              <CardDescription>7-day summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">
                  Chart will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incident Types</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">
                  Chart will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campus Hotspots</CardTitle>
              <CardDescription>
                Areas with highest incident rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">
                  Chart will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
