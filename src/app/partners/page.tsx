"use client";

import React, { useEffect, useState } from "react";
import { DeliveryPartnerTypes } from "@/types/partner.type";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";

const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<DeliveryPartnerTypes[]>([]);

  useEffect(() => {
    const loadPartners = async () => {
      const data = await axios.get("/api/partner");
      setPartners(data.data.data);
    };
    loadPartners();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <div className="flex justify-between">
      <Typography variant="h4" gutterBottom>
        Delivery Partners
      </Typography>
      <Typography>
        <Button variant="contained">
          Add Partner
        </Button>
      </Typography>
      </div>

      <Grid container spacing={3}>
        {partners?.map((partner) => (
          <Grid item xs={12} sm={6} md={4} key={partner._id}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  {partner.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">{partner.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {partner.email}
                  </Typography>
                </Box>
              </Stack>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Status:{" "}
                  <Chip
                    label={partner.status}
                    color={partner.status === "active" ? "success" : "warning"}
                  />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Areas: {partner.areas.join(", ")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Shift: {partner.shift.start} - {partner.shift.end}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current Load: {partner.currentLoad}/3
                </Typography>
              </CardContent>
              <Button variant="contained" fullWidth>
                View Profile
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PartnersPage;
