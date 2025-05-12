export function generateMockData(timeRange: string) {
  const today = new Date();
  let startDate: Date;

  switch (timeRange) {
    case "1m":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      break;
    case "3m":
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
      break;
    case "6m":
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
      break;
    case "1y":
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      break;
    case "all":
      startDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
      break;
    default:
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  }

  const data: any[] = [];
  const daysBetween = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = 0; i <= daysBetween; i += Math.max(1, Math.floor(daysBetween / 60))) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);

    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const electricity = isWeekend ? randomInRange(10, 20) : randomInRange(5, 15);

    const vehicle = isWeekend ? randomInRange(5, 15) : randomInRange(10, 25);

    const isTravelDay = i % 30 < 3;
    const flight = isTravelDay ? randomInRange(50, 200) : 0;

    data.push({
      date: currentDate.toISOString(),
      electricity,
      vehicle,
      flight,
    });
  }

  return data;
}

function randomInRange(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
