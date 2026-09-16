import { createContext } from 'react';

/**
 * Identity context.
 * Kept in a component-free module so both the provider and the `useAuth`
 * hook can import it without tripping Fast Refresh.
 */
export const AuthContext = createContext(null);
