import React from "react";
import { Line, Doughnut } from "react-chartjs-2";

import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

import { ChartOptions, LineChartConfig, PieChartConfig } from "variables/ChartConfig";

function GeottoIncubatorChart(props) {
  const { config } = props;

  return (
    <>
      <Row>
        <Col xs="12">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 1</h5>
              <CardTitle tag="h4">Temperature</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Line
                  data={LineChartConfig(
                    config[0].title,
                    config[0].labels,
                    config[0].data
                  )}
                  options={ChartOptions(config[0].xLabel, config[0].yLabel)}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 2</h5>
              <CardTitle tag="h4">Humidity</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Line
                  data={LineChartConfig(
                    config[1].title,
                    config[1].labels,
                    config[1].data
                  )}
                  options={ChartOptions(config[1].xLabel, config[1].yLabel)}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 3</h5>
              <CardTitle tag="h4">CO2</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Line
                  data={LineChartConfig(
                    config[2].title,
                    config[2].labels,
                    config[2].data
                  )}
                  options={ChartOptions(config[2].xLabel, config[2].yLabel)}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 4</h5>
              <CardTitle tag="h4">Hatching Cycle (Chicken)</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Doughnut
                  data={PieChartConfig(
                    config[3].title,
                    ['Elapsed Days', 'Remaining Days'],
                    [config[3].data[0], 21 - config[3].data[0]]
                  )}
                  options={ChartOptions(config[3].xLabel, config[3].yLabel, 'pie')}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 5</h5>
              <CardTitle tag="h4">Hatching Cycle (Quails)</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Doughnut
                  data={PieChartConfig(
                    config[4].title,
                    ['Elapsed Days', 'Remaining Days'],
                    [config[4].data[0], 19 - config[4].data[0]]
                  )}
                  options={ChartOptions(config[4].xLabel, config[4].yLabel, 'pie')}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="4">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 6</h5>
              <CardTitle tag="h4">Hatching Cycle (Ducks)</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Doughnut
                  data={PieChartConfig(
                    config[5].title,
                    ['Elapsed Days', 'Remaining Days'],
                    [config[5].data[0], 24 - config[5].data[0]]
                  )}
                  options={ChartOptions(config[5].xLabel, config[5].yLabel, 'pie')}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default GeottoIncubatorChart;
