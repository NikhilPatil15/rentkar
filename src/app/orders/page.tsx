'use client'
import React, { useState, useEffect } from 'react';
// import { fetchOrders } from '../api/ordersApi';
import { OrderTypes } from '@/types/order.type';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';

const Page: React.FC = () => {
  const [orders, setOrders] = useState<OrderTypes[]>([]);

  // useEffect(() => {
  //   const loadOrders = async () => {
  //     const data = await fetchOrders();
  //     setOrders(data);
  //   };
  //   loadOrders();
  // }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.orderNumber}>
            <Card>
              <CardContent>
                <Typography variant="h6">{order.orderNumber}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Customer: {order.customer.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Area: {order.area}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2">
                  Status: <Chip label={order.status} color="primary" />
                </Typography>
                <Typography variant="body2">
                  {/* Total: ₹{order.items?.price} */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Page;