import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AccountBalance as PawnIcon,
  Agriculture as HorticultureIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    pawnLoans: {
      total: 0,
      active: 0,
      dueThisWeek: 0,
      totalAmount: 0
    },
    horticulture: {
      activeCrops: 0,
      totalArea: 0,
      harvestingSoon: 0,
      totalExpenses: 0
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would have these endpoints implemented
        const [pawnResponse, horticultureResponse] = await Promise.all([
          axios.get('/api/pawn/stats'),
          axios.get('/api/horticulture/stats')
        ]);

        setStats({
          pawnLoans: pawnResponse.data,
          horticulture: horticultureResponse.data
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { transform: 'translateY(-4px)', transition: 'transform 0.2s' } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 40, mr: 2 } })}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1, color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard Overview
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<PawnIcon />}
            onClick={() => navigate('/pawn-loans/new')}
            sx={{ mr: 2 }}
          >
            New Pawn Loan
          </Button>
          <Button
            variant="contained"
            startIcon={<HorticultureIcon />}
            onClick={() => navigate('/horticulture/new')}
          >
            New Crop Record
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Pawn Broking Business
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Loans"
            value={stats.pawnLoans.active}
            icon={<PawnIcon />}
            color="#1976d2"
            onClick={() => navigate('/pawn-loans')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Amount"
            value={`₹${stats.pawnLoans.totalAmount.toLocaleString()}`}
            icon={<TrendingUpIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Due This Week"
            value={stats.pawnLoans.dueThisWeek}
            icon={<WarningIcon />}
            color="#ed6c02"
            onClick={() => navigate('/pawn-loans?filter=due')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Loans"
            value={stats.pawnLoans.total}
            icon={<PawnIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Horticulture Business
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Crops"
            value={stats.horticulture.activeCrops}
            icon={<HorticultureIcon />}
            color="#1976d2"
            onClick={() => navigate('/horticulture')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Area"
            value={`${stats.horticulture.totalArea} acres`}
            icon={<HorticultureIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Harvesting Soon"
            value={stats.horticulture.harvestingSoon}
            icon={<WarningIcon />}
            color="#ed6c02"
            onClick={() => navigate('/horticulture?filter=harvesting')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Expenses"
            value={`₹${stats.horticulture.totalExpenses.toLocaleString()}`}
            icon={<TrendingUpIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
