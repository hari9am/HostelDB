import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getPayments, getMembers, createPayment } from '../services/api';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    member_id: '',
    amount: '',
    payment_type: '',
    description: '',
    due_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching payments and members data...');
      const [paymentsData, membersData] = await Promise.all([
        getPayments(),
        getMembers(),
      ]);
      console.log('Payments data:', paymentsData);
      console.log('Members data:', membersData);
      setPayments(paymentsData);
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };
  
  const handleErrorClose = () => setError(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting payment data:', formData);
      
      // Validate form data
      if (!formData.member_id) {
        setError('Please select a member');
        return;
      }
      if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        setError('Amount must be a positive number');
        return;
      }
      if (!formData.payment_type) {
        setError('Please select a payment type');
        return;
      }
      
      setSubmitting(true);
      console.log('Processed payment data:', {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      const response = await createPayment({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      console.log('Payment creation response:', response);
      
      handleClose();
      // Reset form
      setFormData({
        member_id: '',
        amount: '',
        payment_type: '',
        description: '',
        due_date: '',
      });
      
      // Show success message
      alert('Payment recorded successfully!');
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error creating payment:', error);
      setError(`Failed to record payment: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Record Payment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {members.find((m) => m.id === payment.member_id)?.name}
                </TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.payment_type}</TableCell>
                <TableCell>
                  {new Date(payment.payment_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {payment.due_date
                    ? new Date(payment.due_date).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={getStatusColor(payment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{payment.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Record New Payment</DialogTitle>
        <DialogContent>
          {error && (
            <Box sx={{ mb: 2, mt: 1, color: 'error.main' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Member"
              name="member_id"
              value={formData.member_id}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!formData.member_id && !!error}
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              margin="normal"
              required
              error={(!formData.amount || parseFloat(formData.amount) <= 0) && !!error}
              inputProps={{ min: 0.01, step: 0.01 }}
            />
            <TextField
              fullWidth
              select
              label="Payment Type"
              name="payment_type"
              value={formData.payment_type}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!formData.payment_type && !!error}
            >
              <MenuItem value="rent">Rent</MenuItem>
              <MenuItem value="deposit">Deposit</MenuItem>
              <MenuItem value="utility">Utility</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Due Date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Recording...' : 'Record Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Payments; 