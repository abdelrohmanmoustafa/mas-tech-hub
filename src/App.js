import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import TruckOperations from './pages/TruckOperations';
import VendorCheckInOut from './pages/VendorCheckInOut';
import CombineCSVs from './pages/CombineCSVs';
import './assets/css/App.css';


function App() {
    const [entries, setEntries] = useState(() => {
        const savedEntries = localStorage.getItem('entries');
        return savedEntries ? JSON.parse(savedEntries) : [];
    });

    const handleResolve = (id) => {
        setEntries(prevEntries => prevEntries.map(entry => {
            if (entry.id === id) {
                return {
                    ...entry,
                    isExpired: true,
                    isResolved: true,
                    isOnTime: entry.isOnTime || !entry.isExpired,  // if isOnTime is already true, leave it as true
                };
            }
            return entry;
        }));
    };


    const [value, setValue] = useState(0);
    const [defaultTimer, setDefaultTimer] = useState(20);
    const [tabValue, setTabValue] = useState(0);
    const [operations, setOperations] = useState(() => {
        const savedOperations = localStorage.getItem('operations');
        return savedOperations ? JSON.parse(savedOperations) : [];
    });
    const [drivers, setDrivers] = useState(() => {
        const savedDrivers = localStorage.getItem('drivers');
        return savedDrivers ? JSON.parse(savedDrivers) : [];
    });
    const operationsRef = useRef(); // add this line
    operationsRef.current = operations;

    useEffect(() => {
        localStorage.setItem('drivers', JSON.stringify(drivers));
    }, [drivers]);

    useEffect(() => {
        localStorage.setItem('operations', JSON.stringify(operations));
    }, [operations]);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setOperations(current => current.map(op => {
                if (!op.isResolved) {
                    let { driverAssignedTimeElapsed } = op;
                    if (op.assignedDriverId !== 'N/A') {
                        driverAssignedTimeElapsed = operationsRef.current.find(o => o.id === op.id)?.driverAssignedTimeElapsed + 1 || 0;
                    }

                    return {
                        ...op,
                        requestTimeElapsed: operationsRef.current.find(o => o.id === op.id)?.requestTimeElapsed + 1 || 0,
                        reAssignedTimeElapsed: op.assignedDriverId === 'N/A' && op.reAssigned
                            ? operationsRef.current.find(o => o.id === op.id)?.reAssignedTimeElapsed + 1 || 0
                            : op.reAssignedTimeElapsed,
                        driverAssignedTimeElapsed: driverAssignedTimeElapsed, // update driverAssignedTimeElapsed
                    };
                }
                return op;
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('entries', JSON.stringify(entries));
    }, [entries]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const addEntry = (newEntry) => {
        setEntries(prevEntries => [...prevEntries, { ...newEntry, isExpired: false, isResolved: false, isOnTime: false }]);
    };

    const deleteEntry = (id) => {
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    };

    const handleTimerChange = (event) => {
        setDefaultTimer(Math.max(Number(event.target.value), 1));
    };

    const handleEntryChange = (id, field, value) => {
        setEntries(prevEntries => prevEntries.map(entry => {
            if (entry.id === id && !entry.isExpired && !entry.isResolved) {
                return {
                    ...entry,
                    [field]: value,
                };
            }
            return entry;
        }));
    };

    const clearEntries = () => {
        setEntries(entries => entries.filter(entry => !entry.isExpired));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setEntries(currentEntries =>
                currentEntries.map(entry => {
                    // Skip any updates if the entry is resolved or doesn't have a start time
                    if (entry.isResolved || !entry.startTime) return entry;
                    // Calculate new timer values
                    let newTimer = entry.timer;
                    if (!entry.isExpired) {
                        // Decrement the timer by one second
                        newTimer = entry.timer - 1;
                    } else {
                        // Increment the timer by one second if expired
                        newTimer = entry.timer + 1;
                    }
                    // Check if the entry should be marked as expired
                    const isExpired = !entry.isExpired && newTimer <= 0;
                    return {
                        ...entry,
                        timer: isExpired ? 0 : newTimer, // If just expired, set timer to 0, otherwise update timer
                        isExpired: isExpired || entry.isExpired // Ensure expired status is maintained once set
                    };
                })
            );
        }, 1000); // Update every second
        return () => clearInterval(interval);
    }, [entries]);

    return (
        <Router>
            <div className="App">
                <Sidebar />
                <div className="contentArea">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/truck-operations"
                            element={
                                <TruckOperations
                                    tabValue={tabValue}
                                    operations={operations}
                                    drivers={drivers}
                                    setOperations={setOperations}
                                    setDrivers={setDrivers}
                                    handleChangeTab={handleChangeTab}
                                />
                            }
                        />
                        <Route
                            path="/vendor-check-in-out"
                            element={
                                <VendorCheckInOut
                                    value={value}
                                    entries={entries}
                                    defaultTimer={defaultTimer}
                                    handleChange={handleChange}
                                    addEntry={addEntry}
                                    deleteEntry={deleteEntry}
                                    handleTimerChange={handleTimerChange}
                                    handleResolve={handleResolve}
                                    handleEntryChange={handleEntryChange} // pass it here
                                    clearEntries={clearEntries}
                                    setEntries={setEntries}
                                />
                            }
                        />
                        <Route
                            path="/combine-csv"
                            element={
                                <CombineCSVs></CombineCSVs>
                            }
                        />
                        
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;