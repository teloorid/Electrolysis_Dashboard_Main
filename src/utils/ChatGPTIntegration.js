import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button, Input } from "reactstrap";
import ChartData from "../variables/ChartData";
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const ChatGPTIntegration = () => {
  const [query, setQuery] = useState(""); // Holds the user's query
  const [response, setResponse] = useState(""); // Holds the response from ChatGPT
  const [loading, setLoading] = useState(false); // Tracks the loading state
  const [chartData, setChartData] = useState([]);
  const [shouldVisualize, setShouldVisualize] = useState(false);
  const abortControllerRef = useRef(null); // Store controller reference to cancel ongoing requests

  const handleQuerySubmit = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse("Analyzing...");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel any previous request
    }

    abortControllerRef.current = new AbortController();

    // Extract sensor data safely
    const allSensorData = {};
    try {
      Object.entries(ChartData).forEach(([sensorType, sensorArrayData]) => {
        if (sensorArrayData?.[0]) {
          const { title, labels, data, xLabel, yLabel } = sensorArrayData[0];
          allSensorData[title] = {
            measurements: labels.slice(0, 10).map((label, index) => ({
              timestamp: label,
              value: data[index],
              unit: yLabel,
            })),
            timeUnit: xLabel,
          };
        }
      });
    } catch (error) {
      console.error("Error processing sensor data:", error);
      setResponse("Error processing sensor data.");
      setLoading(false);
      return;
    }

    console.log("Extracted Sensor Data:", allSensorData);

    // Format data for ChatGPT query
    const formattedData = Object.entries(allSensorData)
      .map(
        ([sensorName, sensorData]) => `
${sensorName} Data:
Time Unit: ${sensorData.timeUnit}
Measurements:
${sensorData.measurements
  .map((m) => `- ${m.timestamp}: ${m.value} ${sensorData.unit}`)
  .join("\n")}`
      )
      .join("\n\n");

    try {
      const timeoutId = setTimeout(() => abortControllerRef.current.abort(), 15000);
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant analyzing data." },
            { role: "user", content: `Here is the data: ${formattedData} \n\nDoes this query require a graph? (Yes/No). The query: ${query}` },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
        }
      );

      clearTimeout(timeoutId);

      const chatResponse = result.data.choices?.[0]?.message?.content || "No response received";
      setResponse(chatResponse);

      // Check if visualization is required
      if (/yes/i.test(chatResponse)) {
        setShouldVisualize(true);

        // Extract relevant data for visualization
        const oxygenData = allSensorData["Oxygen Volume"]?.measurements || [];
        const waterData = allSensorData["Water Level"]?.measurements || [];

        if (oxygenData.length === 0) {
          console.warn("No Oxygen Volume data available!");
          setShouldVisualize(false);
          return;
        }

        // Format data for the chart
        const formattedChartData = oxygenData.map((entry, index) => ({
          timestamp: new Date(entry.timestamp).toISOString(),
          oxygen: entry.value,
          waterLevel: waterData[index]?.value ?? null,
        }));

        setChartData(formattedChartData);
      } else {
        setShouldVisualize(false);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        setResponse("Request timed out. Please try again.");
      } else {
        console.error("Error communicating with OpenAI:", error);
        setResponse("Error processing your request.");
      }
    } finally {
      setLoading(false);
    }
  }, [query]);

  const renderChart = () => {
    if (!chartData.length) return <p>No data available for visualization.</p>;

    const formattedData = chartData.map((entry) => ({
      ...entry,
      timestamp: new Date(entry.timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return (
      <div style={{ marginTop: "20px" }}>
        <h5>Oxygen Volume & Water Level Trends</h5>
        <LineChart width={800} height={400} data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            angle={-30}
            textAnchor="end"
            interval="preserveStartEnd"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="oxygen" stroke="#8884d8" name="Oxygen Volume" />
          <Line type="monotone" dataKey="waterLevel" stroke="#82ca9d" name="Water Level" />
        </LineChart>
      </div>
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">ChatGPT Assistant</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col xs="9">
              <Input
                type="text"
                placeholder="Ask ChatGPT something..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleQuerySubmit()}
              />
            </Col>
            <Col xs="3">
              <Button color="primary" onClick={handleQuerySubmit} disabled={loading}>
                {loading ? "Analyzing..." : "Ask"}
              </Button>
            </Col>
          </Row>
          {response && (
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f8f9fa" }}>
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{response}</p>
            </div>
          )}

          {shouldVisualize && chartData.length > 0 && renderChart()}
        </CardBody>
      </Card>
    </div>
  );
};

export default ChatGPTIntegration;
