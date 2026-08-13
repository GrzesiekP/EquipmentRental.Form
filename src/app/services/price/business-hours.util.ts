const dayStartHour = 8;
const dayEndHour = 18;
const sunday = 0;
const saturday = 6;

export function isOutsideBusinessHours(dateTime: Date): boolean {
  const day = dateTime.getDay();
  if (day === sunday || day === saturday) {
    return true;
  }

  const hour = dateTime.getHours();
  return hour < dayStartHour || hour >= dayEndHour;
}
