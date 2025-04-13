export function getTime(dateString: string): string {
  const normalized = dateString.replace(", +0000 UTC", " UTC");
  const parsedDate = new Date(normalized);

  if (isNaN(parsedDate.getTime())) {
    console.log("Invalid date format");
  }

  const now = new Date();
  const diffMs = parsedDate.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const isPast = diffMs < 0;

  const absSeconds = Math.abs(diffSeconds);
  const minutes = Math.floor(absSeconds / 60);
  const hours = Math.floor(absSeconds / 3600);
  const days = Math.floor(absSeconds / 86400);

  let result: string;
  if (days >= 1) {
    result = `${days}d`;
  } else if (hours >= 1) {
    result = `${hours}h`;
  } else {
    result = `${minutes}m`;
  }

  return isPast ? `${result}` : `in ${result}`;
}
