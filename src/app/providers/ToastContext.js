import { createContext } from 'react';

/** @type {React.Context<{ toasts: Array, push: Function, dismiss: Function }>} */
export const ToastContext = createContext(null);
