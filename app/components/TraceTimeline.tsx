import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TimelineProps {
    traces: Array<{
        id: string;
        duration: number;
        timestamp: string;
    }>;
}

const TimelineContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    height: '200px',
    position: 'relative',
    overflow: 'hidden',
}));

const TimelineDot = styled('div')(({ theme }) => ({
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#f44336',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
}));

const TimelineAxis = styled('div')(() => ({
    position: 'absolute',
    left: '40px',
    right: '40px',
    bottom: '30px',
    height: '2px',
    backgroundColor: '#e0e0e0',
}));

const TimelineLabel = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    bottom: '8px',
    transform: 'translateX(-50%)',
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
}));

const DurationLabel = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    left: '10px',
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
}));

const TraceTimeline: React.FC<TimelineProps> = ({ traces }) => {
    if (traces.length === 0) return <Typography>No Traces Available</Typography>;

    const timeRange = traces.reduce((range, trace) => {
        const time = new Date(`2024-02-01 ${trace.timestamp}`).getTime();
        return {
            min: Math.min(range.min, time),
            max: Math.max(range.max, time),
        };
    }, { min: Infinity, max: -Infinity });

    const maxDuration = Math.max(...traces.map((t) => t.duration)) || 1;
    const durationScale = 130 / maxDuration;

    const getPosition = (timestamp: string) => {
        const time = new Date(`2024-02-01 ${timestamp}`).getTime();
        return ((time - timeRange.min) / (timeRange.max - timeRange.min)) * 100;
    };

    const getDurationPosition = (duration: number) => {
        return 160 - duration * durationScale;
    };

    return (
        <TimelineContainer>
            {/* Duration axis labels */}
            {[0, 200, 400, 600, maxDuration].map((duration) => (
                <DurationLabel
                    key={duration}
                    sx={{ top: `${160 - duration * durationScale}px` }}
                >
                    {duration}ms
                </DurationLabel>
            ))}

            {/* Timeline points */}
            {traces.map((trace, index) => (
                <TimelineDot
                    key={trace.id || `trace-${index}`} // Fallback key if id is missing
                    sx={{
                        left: `${getPosition(trace.timestamp)}%`,
                        top: getDurationPosition(trace.duration),
                    }}
                />
            ))}

            {/* Time axis */}
            <TimelineAxis />

            {/* Time labels (show only at spaced intervals) */}
            {traces.filter((_, i) => i % Math.ceil(traces.length / 5) === 0).map((trace, index) => (
                <TimelineLabel
                    key={`${trace.id}-${index}`} // Combine trace.id and index for uniqueness
                    sx={{ left: `${getPosition(trace.timestamp)}%` }}
                >
                    {trace.timestamp}
                </TimelineLabel>
            ))}
        </TimelineContainer>
    );
};

export default TraceTimeline;
