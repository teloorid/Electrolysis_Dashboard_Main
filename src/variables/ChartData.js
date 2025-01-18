import {DeviceSensorsConfig} from "variables/DeviceSensorsConfig";
import {generateRandomData, generateTimestampsLabels,} from "utils/ChartSimulation";

const MINUTES_IN_YEAR = 365 * 24 * 60;

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

    if (config.title === 'Oxygen Volume') {
      oxygenValues = generatedData;
    } else if (config.title === 'Hydrogen Volume' && oxygenValues.length) {
      generatedData = oxygenValues.map((val) => (val * 1.5).toFixed(config.decimal));
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
