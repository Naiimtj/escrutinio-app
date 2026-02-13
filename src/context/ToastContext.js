/**
 * ToastContext - Context for global toast messages.
 *
 * IMPORTANT: This file exists as a separate file (not in toast-context.jsx)
 * for Vite + React Fast Refresh architecture.
 *
 * Vite requires that React Context be in files separate from the components
 * that use them, so that Hot Module Replacement (HMR) works correctly
 * without losing the Context state.
 *
 * Without this separation, Vite throws an error:
 * "Fast refresh only works when a file only exports components."
 *
 * Therefore:
 * - ToastContext.js: Creates and exports the Context
 * - toast-context.jsx: Contains ToastContextProvider (the wrapper component)
 *
 * Consumers import from this file: `import { ToastContext } from '../context/ToastContext'`
 */
import { createContext } from 'react';

export const ToastContext = createContext();
