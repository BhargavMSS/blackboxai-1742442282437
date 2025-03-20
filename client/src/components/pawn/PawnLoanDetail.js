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
import { pawnLoanAPI, handleApiError } from '../../utils/api';

const PawnLoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [repaymentDialogOpen, setRepaymentDialogOpen] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [repaymentType, setRepaymentType] = useState('interest');

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await pawnLoanAPI.getById(id);
      setLoan(response.data.data);
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRepaymentSubmit = async () => {
    try {
      await pawnLoanAPI.addRepayment(id, {
        amount: parseFloat(repaymentAmount),
        type: repaymentType,
        date: new Date()
      });
      setRepaymentDialogOpen(false);
      setRepaymentAmount('');
      setRepaymentType('interest');
      fetchLoanDetails();
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'defaulted':
        return 'error';
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
        onRetry={fetchLoanDetails}
      />
    );
  }

  if (!loan) {
    return null;
  }

  const totalRepaidAmount = loan.repayments.reduce((sum, repayment) => sum + repayment.amount, 0);
  const remainingAmount = loan.loanAmount - loan.repayments
    .filter(repayment => repayment.type === 'principal')
    .reduce((sum, repayment) => sum + repayment.amount, 0);

  return (
    <Box>
      <PageHeader
        title="Loan Details"
        actionButton={
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/pawn-loans/${id}/edit`)}
          >
            Edit Loan
          </Button>
        }
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12}>
            <Section title="Customer Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1">
                    {loan.customerName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {loan.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {loan.address}
                  </Typography>
                </Grid>
              </Grid>
            </Section>
          </Grid>

          {/* Loan Information */}
          <Grid item xs={12}>
            <Section title="Loan Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Loan Amount
                  </Typography>
                  <CurrencyDisplay 
                    amount={loan.loanAmount}
                    variant="body1"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Interest Rate
                  </Typography>
                  <Typography variant="body1">
                    {loan.interestRate}%
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(loan.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Due Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <StatusBadge 
                    status={loan.status}
                    color={getStatusColor(loan.status)}
                  />
                </Grid>
              </Grid>
            </Section>
          </Grid>

          {/* Collateral Information */}
          <Grid item xs={12}>
            <Section title="Collateral Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Collateral Type
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {loan.collateralType}
                  </Typography>
                </Grid>
                
                {loan.collateralType === 'gold' ? (
                  <>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Weight
                      </Typography>
                      <Typography variant="body1">
                        {loan.collateralDetails.weight} grams
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Purity
                      </Typography>
                      <Typography variant="body1">
                        {loan.collateralDetails.purity}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {loan.collateralDetails.description || '-'}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Document Number
                      </Typography>
                      <Typography variant="body1">
                        {loan.collateralDetails.documentNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Land Area
                      </Typography>
                      <Typography variant="body1">
                        {loan.collateralDetails.landArea} acres
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {loan.collateralDetails.location}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Market Value
                      </Typography>
                      <CurrencyDisplay 
                        amount={loan.collateralDetails.marketValue}
                        variant="body1"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Section>
          </Grid>

          {/* Repayments */}
          <Grid item xs={12}>
            <Section 
              title="Repayments"
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setRepaymentDialogOpen(true)}
                >
                  Add Repayment
                </Button>
              }
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loan.repayments.map((repayment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(repayment.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {repayment.type}
                        </TableCell>
                        <TableCell align="right">
                          <CurrencyDisplay amount={repayment.amount} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {loan.repayments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No repayments recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Section>
          </Grid>
        </Grid>
      </Paper>

      {/* Repayment Dialog */}
      <Dialog open={repaymentDialogOpen} onClose={() => setRepaymentDialogOpen(false)}>
        <DialogTitle>Add Repayment</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, width: 300 }}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={repaymentAmount}
              onChange={(e) => setRepaymentAmount(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Type"
              value={repaymentType}
              onChange={(e) => setRepaymentType(e.target.value)}
            >
              <MenuItem value="interest">Interest</MenuItem>
              <MenuItem value="principal">Principal</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRepaymentDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleRepaymentSubmit}
            disabled={!repaymentAmount}
          >
            Add Repayment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PawnLoanDetail;
