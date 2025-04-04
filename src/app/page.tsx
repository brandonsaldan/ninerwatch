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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <CardContent className="pt-6 h-[700px]">
              <CampusMap />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Latest reported events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2">
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

                <div className="pb-4 border-b border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Vandalism</h3>
                      <p className="text-sm text-muted-foreground">
                        South Village Deck
                      </p>
                    </div>
                    <div className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded-full">
                      Vandalism
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Yesterday, 4:15 PM
                  </p>
                </div>

                <div className="pb-4 border-b border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Lost Property</h3>
                      <p className="text-sm text-muted-foreground">
                        Atkins Library
                      </p>
                    </div>
                    <div className="bg-purple-500/10 text-purple-500 text-xs px-2 py-1 rounded-full">
                      Lost Item
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 days ago, 3:30 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
