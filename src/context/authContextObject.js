import { createContext } from 'react';

// Shared context object. Provider lives in AuthContext.jsx, hook in useAuth.js.
export const AuthContext = createContext(null);
