import React from "react";
import { Line, Bar} from "react-chartjs-2";

import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

import { ChartOptions, LineChartConfig } from "variables/ChartConfig";

function GeottoGreenhouseChart(props) {
  const { config } = props;

  return (
    <>
      <Row>
        <Col lg="6">
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

        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 1</h5>
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
      </Row>

      <Row>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 2</h5>
              <CardTitle tag="h4">Temperature</CardTitle>
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
                    config[3].title,
                    config[3].labels,
                    config[3].data
                  )}
                  options={ChartOptions(config[3].xLabel, config[3].yLabel)}
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
              <h5 className="card-category">Sensor 3</h5>
              <CardTitle tag="h4">Water Levels</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Bar
                  data={LineChartConfig(
                    config[4].title,
                    config[4].labels,
                    config[4].data
                  )}
                  options={ChartOptions(config[4].xLabel, config[4].yLabel, 'bar')}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="8">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 3</h5>
              <CardTitle tag="h4">Water Flow Rate</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Line
                  data={LineChartConfig(
                    config[5].title,
                    config[5].labels,
                    config[5].data
                  )}
                  options={ChartOptions(config[5].xLabel, config[5].yLabel)}
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
              <h5 className="card-category">Sensor 4</h5>
              <CardTitle tag="h4">Soil Moisture</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Line
                  data={LineChartConfig(
                    config[6].title,
                    config[6].labels,
                    config[6].data
                  )}
                  options={ChartOptions(config[6].xLabel, config[6].yLabel)}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Sensor 4</h5>
              <CardTitle tag="h4">CO2</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: 0 }}>
              <div className="chart-area">
                <Line
                  data={LineChartConfig(
                    config[7].title,
                    config[7].labels,
                    config[7].data
                  )}
                  options={ChartOptions(config[7].xLabel, config[7].yLabel)}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default GeottoGreenhouseChart;
