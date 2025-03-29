// Convert JavaScript Date (which includes time zone) to correct Finnish Local Date
export function fixDateToFinnishTime(date: Date): Date {
  const userTimezoneOffset = date.getTimezoneOffset() * 60000; // Get offset in milliseconds
  return new Date(date.getTime() - userTimezoneOffset); // Adjust to correct local time
}
