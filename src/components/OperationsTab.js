import React, { useState, useEffect } from 'react'; 
import { Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, TextField, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import ResolveIcon from '@mui/icons-material/CheckCircleOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import moment from 'moment';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import '../assets/css/OperationsTab.css';

function OperationsTab({ drivers, setOperations, operations }) {
    // Load operations from localStorage or, if not exist, initialize as an empty array

    const [newOperation, setNewOperation] = useState({
        truckLocation: '',
        boothLocation: '',
        request: '',
        notes: '',
        assignedDriverId: 'N/A',
        priority: 'Low',
    });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const handleOpenConfirmDialog = () => {
        setConfirmDialogOpen(true);
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
    };
    const handleClearAllData = () => {
        setOperations([]); // this will clear all operations data
        localStorage.setItem('operations', JSON.stringify([])); // this will clear operations data from localStorage
        handleCloseConfirmDialog();
    };
    function formatSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setOperations(current => current.map(op => {
                if (!op.isResolved) {
                    return {
                        ...op,
                        requestTimeElapsed: op.requestTimeElapsed + 1,
                        reAssignedTimeElapsed: op.assignedDriverId === 'N/A' && op.reAssigned ? op.reAssignedTimeElapsed + 1 : op.reAssignedTimeElapsed,
                    };
                }
                return op;
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [setOperations, operations]);

    const handleAddOperation = () => {
        const operationToAdd = {
            ...newOperation,
            id: operations.length + 1,
            requestTimestamp: moment().format('MMMM D, YYYY hh:mm:ss A'),
            requestTimeElapsed: 1, // setting it to 1
            driverAssignedTimeElapsed: 0,
            reAssignedTimeElapsed: 0,
            isResolved: false,
        };

        setOperations(prev => [...prev, operationToAdd]);
        setNewOperation({
            truckLocation: '',
            boothLocation: '',
            request: '',
            notes: '',
            assignedDriverId: 'N/A',
            priority: 'Low',
        });
    };

    const handleChange = (field, value) => {
        setNewOperation(prev => ({ ...prev, [field]: value }));
    };

    const handleOperationChange = (id, field, value) => {
        setOperations(prev => prev.map(op => {
            if (op.id === id && !op.isResolved) { // Only allow changes if operation is not resolved
                if (field === 'assignedDriverId') {
                    // handle color change when going from driver to N/A
                    if (op.assignedDriverId !== 'N/A' && value === 'N/A') {
                        return {
                            ...op,
                            [field]: value,
                            reAssigned: true,
                            reAssignedTimeElapsed: op.reAssignedTimeElapsed + 1,
                        };
                    } else if (value !== 'N/A') { // driver is selected
                        return {
                            ...op,
                            [field]: value,
                            reAssigned: false,
                        };
                    }
                }
                // for all other fields
                return {
                    ...op,
                    [field]: value,
                };
            }
            return op;
        }));
    };
    const handleResolveOperation = (id) => {
        setOperations(prev => prev.map(op => {
            if (op.id === id) {
                return {
                    ...op,
                    isResolved: true,
                };
            }
            return op;
        }));
    };


    const handleDeleteOperation = (id) => {
        setOperations(prev => {
            const updated = prev.filter(op => op.id !== id);
            localStorage.setItem('operations', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <div>
            <Button startIcon={<FileDownloadIcon />} onClick={() => { }}>Export to CSV</Button>
            <Button startIcon={<DeleteForeverIcon />} onClick={handleOpenConfirmDialog} color="secondary">
                Clear Data
            </Button>
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>Clear All Data</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete all the data?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">No</Button>
                    <Button onClick={handleClearAllData} color="secondary">Yes</Button>
                </DialogActions>
            </Dialog>
            <div style={{ margin: '20px 0' }}>

                <TextField
                    label="Truck Location"
                    value={newOperation.truckLocation}
                    onChange={e => handleChange('truckLocation', e.target.value)}
                    style={{ marginRight: 10 }}
                />
                <TextField
                    label="Booth Location"
                    value={newOperation.boothLocation}
                    onChange={e => handleChange('boothLocation', e.target.value)}
                    style={{ marginRight: 10 }}
                />
                <TextField
                    label="Request"
                    value={newOperation.request}
                    onChange={e => handleChange('request', e.target.value)}
                    style={{ marginRight: 10 }}
                />
                <TextField
                    label="Notes"
                    value={newOperation.notes}
                    onChange={e => handleChange('notes', e.target.value)}
                    style={{ marginRight: 10 }}
                />
                <FormControl style={{ minWidth: 120, marginRight: 10 }}>
                    <InputLabel>Assigned Driver</InputLabel>
                    <Select
                        label = "Assigned Driver"
                        value={newOperation.assignedDriverId}
                        onChange={e => handleChange('assignedDriverId', e.target.value)}
                    >
                        {
                            ['N/A',
                                ...drivers.filter(driver =>
                                    !operations.some(op =>
                                        op.assignedDriverId === driver.name && !op.isResolved
                                    )
                                ).map(d => d.name)
                            ].map(name => (
                                <MenuItem key={name} value={name}>{name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl style={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        label = "Priority"
                        value={newOperation.priority}
                        onChange={e => handleChange('priority', e.target.value)}
                    >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={handleAddOperation} style={{ marginLeft: 20 }}>Add Operation</Button>
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Request Number</TableCell>
                        <TableCell>Truck Location</TableCell>
                        <TableCell>Booth Location</TableCell>
                        <TableCell>Request</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Assigned Driver</TableCell>
                        <TableCell>Request Timestamp</TableCell>
                        <TableCell>Request Time Elapsed (s)</TableCell>
                        <TableCell>Driver Assigned Time Elapsed (s)</TableCell>
                        <TableCell>ReAssigned Time Elapsed (s)</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Resolve</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {operations
                        .sort((a, b) => {
                            if (a.isResolved !== b.isResolved) {
                                return a.isResolved ? 1 : -1; // Unresolved operations come first
                            } else if (a.priority !== b.priority) {
                                return a.priority === 'High' ? -1 : 1; // Among unresolved ones, High priority comes first
                            } else {
                                return new Date(a.requestTimestamp) - new Date(b.requestTimestamp); // Earlier requests first
                            }
                        })
                        .map(operation => (
                            <TableRow
                                key={operation.id}
                                style={{
                                    backgroundColor: operation.isResolved
                                        ? 'lightgreen'
                                        : operation.assignedDriverId !== 'N/A'
                                            ? 'white'
                                            : operation.reAssigned
                                                ? 'yellow'
                                                : 'white',
                                }}
                            >
                                <TableCell>{operation.id}</TableCell>

                                <TableCell>
                                    <TextField
                                        value={operation.truckLocation}
                                        onChange={e => handleOperationChange(operation.id, 'truckLocation', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={operation.boothLocation}
                                        onChange={e => handleOperationChange(operation.id, 'boothLocation', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={operation.request}
                                        onChange={e => handleOperationChange(operation.id, 'request', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={operation.notes}
                                        onChange={e => handleOperationChange(operation.id, 'notes', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormControl fullWidth>
                                        <InputLabel>Assigned Driver</InputLabel>
                                        <Select
                                            value={operation.assignedDriverId}
                                            onChange={e => handleOperationChange(operation.id, 'assignedDriverId', e.target.value)}
                                        >
                                            {
                                                ['N/A',
                                                    ...drivers.filter(driver =>
                                                        !operation.isResolved && !operations.some(op =>
                                                            op.assignedDriverId === driver.name && !op.isResolved && op.id !== operation.id)
                                                            ? true
                                                            : operation.isResolved
                                                    )
                                                        .map(d => d.name)
                                                ].map(name => (
                                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>{operation.requestTimestamp}</TableCell>
                                <TableCell>{formatSeconds(operation.requestTimeElapsed)}</TableCell>
                                <TableCell>{formatSeconds(operation.driverAssignedTimeElapsed)}</TableCell>
                                <TableCell>{formatSeconds(operation.reAssignedTimeElapsed)}</TableCell>
                                <TableCell>
                                    <Select
                                        value={operation.priority}
                                        onChange={e => handleOperationChange(operation.id, 'priority', e.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="High">High</MenuItem>
                                        <MenuItem value="Low">Low</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDeleteOperation(operation.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleResolveOperation(operation.id)}>
                                        <ResolveIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default OperationsTab;