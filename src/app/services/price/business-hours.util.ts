const dayStartHour = 8;
const dayEndHour = 18;

export function isOutsideBusinessHours(dateTime: Date): boolean {
  const hour = dateTime.getHours();
  return hour < dayStartHour || hour >= dayEndHour;
}
