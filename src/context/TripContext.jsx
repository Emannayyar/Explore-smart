import React, { createContext, useState, useContext, useEffect } from 'react';

const TripContext = createContext();

export const useTripContext = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
    const [savedTripsCount, setSavedTripsCount] = useState(() => {
        const saved = localStorage.getItem('savedTripsCount');
        return saved ? parseInt(saved, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem('savedTripsCount', savedTripsCount.toString());
    }, [savedTripsCount]);

    const saveTrip = () => {
        setSavedTripsCount(prev => prev + 1);
    };

    return (
        <TripContext.Provider value={{ savedTripsCount, saveTrip }}>
            {children}
        </TripContext.Provider>
    );
};
