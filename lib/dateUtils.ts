import { formatDistance, format, differenceInMonths, differenceInYears } from 'date-fns';

/**
 * Calculate duration between two dates in human-readable format
 * Example: "2 yrs 3 mos" or "6 mos"
 */
export function calculateDuration(startDate: string, endDate: string | null): string {
  // Return empty string if startDate is invalid
  if (!startDate || startDate.trim() === '') {
    return '';
  }

  try {
    // Parse YYYY-MM format as UTC to avoid timezone issues
    const parseDate = (dateStr: string) => {
      if (!dateStr || dateStr.trim() === '') {
        return null;
      }
      
      if (!dateStr.includes('T') && dateStr.split('-').length === 2) {
        const [year, month] = dateStr.split('-');
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        
        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return null;
        }
        
        return new Date(Date.UTC(yearNum, monthNum - 1, 1));
      }
      return new Date(dateStr);
    };
    
    const start = parseDate(startDate);
    if (!start || isNaN(start.getTime())) {
      return '';
    }
    
    const end = endDate ? parseDate(endDate) : new Date();
    if (!end || isNaN(end.getTime())) {
      return '';
    }

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
  } catch (error) {
    return '';
  }
}

/**
 * Format date for display
 * Handles both full ISO dates and YYYY-MM format from month inputs
 */
export function formatDate(date: string, formatStr: string = 'MMM yyyy'): string {
  // Return empty string if date is invalid or empty
  if (!date || date.trim() === '') {
    return '';
  }

  try {
    // If date is in YYYY-MM format (from month input), parse as UTC to avoid timezone issues
    if (!date.includes('T') && date.split('-').length === 2) {
      const [year, month] = date.split('-');
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      
      // Validate year and month ranges
      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return '';
      }
      
      // Create UTC date to avoid timezone offset issues
      const utcDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
      
      // Check if date is valid
      if (isNaN(utcDate.getTime())) {
        return '';
      }
      
      return format(utcDate, formatStr);
    }
    
    const dateObj = new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return format(dateObj, formatStr);
  } catch (error) {
    // Return empty string on any error
    return '';
  }
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

/**
 * Format date range WITHOUT duration - ATS-friendly clean format
 * Example: "Jan 2020 – May 2023"
 */
export function formatDateRangeClean(startDate: string, endDate: string | null, isCurrent?: boolean): string {
  const start = formatDate(startDate);
  const end = (isCurrent || !endDate) ? 'Present' : formatDate(endDate);

  return `${start} – ${end}`;
}
