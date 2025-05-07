export const checkDifferenceTime = (
  startDate: Date,
  endDate: Date,
  threshold: number,
  options?: { type?: 'up' | 'down' }
) => {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const difference = endTime - startTime;

  const type = options?.type || 'up';

  if (type === 'up') {
    return difference > threshold;
  }

  return difference < threshold;
}