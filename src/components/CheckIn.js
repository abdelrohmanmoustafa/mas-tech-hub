import React from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material'; import DeleteIcon from '@mui/icons-material/Delete';
import ResolveIcon from '@mui/icons-material/CheckCircleOutline';
import '../assets/css/CheckIn.css';


function CheckIn({ entries, addEntry, defaultTimer, handleTimerChange, deleteEntry, handleResolve, handleEntryChange }) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newEntry = {
            id: Date.now(),
            name: data.get('name'),
            BoothLocation: data.get('Booth Location'),
            phoneNumber: data.get('phone'),
            trolleyNumber: data.get('trolley'),
            notes: data.get('notes'),
            timer: defaultTimer * 60,
            startTime: Date.now(),
            isExpired: false
        };
        addEntry(newEntry);
        event.currentTarget.reset();
    };

    return (
        <div>
            <form style={{ "marginTop": "20px" }} onSubmit={handleSubmit}>
                <TextField name="name" label="Name" required />
                <TextField name="Booth Location" label="Booth Location" required />
                <TextField name="phone" label="Phone Number" required />
                <TextField name="trolley" label="Trolley Number" required />
                <TextField name="notes" label="Notes" />
                <TextField
                    name="defaultTimer"
                    label="Default Timer (minutes)"
                    type="number"
                    value={defaultTimer}
                    onChange={handleTimerChange}
                    required
                />
                <Button style={{ "marginLeft": "20px" }} type="submit" variant="contained" color="primary">Add Entry</Button>
            </form>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Delete</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Booth Location</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Trolley Number</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Timer</TableCell>
                        <TableCell>Resolve</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.filter(entry => !entry.isExpired).map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>
                                <IconButton onClick={() => deleteEntry(entry.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                <TextField value={entry.name} onChange={(e) => handleEntryChange(entry.id, 'name', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <TextField value={entry.BoothLocation} onChange={(e) => handleEntryChange(entry.id, 'BoothLocation', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <TextField value={entry.phoneNumber} onChange={(e) => handleEntryChange(entry.id, 'phoneNumber', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <TextField value={entry.trolleyNumber} onChange={(e) => handleEntryChange(entry.id, 'trolleyNumber', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <TextField value={entry.notes} onChange={(e) => handleEntryChange(entry.id, 'notes', e.target.value)} />
                            </TableCell>
                            <TableCell>{`${Math.floor(entry.timer / 60)}:${entry.timer % 60 < 10 ? `0${entry.timer % 60}` : entry.timer % 60}`}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleResolve(entry.id)}>
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

export default CheckIn;
