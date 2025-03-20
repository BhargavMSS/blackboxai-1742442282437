import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Divider,
  FormHelperText,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LoadingSpinner, ErrorMessage, PageHeader } from '../shared/SharedComponents';
import { pawnLoanAPI, handleApiError } from '../../utils/api';

const validationSchema = Yup.object({
  customerName: Yup.string()
    .required('Customer name is required')
    .min(2, 'Name must be at least 2 characters'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  address: Yup.string()
    .required('Address is required'),
  collateralType: Yup.string()
    .required('Collateral type is required')
    .oneOf(['gold', 'land']),
  loanAmount: Yup.number()
    .required('Loan amount is required')
    .positive('Amount must be positive')
    .min(1000, 'Minimum loan amount is ₹1,000'),
  interestRate: Yup.number()
    .required('Interest rate is required')
    .positive('Rate must be positive')
    .max(100, 'Maximum interest rate is 100%'),
  startDate: Yup.date()
    .required('Start date is required'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(Yup.ref('startDate'), 'Due date must be after start date'),
  // Gold specific
  weight: Yup.number()
    .when('collateralType', {
      is: 'gold',
      then: Yup.number().required('Weight is required for gold collateral').positive()
    }),
  purity: Yup.number()
    .when('collateralType', {
      is: 'gold',
      then: Yup.number().required('Purity is required for gold collateral').min(1).max(100)
    }),
  // Land specific
  documentNumber: Yup.string()
    .when('collateralType', {
      is: 'land',
      then: Yup.string().required('Document number is required for land collateral')
    }),
  landArea: Yup.number()
    .when('collateralType', {
      is: 'land',
      then: Yup.number().required('Land area is required').positive()
    }),
  location: Yup.string()
    .when('collateralType', {
      is: 'land',
      then: Yup.string().required('Location is required for land collateral')
    }),
  marketValue: Yup.number()
    .when('collateralType', {
      is: 'land',
      then: Yup.number().required('Market value is required').positive()
    })
});

const PawnLoanForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const formik = useFormik({
    initialValues: {
      customerName: '',
      phoneNumber: '',
      address: '',
      collateralType: 'gold',
      loanAmount: '',
      interestRate: '',
      startDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      // Gold specific
      weight: '',
      purity: '',
      description: '',
      // Land specific
      documentNumber: '',
      landArea: '',
      location: '',
      marketValue: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        const collateralDetails = values.collateralType === 'gold'
          ? {
              weight: values.weight,
              purity: values.purity,
              description: values.description
            }
          : {
              documentNumber: values.documentNumber,
              landArea: values.landArea,
              location: values.location,
              marketValue: values.marketValue
            };

        const loanData = {
          customerName: values.customerName,
          phoneNumber: values.phoneNumber,
          address: values.address,
          collateralType: values.collateralType,
          collateralDetails,
          loanAmount: values.loanAmount,
          interestRate: values.interestRate,
          startDate: values.startDate,
          dueDate: values.dueDate
        };

        if (isEditMode) {
          await pawnLoanAPI.update(id, loanData);
        } else {
          await pawnLoanAPI.create(loanData);
        }

        navigate('/pawn-loans');
      } catch (err) {
        const errorResult = handleApiError(err);
        setError(errorResult.message);
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    const fetchLoan = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await pawnLoanAPI.getById(id);
          const loan = response.data.data;
          
          formik.setValues({
            customerName: loan.customerName,
            phoneNumber: loan.phoneNumber,
            address: loan.address,
            collateralType: loan.collateralType,
            loanAmount: loan.loanAmount,
            interestRate: loan.interestRate,
            startDate: new Date(loan.startDate),
            dueDate: new Date(loan.dueDate),
            // Gold specific
            weight: loan.collateralDetails.weight || '',
            purity: loan.collateralDetails.purity || '',
            description: loan.collateralDetails.description || '',
            // Land specific
            documentNumber: loan.collateralDetails.documentNumber || '',
            landArea: loan.collateralDetails.landArea || '',
            location: loan.collateralDetails.location || '',
            marketValue: loan.collateralDetails.marketValue || ''
          });
        } catch (err) {
          const errorResult = handleApiError(err);
          setError(errorResult.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLoan();
  }, [id, isEditMode]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Pawn Loan' : 'New Pawn Loan'}
      />

      {error && (
        <ErrorMessage 
          message={error}
          sx={{ mb: 2 }}
        />
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="customerName"
                label="Customer Name"
                value={formik.values.customerName}
                onChange={formik.handleChange}
                error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                helperText={formik.touched.customerName && formik.errors.customerName}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Loan Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Loan Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Collateral Type</InputLabel>
                <Select
                  name="collateralType"
                  value={formik.values.collateralType}
                  onChange={formik.handleChange}
                  label="Collateral Type"
                >
                  <MenuItem value="gold">Gold</MenuItem>
                  <MenuItem value="land">Land</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                name="loanAmount"
                label="Loan Amount"
                type="number"
                InputProps={{
                  startAdornment: '₹'
                }}
                value={formik.values.loanAmount}
                onChange={formik.handleChange}
                error={formik.touched.loanAmount && Boolean(formik.errors.loanAmount)}
                helperText={formik.touched.loanAmount && formik.errors.loanAmount}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                name="interestRate"
                label="Interest Rate (%)"
                type="number"
                value={formik.values.interestRate}
                onChange={formik.handleChange}
                error={formik.touched.interestRate && Boolean(formik.errors.interestRate)}
                helperText={formik.touched.interestRate && formik.errors.interestRate}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={formik.values.dueDate}
                  onChange={(value) => formik.setFieldValue('dueDate', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                      helperText={formik.touched.dueDate && formik.errors.dueDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Collateral Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Collateral Details
              </Typography>
            </Grid>

            {formik.values.collateralType === 'gold' ? (
              <>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="weight"
                    label="Weight (grams)"
                    type="number"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    error={formik.touched.weight && Boolean(formik.errors.weight)}
                    helperText={formik.touched.weight && formik.errors.weight}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="purity"
                    label="Purity (%)"
                    type="number"
                    value={formik.values.purity}
                    onChange={formik.handleChange}
                    error={formik.touched.purity && Boolean(formik.errors.purity)}
                    helperText={formik.touched.purity && formik.errors.purity}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={1}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="documentNumber"
                    label="Document Number"
                    value={formik.values.documentNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.documentNumber && Boolean(formik.errors.documentNumber)}
                    helperText={formik.touched.documentNumber && formik.errors.documentNumber}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="landArea"
                    label="Land Area (acres)"
                    type="number"
                    value={formik.values.landArea}
                    onChange={formik.handleChange}
                    error={formik.touched.landArea && Boolean(formik.errors.landArea)}
                    helperText={formik.touched.landArea && formik.errors.landArea}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="location"
                    label="Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="marketValue"
                    label="Market Value"
                    type="number"
                    InputProps={{
                      startAdornment: '₹'
                    }}
                    value={formik.values.marketValue}
                    onChange={formik.handleChange}
                    error={formik.touched.marketValue && Boolean(formik.errors.marketValue)}
                    helperText={formik.touched.marketValue && formik.errors.marketValue}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/pawn-loans')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {isEditMode ? 'Update Loan' : 'Create Loan'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PawnLoanForm;
