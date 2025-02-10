import React, { useState, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import classNames from "classnames";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Row,
    Col,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import ChamberChart from "../components/Charts/ChamberChart";
import ChartData from "../variables/ChartData";

const Chambers = () => {
    const Devices = useMemo(() => ["Chamber 1", "Chamber 2", "Chamber 3"], []);
    const [activeDevice, setActiveDevice] = useState(Devices[0]);
    const [dateRange, setDateRange] = useState([
        new Date(new Date() - 60 * 60 * 1000),
        new Date()
    ]);
    const [startDate, endDate] = dateRange;
    const [precision, setPrecision] = useState("minute");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const ensureDate = (date) => {
        if (!date) return new Date();
        return date instanceof Date ? date : new Date(date);
    };

    const calculatePrecisionAndPoints = useCallback((from, to) => {
        const fromDate = ensureDate(from);
        const toDate = ensureDate(to);
        const diffInHours = Math.ceil((toDate - fromDate) / (1000 * 60 * 60));
        const diffInDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));

        if (diffInHours <= 1) return { precision: "minute", points: 60 };
        if (diffInDays <= 1) return { precision: "hour", points: 24 };
        if (diffInDays <= 7) return { precision: "quarter-day", points: 28 };
        if (diffInDays <= 30) return { precision: "day", points: 30 };
        if (diffInDays <= 90) return { precision: "two-days", points: 45 };
        return { precision: "week", points: 52 };
    }, []);

const aggregateDataPoints = useCallback((sensor, from, to, targetPoints) => {
    const fromDate = ensureDate(from);
    const toDate = ensureDate(to);
    const { labels, data } = sensor;
    const timespan = toDate.getTime() - fromDate.getTime();
    const interval = timespan / (targetPoints - 1);

    // Reduced MAX_VALUE to match the data generation
    const MAX_VALUE = 500;

    const buckets = Array(targetPoints).fill().map(() => ({
        sum: 0,
        count: 0,
        timestamps: []
    }));

    // Enhanced data validation in distribution
    labels.forEach((label, index) => {
        const timestamp = new Date(label).getTime();
        if (timestamp >= fromDate.getTime() && timestamp <= toDate.getTime()) {
            const bucketIndex = Math.min(
                Math.floor(((timestamp - fromDate.getTime()) / timespan) * (targetPoints - 1)),
                targetPoints - 1
            );

            let value = data[index];

            // Enhanced value validation
            if (typeof value === 'string') {
                value = parseFloat(value);
            }

            if (!isNaN(value) && value !== null && value !== undefined) {
                value = Math.min(value, MAX_VALUE);
                buckets[bucketIndex].sum += value;
                buckets[bucketIndex].count++;
                buckets[bucketIndex].timestamps.push(timestamp);
            }
        }
    });

    // Process buckets into final data points
    const aggregatedLabels = [];
    const aggregatedData = [];

    buckets.forEach((bucket, i) => {
        // If we have data points in this bucket, use their average
        if (bucket.count > 0) {
            const averageValue = bucket.sum / bucket.count;
            const timestamp = bucket.timestamps.length > 0
                ? new Date(bucket.timestamps[Math.floor(bucket.timestamps.length / 2)])
                : new Date(fromDate.getTime() + (interval * i));

            aggregatedLabels.push(timestamp.toISOString());
            aggregatedData.push(averageValue);
        } else {
            // For empty buckets, use the calculated timestamp and null for the value
            const timestamp = new Date(fromDate.getTime() + (interval * i));
            aggregatedLabels.push(timestamp.toISOString());
            aggregatedData.push(null);  // Keep it null if there's no data
        }
    });

    return {
        ...sensor,
        labels: aggregatedLabels,
        data: aggregatedData,
    };
}, []);


    const getFilteredAndAggregatedData = useCallback((from, to) => {
        const { precision, points } = calculatePrecisionAndPoints(from, to);

        return Object.keys(ChartData).reduce((data, key) => {
            data[key] = ChartData[key].map(sensor =>
                aggregateDataPoints(sensor, from, to, points)
            );
            return data;
        }, {});
    }, [calculatePrecisionAndPoints, aggregateDataPoints]);

    const currentData = useMemo(() => {
        if (!startDate || !endDate) return null;
        return getFilteredAndAggregatedData(startDate, endDate);
    }, [startDate, endDate, getFilteredAndAggregatedData]);

    const handleDateChange = useCallback((update) => {
        if (!update[0] || !update[1]) return;

        setDateRange(update);
        const { precision } = calculatePrecisionAndPoints(update[0], update[1]);
        setPrecision(precision);
    }, [calculatePrecisionAndPoints]);

    const handleQuickSelect = useCallback((event, days) => {
        event.preventDefault();
        const now = new Date();
        const start = new Date();

        if (days === 0) {
            start.setHours(now.getHours() - 1);
        } else {
            start.setDate(now.getDate() - days);
        }

        handleDateChange([start, now]);
    }, [handleDateChange]);

    if (!currentData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="content">
            <div className="mb-4">
                <h1 className="h2">Water-Based Electrolysis Monitoring Dashboard</h1>
                <p className="text-muted">
                    Monitoring Oxygen and Hydrogen Harvesting at Kenyatta National Hospital
                </p>
            </div>

            <Card className="mb-4">
                <CardBody>
                    <Row>
                        <Col md="6" className="mb-3 mb-md-0">
                            <ButtonGroup className="w-100">
                                {Devices.map((device) => (
                                    <Button
                                        key={device}
                                        color="info"
                                        outline
                                        className={classNames("btn-simple", {
                                            active: activeDevice === device,
                                        })}
                                        onClick={() => setActiveDevice(device)}
                                    >
                                        {device}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Col>

                        <Col md="6">
                            <Row>
                                <Col xs="6">
                                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                        <DropdownToggle caret color="primary" outline>
                                            Quick Select
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={(e) => handleQuickSelect(e, 0)}>
                                                Last Hour
                                            </DropdownItem>
                                            <DropdownItem onClick={(e) => handleQuickSelect(e, 1)}>
                                                Last 24 Hours
                                            </DropdownItem>
                                            <DropdownItem onClick={(e) => handleQuickSelect(e, 7)}>
                                                Last 7 Days
                                            </DropdownItem>
                                            <DropdownItem onClick={(e) => handleQuickSelect(e, 30)}>
                                                Last 30 Days
                                            </DropdownItem>
                                            <DropdownItem onClick={(e) => handleQuickSelect(e, 90)}>
                                                Last 90 Days
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                                <Col xs="6">
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={handleDateChange}
                                        className="form-control"
                                        dateFormat="MMM dd, yyyy"
                                        placeholderText="Select date range"
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {activeDevice && currentData && (
                <ChamberChart
                    config={{
                        ...currentData[activeDevice],
                        precision,
                        dateRange: {
                            from: startDate,
                            to: endDate,
                        },
                    }}
                />
            )}
        </div>
    );
};

export default Chambers;