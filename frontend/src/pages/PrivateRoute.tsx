import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('access');

  return token ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
