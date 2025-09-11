export function getTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const padMs = (n) => n.toString().padStart(3, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const milliseconds = padMs(now.getMilliseconds());

  const offsetMinutes = now.getTimezoneOffset();
  const sign = offsetMinutes > 0 ? '-' : '+';
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetMins = pad(Math.abs(offsetMinutes) % 60);

  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${sign}${offsetHours}:${offsetMins}]`;
}