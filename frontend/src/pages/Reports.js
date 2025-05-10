import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { getOccupancyReport, getPaymentsReport } from '../services/api';

function Reports() {
  const [occupancyData, setOccupancyData] = useState([]);
  const [paymentsData, setPaymentsData] = useState({ payments: [], total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [occupancyReport, paymentsReport] = await Promise.all([
        getOccupancyReport(),
        getPaymentsReport(),
      ]);
      setOccupancyData(occupancyReport);
      setPaymentsData(paymentsReport);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterPayments = async () => {
    try {
      setLoading(true);
      const report = await getPaymentsReport(
        dateRange.start_date,
        dateRange.end_date
      );
      setPaymentsData(report);
    } catch (error) {
      console.error('Error filtering payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Grid container spacing={3}>
        {/* Occupancy Report */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Room Occupancy Report
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room Number</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Current Occupancy</TableCell>
                    <TableCell>Occupancy Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {occupancyData.map((room) => (
                    <TableRow key={room.room_number}>
                      <TableCell>{room.room_number}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>{room.current_occupancy}</TableCell>
                      <TableCell>{room.occupancy_rate.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Payments Report */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payments Report
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={dateRange.start_date}
                    onChange={handleDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={dateRange.end_date}
                    onChange={handleDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    onClick={handleFilterPayments}
                    fullWidth
                  >
                    Filter
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentsData.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.member_id}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.payment_type}</TableCell>
                      <TableCell>
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{payment.status}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <strong>Total Amount:</strong>
                    </TableCell>
                    <TableCell>
                      <strong>${paymentsData.total_amount}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports; 