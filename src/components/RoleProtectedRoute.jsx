import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * RoleProtectedRoute — guards routes by authentication AND role.
 *
 * Usage:
 *   <RoleProtectedRoute roles={['seller', 'admin']} redirectTo="/">
 *     <SellerPage />
 *   </RoleProtectedRoute>
 *
 * - Not logged in → redirected to /login (with a toast hint).
 * - Logged in but role not allowed → redirected to `redirectTo`.
 * - Otherwise renders children.
 */
export default function RoleProtectedRoute({ roles = [], redirectTo = '/', children }) {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, showToast: true }}
        replace
      />
    )
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
