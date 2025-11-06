export const formatTimestamp = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    '-' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

export const sanitizeForPath = (value: string): string => {
  const sanitized = value
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/[\s]+/g, ' ')
    .trim()
    .replace(/[.]+$/, '');

  return sanitized.length > 0 ? sanitized : '_';
};
