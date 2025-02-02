"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    TextField,
    Select,
    MenuItem,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Grid,
} from "@mui/material";
import SelectableTraceList from "./SelectableTraceList";
import TraceTimeline from "./TraceTimeline";

// TypeScript interfaces
interface Trace {
    id: string;
    endpoint: string;
    duration: number;
    spans: number;
    errors: number;
    services: Service[];
    timestamp: string;
}

interface Service {
    name: string;
    count: number;
    color: string;
}

interface FilterState {
    service: string;
    operation: string;
    tags: string;
    lookback: string;
    maxDuration: string;
    minDuration: string;
    limit: number;
}

interface TraceVisualizationProps {
    initialTraces?: Trace[];
}
const transformApiResponse = (apiResponse: any) => {
    return apiResponse.map((trace: any) => ({
        id: trace.traceID,
        endpoint: trace.spans[0]?.operationName || "Unknown",
        duration: trace.spans.reduce((sum: number, span: any) => sum + span.duration, 0) / 1000, // Convert microseconds to milliseconds
        spans: trace.spans.length,
        errors: trace.spans.filter((span: any) =>
            span.tags.some((tag: any) => tag.key === "http.status_code" && tag.value >= 400)
        ).length,
        services: extractServices(trace.processes),
        timestamp: new Date(trace.spans[0]?.startTime / 1000).toLocaleTimeString(), // Convert timestamp
    }));
};
interface Process {
    serviceName: string;
}

const extractServices = (processes: { [key: string]: Process }) => {
    // Extracting service names from the processes object
    const services = Object.values(processes).map((process, index) => ({
        name: process.serviceName,
        count: 1, // Placeholder; adjust as needed based on your logic
        color: getRandomColor()
    }));

    return services;
};
const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const TraceVisualization: React.FC<TraceVisualizationProps> = ({
    initialTraces = [],
}) => {
    const [traces, setTraces] = useState<Trace[]>(initialTraces);
    const [filters, setFilters] = useState<FilterState>({
        service: "frontend",
        operation: "all",
        tags: "",
        lookback: "1h",
        maxDuration: "",
        minDuration: "",
        limit: 20,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTraces = async () => {
        setLoading(true);
        setError(null);

        try {
            const endTimestamp = Date.now() * 1000;
            let startTimestamp = endTimestamp - 3600 * 1000 * 1000;

            if (filters.lookback === "1d") {
                startTimestamp = endTimestamp - 24 * 3600 * 1000 * 1000;
            } else if (filters.lookback === "1w") {
                startTimestamp = endTimestamp - 7 * 24 * 3600 * 1000 * 1000;
            }

            const params = new URLSearchParams({
                service: filters.service,
                lookback: filters.lookback,
                limit: filters.limit.toString(),
                start: startTimestamp.toString(),
                end: endTimestamp.toString(),
                tags: JSON.stringify({ driver: filters.tags.replace(/^driver=/, "") })
            });

            const apiUrl = `/api/traces?${params.toString()}`;

            const response = await fetch(apiUrl, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch traces 1: ${response}`);
            }

            const data = await response.json();
            console.log("Fetching:", data.data);
            setTraces(transformApiResponse(data.data) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch traces 2");
            console.error("Error fetching traces:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTraces(); // Fetch traces on initial load
    }, []);

    const handleFindTraces = () => {
        fetchTraces(); // Fetch traces when filters are updated
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Filters Panel */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            Filters
                        </Typography>

                        {/* Service Filter */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Service</InputLabel>
                            <Select
                                value={filters.service}
                                label="Service"
                                onChange={(e) =>
                                    setFilters({ ...filters, service: e.target.value as string })
                                }
                            >
                                <MenuItem value="frontend">frontend</MenuItem>
                                <MenuItem value="backend">backend</MenuItem>
                                <MenuItem value="database">database</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Operation Filter */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Operation</InputLabel>
                            <Select
                                value={filters.operation}
                                label="Operation"
                                onChange={(e) =>
                                    setFilters({ ...filters, operation: e.target.value as string })
                                }
                            >
                                <MenuItem value="all">all</MenuItem>
                                <MenuItem value="create">create</MenuItem>
                                <MenuItem value="update">update</MenuItem>
                                <MenuItem value="delete">delete</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Tags Filter */}
                        <TextField
                            fullWidth
                            label="Tags"
                            placeholder="http.status_code=200 error=true"
                            sx={{ mb: 2 }}
                            value={filters.tags}
                            onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
                        />

                        {/* Lookback Filter */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Lookback</InputLabel>
                            <Select
                                value={filters.lookback}
                                label="Lookback"
                                onChange={(e) =>
                                    setFilters({ ...filters, lookback: e.target.value as string })
                                }
                            >
                                <MenuItem value="1h">Last Hour</MenuItem>
                                <MenuItem value="1d">Last Day</MenuItem>
                                <MenuItem value="1w">Last Week</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Duration Filters */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Max Duration"
                                    placeholder="e.g. 1.2s, 100ms"
                                    value={filters.maxDuration}
                                    onChange={(e) =>
                                        setFilters({ ...filters, maxDuration: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Min Duration"
                                    placeholder="e.g. 1.2s, 100ms"
                                    value={filters.minDuration}
                                    onChange={(e) =>
                                        setFilters({ ...filters, minDuration: e.target.value })
                                    }
                                />
                            </Grid>
                        </Grid>

                        {/* Limit Results */}
                        <TextField
                            fullWidth
                            label="Limit Results"
                            type="number"
                            sx={{ mb: 2 }}
                            value={filters.limit}
                            onChange={(e) =>
                                setFilters({ ...filters, limit: parseInt(e.target.value) })
                            }
                        />

                        {/* Find Traces Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            onClick={handleFindTraces}
                            sx={{ py: 1.5, fontWeight: "bold", boxShadow: 2 }}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Find Traces"}
                        </Button>

                        {/* Error Message */}
                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Traces Display */}
                <Grid item xs={12} md={9}>
                    <TraceTimeline traces={traces} />
                    <SelectableTraceList traces={traces} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default TraceVisualization;