'use client'
import React, { useEffect, useState } from 'react';
// import { fetchActiveAssignments, fetchAssignmentMetrics } from '../api/assignmentsApi';
import { AssignmentTypes, AssignmentMetrics } from '@/types/assignment.type'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';

const Page: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentTypes[]>([]);
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);

  // useEffect(() => {
  //   const loadAssignments = async () => {
  //     const data = await fetchActiveAssignments();
  //     setAssignments(data);
  //   };

  //   const loadMetrics = async () => {
  //     const data = await fetchAssignmentMetrics();
  //     setMetrics(data);
  //   };

  //   loadAssignments();
  //   loadMetrics();
  // }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assignments Dashboard
      </Typography>
      {metrics && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Total Assigned: {metrics.totalAssigned}</Typography>
          <Typography variant="subtitle1">Success Rate: {metrics.successRate}%</Typography>
          <Typography variant="subtitle1">Average Time: {metrics.averageTime} mins</Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      <Grid container spacing={3}>
        {assignments.map((assignment) => (
          <div key={assignment.orderId.toString()}>
          <Grid item xs={12} sm={6} md={4} >
            <Card>
              <CardContent>
                <Typography variant="h6">Order ID: {assignment.orderId.toString()}</Typography>
                <Typography variant="body2">Partner ID: {assignment.partnerId.toString()}</Typography>
                <Typography variant="body2">
                  Status: <Chip label={assignment.status} color={assignment.status === 'success' ? 'success' : 'error'} />
                </Typography>
                {assignment.reason && (
                  <Typography variant="body2" color="textSecondary">
                    Reason: {assignment.reason}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          </div>
        ))}
      </Grid>
    </Box>
  );
};

export default Page;