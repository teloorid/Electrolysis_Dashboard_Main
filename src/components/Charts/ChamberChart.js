import React, {useMemo} from "react";
import {Bar, Line} from "react-chartjs-2";
import {Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap";
import {ChartOptions, LineChartConfig} from "variables/ChartConfig";

function ChamberChart(props) {
  const { config } = props;

  // Function to safely parse dates
  const parseDate = (label) => {
    try {
      // If label is already a Date object
      if (label instanceof Date) return label;

      // If label is a timestamp number
      if (typeof label === 'number') return new Date(label);

      // If label is an ISO string or other date string
      const date = new Date(label);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  // Function to get time bucket key
  const getTimeBucketKey = (date, precision) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    switch (precision) {
      case 'minute':
        return `${year}-${month}-${day} ${hour}:${minute}`;
      case 'hour':
        return `${year}-${month}-${day} ${hour}:00`;
      case 'day':
        return `${year}-${month}-${day}`;
      case 'week':
        const weekDate = new Date(date);
        weekDate.setDate(date.getDate() - date.getDay());
        return weekDate.toISOString().slice(0, 10);
      case 'month':
        return `${year}-${month}`;
      default:
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }
  };

  // Function to aggregate data based on precision
  const aggregateData = (data, labels, precision) => {
    if (!data || !labels || data.length === 0 || labels.length === 0) {
      return { aggregatedData: [], aggregatedLabels: [] };
    }

    const aggregatedMap = new Map();

    labels.forEach((label, index) => {
      const date = parseDate(label);
      if (!date) return;

      const key = getTimeBucketKey(date, precision);
      if (!key) return;

      const value = data[index];
      // Only aggregate non-null, valid numbers
      if (value !== null && value !== undefined && !isNaN(value)) {
        if (!aggregatedMap.has(key)) {
          aggregatedMap.set(key, {
            sum: value,
            count: 1,
            date: date,
            lastValue: value // Keep track of the last valid value
          });
        } else {
          const current = aggregatedMap.get(key);
          aggregatedMap.set(key, {
            sum: current.sum + value,
            count: current.count + 1,
            date: current.date,
            lastValue: value // Update the last valid value
          });
        }
      }
    });

    // Convert to array and sort by date
    const aggregated = Array.from(aggregatedMap.entries())
      .map(([key, value]) => ({
        label: key,
        value: value.sum / value.count,
        lastValue: value.lastValue,
        date: value.date
      }))
      .sort((a, b) => a.date - b.date);

    return {
      aggregatedData: aggregated.map(item => item.value),
      aggregatedLabels: aggregated.map(item => item.label),
      lastValidValue: aggregated.length > 0 ? aggregated[aggregated.length - 1].lastValue : null
    };
  };

  // Process individual metrics with aggregation and filtering
  // eslint-disable-next-line react-hooks/exhaustive-deps
const processMetric = (metricData, labels, precision, dateRange) => {
    if (!metricData || !labels) return { data: metricData, labels };

    // First aggregate the data
    const { aggregatedData, aggregatedLabels, lastValidValue } = aggregateData(
      metricData,
      labels,
      precision || 'hour'
    );

    // Then filter by date range if provided
    if (dateRange?.from && dateRange?.to) {
      const fromDate = parseDate(dateRange.from);
      const toDate = parseDate(dateRange.to);

      if (!fromDate || !toDate) return {
        data: aggregatedData,
        labels: aggregatedLabels,
        lastValidValue
      };

      const filtered = aggregatedLabels.reduce((acc, label, index) => {
        const date = parseDate(label);
        if (date && date >= fromDate && date <= toDate) {
          acc.labels.push(label);
          acc.data.push(aggregatedData[index]);
        }
        return acc;
      }, {labels: [], data: []});

      return {
        ...filtered,
        lastValidValue // Preserve the last valid value even after filtering
      };
    }

    return {
      data: aggregatedData,
      labels: aggregatedLabels,
      lastValidValue
    };
  };

  // Process metrics for charts
  const processedMetrics = useMemo(() => {
    if (!config) return config;

    const precision = config.precision || 'hour';
    const dateRange = config.dateRange;

    // Create a new object with processed data
    const processed = { ...config };

    // Process each numbered metric in the config
    for (let i = 0; i < 6; i++) {
      if (config[i] && config[i].data && config[i].labels) {
        const { data, labels } = processMetric(
          config[i].data,
          config[i].labels,
          precision,
          dateRange
        );
        processed[i] = {
          ...config[i],
          data,
          labels
        };
      }
    }

    return processed;
  }, [config, processMetric]);

    const getLatestValue = (metricIndex) => {
    const metric = processedMetrics[metricIndex];
    if (!metric?.data || metric.data.length === 0) return "N/A";

    // Search backwards through the data array to find the last non-null value
    for (let i = metric.data.length - 1; i >= 0; i--) {
      const value = metric.data[i];
      if (value !== null && value !== undefined && !isNaN(value)) {
        // Format the number to 1 decimal place if it's not a whole number
        return Number.isInteger(value) ? value : Number(value).toFixed(1);
      }
    }
    return "N/A";
  };

  return (
    <>
      <Row>
        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h4">Overview</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 0 }}>
              <div className="chart-area">
                <Row>
                  <Col xs="7">
                    <p>Status</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-right" style={{ color: "var(--purple)" }}>
                      ON
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <p>Oxygen Levels</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-right" style={{ color: "rgb(29,140,248)" }}>
                      {getLatestValue(0)} {processedMetrics[0]?.yLabel}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <p>Oxygen Flow Rate</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-right">70 L/min</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <p>Hydrogen Levels</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-right" style={{ color: "rgb(75,192,121)" }}>
                      {getLatestValue(1)} {processedMetrics[1]?.yLabel}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <p>Hydrogen Flow Rate</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-right">150 L/min</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <p>Pressure</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-right">
                      {getLatestValue(2)} {processedMetrics[2]?.yLabel}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <p>Temperature</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-right">
                      {getLatestValue(5)}{processedMetrics[5]?.yLabel}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <p>Water Level</p>
                  </Col>
                  <Col xs="5">
                    <p className="text-right">
                      {getLatestValue(4)}{processedMetrics[4]?.yLabel}
                    </p>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="8">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h4">Energy Consumption</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Bar
                  data={LineChartConfig(
                    processedMetrics[3]?.labels || [],
                    processedMetrics[3]?.title,
                    processedMetrics[3]?.data || []
                  )}
                  options={ChartOptions(processedMetrics[3]?.xLabel, processedMetrics[3]?.yLabel, 'bar')}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col sm="12">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h4">Gas Volume</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Line
                  data={LineChartConfig(
                    processedMetrics[0]?.labels || [],
                    processedMetrics[0]?.title,
                    processedMetrics[0]?.data || [],
                    processedMetrics[1]?.title,
                    processedMetrics[1]?.data || []
                  )}
                  options={ChartOptions(processedMetrics[0]?.xLabel, processedMetrics[0]?.yLabel)}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ChamberChart;