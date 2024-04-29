import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import '../assets/css/DriverProfileTab.css';

function DriverProfileTab({ drivers, setDrivers, operations }) {
    const [newDriverName, setNewDriverName] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleAddDriver = () => {
        if (newDriverName) {
            setDrivers(prevDrivers => [...prevDrivers, { id: drivers.length + 1, name: newDriverName }]);
            setNewDriverName('');  // Clear the input after adding
            handleCloseDialog();
        }
    };

    const handleDeleteDriver = (driverId) => {
        setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== driverId));
    };
    useEffect(() => {
        // Force a re-render when `operations` or `drivers` state changes
    }, [operations, drivers]);
    return (
        <div>
            <Button startIcon={<AddIcon />} onClick={handleOpenDialog} color="primary">
                Add Driver
            </Button>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Driver's Name"
                        type="text"
                        fullWidth
                        value={newDriverName}
                        onChange={e => setNewDriverName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddDriver} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Driver's Name</TableCell>
                        <TableCell>Request Number</TableCell>
                        <TableCell>Booth Location</TableCell>
                        <TableCell>Truck Location</TableCell>
                        <TableCell>Request</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {drivers.map((driver) => (
                        <TableRow key={driver.id}>
                            <TableCell>{driver.name}</TableCell>
                            <TableCell>{operations.find(op => op.assignedDriverId === driver.name)?.id || 'N/A'}</TableCell>
                            <TableCell>{operations.find(op => op.assignedDriverId === driver.name)?.boothLocation || 'N/A'}</TableCell>
                            <TableCell>{operations.find(op => op.assignedDriverId === driver.name)?.truckLocation || 'N/A'}</TableCell>
                            <TableCell>{operations.find(op => op.assignedDriverId === driver.name)?.request || 'N/A'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleDeleteDriver(driver.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default DriverProfileTab;
