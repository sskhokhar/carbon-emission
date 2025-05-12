import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react";

export function ReductionTips() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Carbon Reduction Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
              Electricity
            </Badge>
            <span className="text-sm">
              Switch to LED bulbs to reduce electricity consumption by up to 80%.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Badge className="mt-1 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
              Vehicle
            </Badge>
            <span className="text-sm">
              Consider carpooling or using public transportation once a week.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Badge className="mt-1 bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300">
              Flight
            </Badge>
            <span className="text-sm">
              Offset your flight emissions through verified carbon offset programs.
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
