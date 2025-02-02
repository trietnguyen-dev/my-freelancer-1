import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Checkbox,
  Alert,
  Paper,
} from '@mui/material';
import { CompareArrows } from '@mui/icons-material';

interface Service {
  name: string;
  count: number;
  color: string;
}

interface Trace {
  id: string;
  endpoint: string;
  duration: number;
  spans: number;
  errors: number;
  services: Service[];
  timestamp: string;
}

interface SelectableTraceListProps {
  traces: Trace[];
}

const SelectableTraceList: React.FC<SelectableTraceListProps> = ({ traces }) => {
  const [selectedTraces, setSelectedTraces] = useState<string[]>([]);

  const handleTraceSelect = (traceId: string) => {
    setSelectedTraces(prev => {
      if (prev.includes(traceId)) {
        return prev.filter(id => id !== traceId);
      } else {
        return [...prev, traceId];
      }
    });
  };

  const handleCompareTraces = () => {
    console.log('Comparing traces:', selectedTraces);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          {traces.length} Traces
        </Typography>
        <Box>
          <Button variant="outlined" sx={{ mr: 1 }}>
            Download Results
          </Button>
          <Button variant="outlined">
            Deep Dependency Graph
          </Button>
        </Box>
      </Box>

      {selectedTraces.length > 0 && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleCompareTraces}
              startIcon={<CompareArrows />}
            >
              Compare Traces
            </Button>
          }
        >
          {selectedTraces.length} Selected for comparison
        </Alert>
      )}

      {traces.map((trace) => (
        console.log(trace.id + "ád"),
        <Card
          key={trace.id}
          sx={{
            mb: 2,
            backgroundColor: selectedTraces.includes(trace.id) ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
            transition: 'background-color 0.3s'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                checked={selectedTraces.includes(trace.id)}
                onChange={() => handleTraceSelect(trace.id)}
                color="primary"
              />

              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" component="div">
                    {trace.endpoint}
                    <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                      {trace.id}
                    </Typography>
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {trace.duration}ms
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip
                    label={`${trace.spans} Spans`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${trace.errors} Errors`}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(trace.services ?? []).map((service) => (
                    <Chip
                      key={service.name}
                      label={`${service.name} (${service.count})`}
                      size="small"
                      sx={{
                        bgcolor: service.color,
                        color: 'white',
                        '&:hover': {
                          bgcolor: service.color,
                          opacity: 0.9,
                        },
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {trace.timestamp}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );
};

export default SelectableTraceList;