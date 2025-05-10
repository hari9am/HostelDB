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
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { getRooms, createRoom } from '../services/api';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    room_number: '',
    capacity: '',
    room_type: '',
    price_per_month: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching rooms data...');
      const roomsData = await getRooms();
      console.log('Rooms data received:', roomsData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Failed to load rooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
      console.log('Submitting room data:', formData);
      
      // Validate form data
      if (!formData.room_number) {
        setError('Room number is required');
        return;
      }
      if (!formData.capacity || isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
        setError('Capacity must be a positive number');
        return;
      }
      if (!formData.room_type) {
        setError('Room type is required');
        return;
      }
      if (!formData.price_per_month || isNaN(formData.price_per_month) || parseFloat(formData.price_per_month) <= 0) {
        setError('Price per month must be a positive number');
        return;
      }
      
      // Create room data object with proper types
      const roomData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price_per_month: parseFloat(formData.price_per_month),
      };
      
      console.log('Processed room data:', roomData);
      
      setLoading(true);
      const response = await createRoom(roomData);
      console.log('Room creation response:', response);
      
      handleClose();
      setFormData({
        room_number: '',
        capacity: '',
        room_type: '',
        price_per_month: '',
      });
      
      // Success message
      setError(null);
      alert('Room created successfully!');
      
      // Reload room data
      fetchData();
    } catch (error) {
      console.error('Error creating room:', error);
      setError(`Failed to create room: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'warning';
      case 'maintenance':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && rooms.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Rooms</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Room
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Current Occupancy</TableCell>
              <TableCell>Price/Month</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.room_number}</TableCell>
                  <TableCell>{room.room_type}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.current_occupancy}</TableCell>
                  <TableCell>${room.price_per_month}</TableCell>
                  <TableCell>
                    <Chip
                      label={room.status}
                      color={getStatusColor(room.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No rooms found. Add a new room to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Room Number"
              name="room_number"
              value={formData.room_number}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!formData.room_number && error}
              helperText={!formData.room_number && error ? "Room number is required" : ""}
            />
            <TextField
              fullWidth
              select
              label="Room Type"
              name="room_type"
              value={formData.room_type}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!formData.room_type && error}
              helperText={!formData.room_type && error ? "Room type is required" : ""}
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Double">Double</MenuItem>
              <MenuItem value="Dormitory">Dormitory</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!formData.capacity && error}
              helperText={!formData.capacity && error ? "Capacity is required" : ""}
            />
            <TextField
              fullWidth
              label="Price per Month"
              name="price_per_month"
              type="number"
              value={formData.price_per_month}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!formData.price_per_month && error}
              helperText={!formData.price_per_month && error ? "Price is required" : ""}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Adding...' : 'Add Room'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Rooms; 