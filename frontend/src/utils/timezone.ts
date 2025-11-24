import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// MST timezone (Phoenix, Arizona)
export const MST_TIMEZONE = 'America/Phoenix'

/**
 * Convert a datetime string to MST timezone
 */
export const toMST = (dateTime: string | Date | null | undefined): dayjs.Dayjs | null => {
  if (!dateTime) return null
  return dayjs(dateTime).tz(MST_TIMEZONE)
}

/**
 * Format datetime for display in MST
 */
export const formatDateTime = (
  dateTime: string | Date | null | undefined,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  const mstDate = toMST(dateTime)
  return mstDate ? mstDate.format(format) : ''
}

/**
 * Format date for display
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * Convert MST datetime to ISO string for API
 */
export const toISOString = (dateTime: dayjs.Dayjs | null | undefined): string => {
  if (!dateTime) return ''
  return dateTime.toISOString()
}

/**
 * Calculate time difference in minutes (whole numbers only)
 */
export const calculateMinutes = (
  startTime: string | Date | null | undefined,
  endTime: string | Date | null | undefined
): number => {
  if (!startTime || !endTime) return 0
  
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  
  const diffInMinutes = end.diff(start, 'minute')
  return Math.round(diffInMinutes) // Whole minutes only
}

/**
 * @deprecated Use calculateMinutes instead - kept for backwards compatibility
 * Calculate time difference in hours
 */
export const calculateHours = (
  startTime: string | Date | null | undefined,
  endTime: string | Date | null | undefined
): number => {
  if (!startTime || !endTime) return 0
  
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  
  const diffInHours = end.diff(start, 'hour', true)
  return Math.round(diffInHours * 100) / 100 // Round to 2 decimal places
}
