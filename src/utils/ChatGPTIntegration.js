import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button, Input } from "reactstrap";
import ChartData from "../variables/ChartData";
import { useState } from "react";
import axios from "axios";

const ChatGPTIntegration = () => {
  const [query, setQuery] = useState(""); // Holds the user's query
  const [response, setResponse] = useState(""); // Holds the response from ChatGPT
  const [loading, setLoading] = useState(false); // Tracks the loading state

  // Function to handle the query submission
  const handleQuerySubmit = async () => {
    if (!query) return;

    setLoading(true);
    setResponse("Analyzing...");

    const allSensorData = {};

    Object.entries(ChartData).forEach(([sensorType, sensorArrayData]) => {
      if (sensorArrayData?.[0]) {
        const { title, labels, data, xLabel, yLabel } = sensorArrayData[0];
        allSensorData[title] = {
          measurements: labels.map((label, index) => ({
            timestamp: label,
            value: data[index],
            unit: yLabel
          })),
          timeUnit: xLabel
        };
      }
    });

    // Format the data in a clear, structured way for ChatGPT
    const formattedData = Object.entries(allSensorData)
      .map(([sensorName, sensorData]) => `
${sensorName} Data:
Time Unit: ${sensorData.timeUnit}
Measurements:
${sensorData.measurements
  .map(m => `- ${m.timestamp}: ${m.value} ${sensorData.unit}`)
  .join('\n')}`)
      .join('\n\n');

    try {
      const result = await axios.post(
        "https://cors-anywhere.herokuapp.com/https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant analyzing data." },
            { role: "user", content: `Here is the data: ${formattedData} Now, please answer the following question: ${query}` },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
            "Origin": window.location.origin,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      // Check if the response contains the expected data
      if (result.data && result.data.choices && result.data.choices[0]) {
        setResponse(result.data.choices[0].message.content); // Set response from API result
      } else {
        setResponse("Sorry, I couldn't process your query.");
      }
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
      setResponse("Sorry, I couldn't process your query.");
    } finally {
      setLoading(false); // Stop loading after API call
    }
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
                onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
              />
            </Col>
            <Col xs="3">
              <Button color="primary" onClick={handleQuerySubmit} disabled={loading}>
                {loading ? "Analyzing..." : "Ask"}
              </Button>
            </Col>
          </Row>
          {response && (
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f8f9fa"}}>
                <p style={{whiteSpace: "pre-wrap", margin: 0}}>{response}</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ChatGPTIntegration;
