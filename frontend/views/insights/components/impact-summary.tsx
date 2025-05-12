import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ImpactSummary() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Your Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Total Emissions</span>
              <span className="font-medium">1,245 kg CO₂</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <p className="text-xs mt-1 text-gray-500">35% below average</p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Carbon Saved</span>
              <span className="font-medium">670 kg CO₂</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "35%" }}></div>
            </div>
            <p className="text-xs mt-1 text-gray-500">Equivalent to planting 11 trees</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
