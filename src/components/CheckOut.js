import React, { useState } from 'react'; import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'; import ResolveIcon from '@mui/icons-material/CheckCircleOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import '../assets/css/CheckOut.css';


function CheckOut({ entries, onResolve, clearEntries }) {
    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleClearEntries = () => {
        clearEntries(); // This function needs to be implemented in the parent component
        setOpen(false);
    };

    const exportToCSV = () => {
        const headers = "Name,Booth Location,Phone Number,Trolley Number,Notes,Timer\n";
        const rows = entries.sort((a, b) => (a.isResolved === b.isResolved) ? 0 : a.isResolved ? 1 : -1) // Sort unresolved first
            .map(entry =>
                `${entry.name},${entry.BoothLocation},${entry.phoneNumber},${entry.trolleyNumber},${entry.notes},${entry.timer}`
            ).join("\n");

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "checkout_data.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div>
            <Button startIcon={<FileDownloadIcon />} onClick={exportToCSV}>
                Export to CSV
            </Button>
            <Button startIcon={<DeleteForeverIcon />} onClick={handleOpenDialog} color="secondary">
                Clear Data
            </Button>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete all the data?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={handleClearEntries} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Booth Location</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Trolley Number</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Timer</TableCell>
                        <TableCell>On Time</TableCell>
                        <TableCell>Resolve</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.sort((a, b) => (a.isResolved === b.isResolved) ? 0 : a.isResolved ? 1 : -1) // Ensuring sort is applied in render
                        .map(entry => (
                            <TableRow key={entry.id} style={{ backgroundColor: entry.isResolved ? 'lightgreen' : 'red' }}>
                                <TableCell>{entry.name}</TableCell>
                                <TableCell>{entry.BoothLocation}</TableCell>
                                <TableCell>{entry.phoneNumber}</TableCell>
                                <TableCell>{entry.trolleyNumber}</TableCell>
                                <TableCell>{entry.notes}</TableCell>
                                <TableCell>{`${Math.floor(entry.timer / 60)}:${entry.timer % 60 < 10 ? `0${entry.timer % 60}` : entry.timer % 60}`}</TableCell>
                                <TableCell>{entry.isOnTime ? 'True' : 'False'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onResolve(entry.id)}>
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

export default CheckOut;
