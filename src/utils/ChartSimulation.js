export const generateRandomData = (min, max, decimal = 0, count = 10) => {
  return Array(count)
    .fill(0)
    .map(() => {
      const value = Math.random() * (max - min) + min;
      return Number(value.toFixed(decimal));
    });
};

export const generateTimestampsLabels = (intervalType, intervalValue, count) => {
  const now = new Date();
  const timestamps = [];
  let currentDate = new Date(now);

  // Start 'count' intervals ago
  currentDate.setMinutes(now.getMinutes() - (count - 1) * intervalValue);

  for (let i = 0; i < count; i++) {
    timestamps.push(new Date(currentDate).toISOString());
    currentDate.setMinutes(currentDate.getMinutes() + intervalValue);
  }

  return timestamps;
};
