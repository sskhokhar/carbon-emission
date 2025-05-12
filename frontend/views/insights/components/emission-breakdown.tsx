
export function EmissionBreakdown() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Emission Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Electricity</span>
            </div>
            <span className="text-sm font-medium">216 kg (17%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Vehicle</span>
            </div>
            <span className="text-sm font-medium">358 kg (29%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm">Flight</span>
            </div>
            <span className="text-sm font-medium">671 kg (54%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
