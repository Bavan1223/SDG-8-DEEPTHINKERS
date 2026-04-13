/* ============================================================
   AgriAgent – useAuth hook
   Convenience wrapper around AuthContext
   ============================================================ */

import { useAuthContext } from '../context/AuthContext';

/**
 * Returns current auth state and helpers.
 * Must be used within <AuthProvider>.
 */
export function useAuth() {
  return useAuthContext();
}
