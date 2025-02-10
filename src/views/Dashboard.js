import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

import { Bar } from "react-chartjs-2";
import { ChartOptions, LineChartConfig } from "variables/ChartConfig";
import ChartData from "variables/ChartData";
import ChatGPTIntegration from "../utils/ChatGPTIntegration";

const WaterLevelTank = ({ level }) => {
  level = level > 100 ? 100 : level < 0 ? 0 : level;

  return (
    <div
      style={{
        height: 170,
        width: 60,
        border: "2px solid rgb(29,140,248)",
        position: "relative",
      }}
    >
      <div
        className="absolute transition-all duration-500"
        style={{
          height: `${level}%`,
          minHeight: "10%",
          width: "100%",
          backgroundColor: "rgb(29,140,248)",
          bottom: 0,
          position: "absolute",
        }}
      />
      <p
        className="text-center"
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: `calc(${(100 - level - 1) / 100} * 170px)`,
          color: "#fff",
        }}
      >
        {level}%
      </p>
    </div>
  );
};

function Dashboard(props) {
  return (
    <>
        <div className="content">
            <div>
                <h1
                    className="text-2xl font-bold text-gray-800"
                    style={{marginTop: -10}}
                >
                    Water-Based Electrolysis Monitoring Dashboard
                </h1>
                <p
                    className="text-gray-600"
                    style={{marginTop: -20, marginBottom: 30}}
                >
                    Monitoring Oxygen and Hydrogen Harvesting at Kenyatta National
                    Hospital
                </p>
            </div>

            {/* ChatGPT Prompt Section */}
            <ChatGPTIntegration/>

                <Row>

                    {
                        Object.keys(ChartData).filter((device) => device.includes('Chamber')).map((key) => {
                            const chamber = ChartData[key];

                            // Add safety checks for data access
                            const oxygenLevel = chamber[0]?.data?.length ? chamber[0].data[chamber[0].data.length - 1] : "N/A";
                            const hydrogenLevel = chamber[1]?.data?.length ? chamber[1].data[chamber[1].data.length - 1] : "N/A";
                            const pressure = chamber[2]?.data?.length ? chamber[2].data[0] : "N/A";

                            return <Col lg="4" key={key}>
                                <Card className="card-chart">
                                    <CardHeader>
                                        <CardTitle tag="h4" style={{fontWeight: 600}}>
                                            {key}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody style={{padding: 15, paddingTop: 0}}>
                                        <Row>
                                            <Col xs="7">
                                                <p>Status</p>
                                            </Col>
                                            <Col xs="5">
                                                <p
                                                    className="text-right"
                                                    style={{color: "var(--purple)"}}
                                                >
                                                    ON
                                                </p>
                                                {/* <p className="text-right" style={{color: 'var(--danger)'}}>OFF</p> */}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="7">
                                                <p>Oxygen Levels</p>
                                            </Col>
                                            <Col xs="5">
                                                <p
                                                    className="text-right"
                                                    style={{color: "rgb(29,140,248)"}}
                                                >
                                                    {oxygenLevel} {chamber[0]?.yLabel || ''}
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
                                                <p
                                                    className="text-right"
                                                    style={{color: "rgb(75,192,121)"}}
                                                >
                                                    {hydrogenLevel} {chamber[1]?.yLabel || ''}
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
                                                <p className="text-right">{pressure} {chamber[2]?.yLabel || ''}</p>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        })
                    }

                    {/* <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h4" style={{ fontWeight: 600 }}>
                  Chamber 1
                </CardTitle>
              </CardHeader>
              <CardBody style={{ padding: 15, paddingTop: 0 }}>
                <Row>
                  <Col xs="7">
                    <p>Status</p>
                  </Col>
                  <Col xs="5">
                    <p
                      className="text-right"
                      style={{ color: "var(--purple)" }}
                    >
                      ON
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="7">
                    <p>Oxygen Levels</p>
                  </Col>
                  <Col xs="5">
                    <p
                      className="text-right"
                      style={{ color: "rgb(29,140,248)" }}
                    >
                      250L
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
                    <p
                      className="text-right"
                      style={{ color: "rgb(75,192,121)" }}
                    >
                      500 L
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
                    <p className="text-right">20 PSI</p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col> */}
                </Row>

                <Row>
                    <Col lg="6">
                        <Card className="card-chart">
                            <CardHeader>
                                <CardTitle tag="h4">Gas Volumes</CardTitle>
                            </CardHeader>
                            <CardBody style={{paddingTop: 10}}>
                                <div className="chart-area">
                                    <Bar
                                        data={LineChartConfig(
                                            ["Chamber 1", "Chamber 2", "Chamber 3"],
                                            "Oxygen",
                                            [
                                                ChartData["Chamber 1"][0].data[
                                                ChartData["Chamber 1"][0].data?.length - 1
                                                    ],
                                                ChartData["Chamber 2"][0].data[
                                                ChartData["Chamber 2"][0].data?.length - 1
                                                    ],
                                                ChartData["Chamber 3"][0].data[
                                                ChartData["Chamber 3"][0].data?.length - 1
                                                    ],
                                            ],
                                            "Hydrogen",
                                            [
                                                ChartData["Chamber 1"][1].data[
                                                ChartData["Chamber 1"][1].data?.length - 1
                                                    ],
                                                ChartData["Chamber 2"][1].data[
                                                ChartData["Chamber 2"][1].data?.length - 1
                                                    ],
                                                ChartData["Chamber 3"][1].data[
                                                ChartData["Chamber 3"][1].data?.length - 1
                                                    ],
                                            ]
                                        )}
                                        options={ChartOptions("Gas", "L", "bar")}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col lg="6">
                        <Card className="card-chart">
                            <CardHeader>
                                <CardTitle tag="h4">Water Levels</CardTitle>
                            </CardHeader>
                            <CardBody
                                style={{
                                    padding: 15,
                                    paddingTop: 10,
                                    paddingLeft: "10%",
                                    paddingRight: "10%",
                                }}
                            >
                                <div className="chart-area">
                                    <Row>
                                        <Col
                                            xs="3"
                                            style={{
                                                alignItems: "center",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <WaterLevelTank
                                                level={ChartData["Water Reservoir"][0].data[0]}
                                            />
                                            <p
                                                style={{
                                                    fontSize: 11,
                                                    lineHeight: 1.25,
                                                    marginTop: 10,
                                                }}
                                            >
                                                Water Reservoir
                                            </p>
                                        </Col>
                                        <Col
                                            xs="3"
                                            style={{
                                                alignItems: "center",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <WaterLevelTank level={ChartData["Chamber 1"][4].data[0]}/>
                                            <p
                                                style={{
                                                    fontSize: 11,
                                                    lineHeight: 1.25,
                                                    marginTop: 10,
                                                }}
                                            >
                                                Chamber 1
                                            </p>
                                        </Col>
                                        <Col
                                            xs="3"
                                            style={{
                                                alignItems: "center",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <WaterLevelTank level={ChartData["Chamber 2"][4].data[0]}/>
                                            <p
                                                style={{
                                                    fontSize: 11,
                                                    lineHeight: 1.25,
                                                    marginTop: 10,
                                                }}
                                            >
                                                Chamber 2
                                            </p>
                                        </Col>
                                        <Col
                                            xs="3"
                                            style={{
                                                alignItems: "center",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <WaterLevelTank level={ChartData["Chamber 3"][4].data[0]}/>
                                            <p
                                                style={{
                                                    fontSize: 11,
                                                    lineHeight: 1.25,
                                                    marginTop: 10,
                                                }}
                                            >
                                                Chamber 3
                                            </p>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
        );
}

export default Dashboard;
