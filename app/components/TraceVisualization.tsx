"use client";

import React, { useState } from "react";
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

const TraceVisualization: React.FC<TraceVisualizationProps> = ({
    initialTraces = [],
}) => {
    const [traces, setTraces] = useState<Trace[]>(initialTraces);
    const [filters, setFilters] = useState<FilterState>({
        service: "frontend",
        operation: "all",
        tags: "",
        lookback: "Last Hour",
        maxDuration: "",
        minDuration: "",
        limit: 20,
    });

    const handleFindTraces = () => {
        // Mock filtering logic
        const filteredTraces = initialTraces.filter((trace) => {
            const matchesService = trace.services.some(
                (service) => service.name === filters.service
            );
            const matchesDuration =
                (!filters.maxDuration || trace.duration <= parseFloat(filters.maxDuration)) &&
                (!filters.minDuration || trace.duration >= parseFloat(filters.minDuration));
            return matchesService && matchesDuration;
        });

        setTraces(filteredTraces.slice(0, filters.limit)); // Apply limit
        console.log("Filtered traces:", filteredTraces);
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
                                <MenuItem value="frontend">frontend (7)</MenuItem>
                                <MenuItem value="backend">backend (5)</MenuItem>
                                <MenuItem value="database">database (3)</MenuItem>
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
                                <MenuItem value="all">all (5)</MenuItem>
                                <MenuItem value="create">create (2)</MenuItem>
                                <MenuItem value="update">update (3)</MenuItem>
                                <MenuItem value="delete">delete (1)</MenuItem>
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
                                <MenuItem value="Last Hour">Last Hour</MenuItem>
                                <MenuItem value="Last Day">Last Day</MenuItem>
                                <MenuItem value="Last Week">Last Week</MenuItem>
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
                        >
                            Find Traces
                        </Button>
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