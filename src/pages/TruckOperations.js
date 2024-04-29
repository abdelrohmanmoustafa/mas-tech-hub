import React from 'react';
import { Tabs, Tab } from '@mui/material';
import OperationsTab from '../components/OperationsTab';
import DriverProfileTab from '../components/DriverProfileTab';

function TruckOperations({ tabValue, operations, drivers, setOperations, setDrivers, handleChangeTab }) {
    return (
        <div>
            <Tabs value={tabValue} onChange={handleChangeTab}>
                <Tab label="Operations" />
                <Tab label="Driver Profile" />
            </Tabs>
            {tabValue === 0 && <OperationsTab operations={operations} drivers={drivers} setOperations={setOperations} />}
            {tabValue === 1 && <DriverProfileTab drivers={drivers} setDrivers={setDrivers} operations={operations} />}
        </div>
    );
}

export default TruckOperations;