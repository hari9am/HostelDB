import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Hotel as HotelIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { getRooms, getMembers, getPayments } from '../services/api';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRooms: 0,
    totalPayments: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, members, payments] = await Promise.all([
          getRooms(),
          getMembers(),
          getPayments(),
        ]);

        const totalRooms = rooms.length;
        const totalMembers = members.length;
        const totalPayments = payments.length;
        const occupancyRate = rooms.reduce((acc, room) => {
          return acc + (room.current_occupancy / room.capacity);
        }, 0) / totalRooms * 100;

        setStats({
          totalMembers,
          totalRooms,
          totalPayments,
          occupancyRate: Math.round(occupancyRate),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color }) => (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography component="p" variant="h4">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<PeopleIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rooms"
            value={stats.totalRooms}
            icon={<HotelIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Payments"
            value={stats.totalPayments}
            icon={<PaymentIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            icon={<HotelIcon sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 