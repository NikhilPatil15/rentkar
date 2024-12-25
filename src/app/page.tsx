"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
// import { fetchOrders } from '../api/ordersApi';
// import { fetchPartners } from '../api/partnersApi';
// import { fetchAssignmentMetrics } from '../api/assignmentsApi';
import { DeliveryPartnerTypes } from '@/types/partner.type';
import { OrderTypes } from '@/types/order.type';
import { AssignmentMetrics } from '@/types/assignment.type';
import axios from 'axios';

 const page: React.FC = () => {
  const [orders, setOrders] = useState<OrderTypes[] | any>([]);
  const [partners, setPartners] = useState<DeliveryPartnerTypes[] | any>([]);
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);

  useEffect(() => {

    const fetchOrders = async():Promise<OrderTypes> => {
      const response = await axios.get('/api/order')

      return response.data.data
    }

    const fetchPartners = async():Promise<DeliveryPartnerTypes> => {
      const response = await axios.get('/api/partner')

      return response.data.data
    }

    const fetchAssignmentMetrics = async():Promise<AssignmentMetrics> => {
      const response = await axios.get('/api/assignments/metrics')

      return response.data.data
    }

    const loadDashboardData = async () => {
      const [ordersData, partnersData, metricsData] = await Promise.all([
        fetchOrders(),
        fetchPartners(),
        fetchAssignmentMetrics(),
      ]);
      setOrders(ordersData);
      setPartners(partnersData);
      setMetrics(metricsData);
    };

    

    loadDashboardData();
  }, []);

  const activeOrders = orders.filter((order:OrderTypes) => order.status !== 'delivered');
  const activePartners = partners.filter((partner:DeliveryPartnerTypes) => partner.status === 'active');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Key Metrics */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Total Active Orders</Typography>
              <Typography variant="h5">{activeOrders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Total Active Partners</Typography>
              <Typography variant="h5">{activePartners.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {metrics && (
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Success Rate</Typography>
                <Typography variant="h5">{metrics.successRate}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        {/* Active Orders */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Active Orders
          </Typography>
          <Grid container spacing={2}>
            {activeOrders.map((order:OrderTypes) => (
              <Grid item xs={12} sm={6} key={order.orderNumber}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{order.orderNumber}</Typography>
                    <Typography variant="body2">Area: {order.area}</Typography>
                    <Typography variant="body2">Status: {order.status}</Typography>
                    <Typography variant="body2">                  
                      {/* Total: ${order.items} */}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Partner Availability */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Partner Availability
          </Typography>
          <Grid container spacing={2}>
            {activePartners.map((partner:DeliveryPartnerTypes) => (
              <Grid item xs={12} sm={6} key={partner._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{partner.name}</Typography>
                    <Typography variant="body2">Phone: {partner.phone}</Typography>
                    <Typography variant="body2">
                      Load: {partner.currentLoad} / 3
                    </Typography>
                    <Typography variant="body2">
                      Status: <Chip label={partner.status} color="success" />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export default page