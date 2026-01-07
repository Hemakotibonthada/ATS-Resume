import { formatDistance, format, differenceInMonths, differenceInYears } from 'date-fns';

/**
 * Calculate duration between two dates in human-readable format
 * Example: "2 yrs 3 mos" or "6 mos"
 */
export function calculateDuration(startDate: string, endDate: string | null): string {
  // Handle YYYY-MM format by appending -01
  const startStr = startDate.includes('T') || startDate.split('-').length > 2 ? startDate : `${startDate}-01`;
  const endStr = endDate ? (endDate.includes('T') || endDate.split('-').length > 2 ? endDate : `${endDate}-01`) : null;
  
  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : new Date();

  const years = differenceInYears(end, start);
  const months = differenceInMonths(end, start) % 12;

  if (years === 0 && months === 0) {
    return 'Less than a month';
  }

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  }
  if (months > 0) {
    parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  }

  return parts.join(' ');
}

/**
 * Format date for display
 * Handles both full ISO dates and YYYY-MM format from month inputs
 */
export function formatDate(date: string, formatStr: string = 'MMM yyyy'): string {
  // If date is in YYYY-MM format (from month input), append -01 to make it a valid date
  const dateStr = date.includes('T') || date.split('-').length > 2 ? date : `${date}-01`;
  return format(new Date(dateStr), formatStr);
}

/**
 * Format date range with duration
 * Example: "Jan 2020 - Present · 4 yrs 2 mos"
 */
export function formatDateRange(startDate: string, endDate: string | null, isCurrent?: boolean): string {
  const start = formatDate(startDate);
  const end = (isCurrent || !endDate) ? 'Present' : formatDate(endDate);
  const duration = calculateDuration(startDate, endDate);

  return `${start} - ${end} · ${duration}`;
}
