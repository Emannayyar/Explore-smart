import { useContext } from 'react';
import { TripContext } from './tripContextObject';

export const useTripContext = () => useContext(TripContext);
