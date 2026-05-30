/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import SubmissionDetail from './pages/SubmissionDetail';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to simulate auth check or avoid flicker
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return null;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/problems" element={
          <ProtectedRoute>
            <ProblemList />
          </ProtectedRoute>
        } />
        
        <Route path="/problems/:id" element={
          <ProtectedRoute>
            <ProblemDetail />
          </ProtectedRoute>
        } />

        <Route path="/problems/:problemId/submissions/:submissionId" element={
          <ProtectedRoute>
            <SubmissionDetail />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/problems" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

