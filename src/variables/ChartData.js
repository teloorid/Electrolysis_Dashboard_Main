import { DeviceSensorsConfig } from "variables/DeviceSensorsConfig";
import { generateRandomData, generateTimestampsLabels } from "utils/ChartSimulation";

const MINUTES_IN_YEAR = 365 * 24 * 60;
const MAX_VALUE = 500; // Reduced from 1000 to match your range of 200-500

const ChartData = Object.keys(DeviceSensorsConfig).reduce((data, key) => {
  let oxygenValues = [];

  data[key] = DeviceSensorsConfig[key].map((config) => {
    const count = MINUTES_IN_YEAR;
    let generatedData = generateRandomData(
      config.min,
      config.max,
      config.decimal,
      count
    );

    // Cap Oxygen values and ensure they're numbers
    generatedData = generatedData.map(val => {
      // Convert string to number if necessary
      const numVal = typeof val === 'string' ? parseFloat(val) : val;
      // Handle NaN or invalid values
      if (isNaN(numVal)) return 0;
      return Math.min(numVal, MAX_VALUE);
    });

    if (config.title === 'Oxygen Volume') {
      oxygenValues = generatedData;
    } else if (config.title === 'Hydrogen Volume' && oxygenValues.length) {
      generatedData = oxygenValues.map((oxygenVal, index) => {
        // Ensure oxygen value is a number
        const oxygenNum = typeof oxygenVal === 'string' ? parseFloat(oxygenVal) : oxygenVal;

        // Handle invalid oxygen values
        if (isNaN(oxygenNum)) return 0;

        // Calculate hydrogen value with safety checks
        let hydrogenValue = oxygenNum * 1.5;

        // Cap the hydrogen value
        hydrogenValue = Math.min(hydrogenValue, MAX_VALUE);

        // Return the value as a number, not a string
        return hydrogenValue;
      });
    }

    const timestamps = generateTimestampsLabels("minutes", 1, count);

    return {
      title: config.title,
      xLabel: config.xLabel,
      yLabel: config.yLabel,
      labels: timestamps,
      data: generatedData
    };
  });

  return data;
}, {});

export default ChartData;