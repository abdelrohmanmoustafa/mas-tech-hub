import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CheckIn from '../components/CheckIn';
import CheckOut from '../components/CheckOut';

function VendorCheckInOut({ value, entries, defaultTimer, handleChange, addEntry, deleteEntry, handleTimerChange, handleResolve, clearEntries, setEntries }) {

  const handleCheckInResolve = (id) => {
    handleResolve(id, true);
  };

  const handleCheckOutResolve = (id) => {
    handleResolve(id, false);
  }
  const handleEntryChange = (id, field, value) => {
    setEntries(prevEntries => prevEntries.map(entry => {
      if (entry.id === id && !entry.isExpired && !entry.isResolved) {
        return {
          ...entry,
          [field]: value,
          isOnTime: !entry.isExpired && value !== '',
        };
      }
      return entry;
    }));
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="Vendor Tabs">
        <Tab label="Check In" />
        <Tab label="Check Out" />
      </Tabs>
      {value === 0 &&
        <CheckIn
          entries={entries.filter(entry => !entry.isExpired)}
          addEntry={addEntry}
          defaultTimer={defaultTimer}
          handleTimerChange={handleTimerChange}
          deleteEntry={deleteEntry}
          handleResolve={handleCheckInResolve}
          handleEntryChange={handleEntryChange}  // pass the function here
        />
      }
      {value === 1 &&
        <CheckOut
          entries={entries.filter(entry => entry.isExpired)}
          onResolve={handleCheckOutResolve}
          handleEntryChange={handleEntryChange}
          clearEntries={clearEntries}
        />
      }
    </Box>
  );
}

export default VendorCheckInOut;