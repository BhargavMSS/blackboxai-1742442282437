import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { 
  PageHeader, 
  LoadingSpinner, 
  ErrorMessage,
  CurrencyDisplay,
  StatusBadge,
  Section
} from '../shared/SharedComponents';
import { horticultureAPI, handleApiError } from '../../utils/api';

const HorticultureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'seeds',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchRecordDetails();
  }, [id]);

  const fetchRecordDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await horticultureAPI.getById(id);
      setRecord(response.data.data);
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async () => {
    try {
      await horticultureAPI.addExpense(id, {
        ...newExpense,
        date: new Date()
      });
      setExpenseDialogOpen(false);
      setNewExpense({
        category: 'seeds',
        amount: '',
        description: ''
      });
      fetchRecordDetails();
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'default';
      case 'planted':
        return 'primary';
      case 'growing':
        return 'success';
      case 'harvested':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={fetchRecordDetails}
      />
    );
  }

  if (!record) {
    return null;
  }

  const totalExpenses = record.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Box>
      <PageHeader
        title="Horticulture Record Details"
        actionButton={
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/horticulture/${id}/edit`)}
          >
            Edit Record
          </Button>
        }
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Section title="Basic Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Crop Type
                  </Typography>
                  <Typography variant="body1">
                    {record.cropType}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {record.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Area Size
                  </Typography>
                  <Typography variant="body1">
                    {record.areaSize.value} {record.areaSize.unit}
                  </Typography>
                </Grid>
              </Grid>
            </Section>
          </Grid>

          {/* Status and Dates */}
          <Grid item xs={12}>
            <Section title="Status and Dates">
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <StatusBadge 
                    status={record.status}
                    color={getStatusColor(record.status)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Planting Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(record.plantingDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Expected Harvest Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(record.expectedHarvestDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Expenses
                  </Typography>
                  <CurrencyDisplay amount={totalExpenses} />
                </Grid>
              </Grid>
            </Section>
          </Grid>

          {/* Yield Information */}
          <Grid item xs={12}>
            <Section title="Yield Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Expected Yield
                  </Typography>
                  <Typography variant="body1">
                    {record.expectedYield.value} {record.expectedYield.unit}
                  </Typography>
                </Grid>
                {record.actualYield && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Actual Yield
                    </Typography>
                    <Typography variant="body1">
                      {record.actualYield.value} {record.actualYield.unit}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Section>
          </Grid>

          {/* Expenses */}
          <Grid item xs={12}>
            <Section 
              title="Expenses"
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setExpenseDialogOpen(true)}
                >
                  Add Expense
                </Button>
              }
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {record.expenses.map((expense, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {expense.category}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell align="right">
                          <CurrencyDisplay amount={expense.amount} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {record.expenses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No expenses recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Section>
          </Grid>

          {/* Notes */}
          {record.notes && (
            <Grid item xs={12}>
              <Section title="Notes">
                <Typography variant="body1">
                  {record.notes}
                </Typography>
              </Section>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Add Expense Dialog */}
      <Dialog open={expenseDialogOpen} onClose={() => setExpenseDialogOpen(false)}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, width: 300 }}>
            <TextField
              fullWidth
              select
              label="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="seeds">Seeds</MenuItem>
              <MenuItem value="fertilizer">Fertilizer</MenuItem>
              <MenuItem value="pesticides">Pesticides</MenuItem>
              <MenuItem value="labor">Labor</MenuItem>
              <MenuItem value="irrigation">Irrigation</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExpenseDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleExpenseSubmit}
            disabled={!newExpense.amount}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HorticultureDetail;
