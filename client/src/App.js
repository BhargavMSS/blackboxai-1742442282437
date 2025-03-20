import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PawnLoanList from './components/pawn/PawnLoanList';
import PawnLoanForm from './components/pawn/PawnLoanForm';
import PawnLoanDetail from './components/pawn/PawnLoanDetail';
import HorticultureList from './components/horticulture/HorticultureList';
import HorticultureForm from './components/horticulture/HorticultureForm';
import HorticultureDetail from './components/horticulture/HorticultureDetail';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex' }}>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Pawn Loan Routes */}
            <Route path="/pawn-loans" element={<PawnLoanList />} />
            <Route path="/pawn-loans/new" element={<PawnLoanForm />} />
            <Route path="/pawn-loans/:id" element={<PawnLoanDetail />} />
            <Route path="/pawn-loans/:id/edit" element={<PawnLoanForm />} />
            
            {/* Horticulture Routes */}
            <Route path="/horticulture" element={<HorticultureList />} />
            <Route path="/horticulture/new" element={<HorticultureForm />} />
            <Route path="/horticulture/:id" element={<HorticultureDetail />} />
            <Route path="/horticulture/:id/edit" element={<HorticultureForm />} />
          </Route>
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;
