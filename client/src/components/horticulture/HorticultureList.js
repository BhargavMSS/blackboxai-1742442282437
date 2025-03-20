import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Agriculture as AgricultureIcon
} from '@mui/icons-material';
import { 
  PageHeader, 
  LoadingSpinner, 
  ErrorMessage, 
  EmptyState,
  ConfirmDialog,
  CurrencyDisplay
} from '../shared/SharedComponents';
import { horticultureAPI, handleApiError } from '../../utils/api';

const HorticultureList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await horticultureAPI.getAll();
      setRecords(response.data.data);
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await horticultureAPI.delete(recordToDelete._id);
      setRecords(records.filter(record => record._id !== recordToDelete._id));
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
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

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={fetchRecords}
      />
    );
  }

  return (
    <Box>
      <PageHeader
        title="Horticulture Records"
        actionButton={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/horticulture/new')}
          >
            New Record
          </Button>
        }
      />

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            size="small"
            sx={{ width: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="planning">Planning</MenuItem>
            <MenuItem value="planted">Planted</MenuItem>
            <MenuItem value="growing">Growing</MenuItem>
            <MenuItem value="harvested">Harvested</MenuItem>
          </TextField>
        </Box>

        {filteredRecords.length === 0 ? (
          <EmptyState
            message="No horticulture records found"
            icon={<AgricultureIcon sx={{ fontSize: 48, color: 'text.secondary' }} />}
          />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Crop Type</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Area Size</TableCell>
                    <TableCell>Planting Date</TableCell>
                    <TableCell>Expected Harvest</TableCell>
                    <TableCell align="right">Total Expenses</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <TableRow key={record._id} hover>
                      <TableCell>{record.cropType}</TableCell>
                      <TableCell>{record.location}</TableCell>
                      <TableCell align="right">
                        {record.areaSize.value} {record.areaSize.unit}
                      </TableCell>
                      <TableCell>
                        {new Date(record.plantingDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(record.expectedHarvestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <CurrencyDisplay 
                          amount={record.expenses.reduce((sum, exp) => sum + exp.amount, 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/horticulture/${record._id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(record)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredRecords.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Horticulture Record"
        message={`Are you sure you want to delete the record for ${recordToDelete?.cropType}? This action cannot be undone.`}
        confirmText="Delete"
        severity="error"
      />
    </Box>
  );
};

export default HorticultureList;
