import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Page header with title and optional action button
export const PageHeader = ({ title, actionButton }) => (
  <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="h4" component="h1">
      {title}
    </Typography>
    {actionButton && (
      <Box>
        {actionButton}
      </Box>
    )}
  </Box>
);

// Loading spinner with optional message
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: '200px'
  }}>
    <CircularProgress sx={{ mb: 2 }} />
    <Typography>{message}</Typography>
  </Box>
);

// Error message display
export const ErrorMessage = ({ message, onRetry }) => (
  <Alert 
    severity="error" 
    action={onRetry && (
      <Button color="inherit" size="small" onClick={onRetry}>
        RETRY
      </Button>
    )}
  >
    {message}
  </Alert>
);

// Empty state display
export const EmptyState = ({ message, icon, action }) => (
  <Paper 
    sx={{ 
      p: 4, 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2
    }}
  >
    {icon}
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
    {action && (
      <Box sx={{ mt: 2 }}>
        {action}
      </Box>
    )}
  </Paper>
);

// Confirmation dialog
export const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning' // 'warning', 'error', 'info'
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle sx={{ m: 0, p: 2 }}>
      {title}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>
        {cancelText}
      </Button>
      <Button 
        onClick={onConfirm} 
        variant="contained"
        color={severity}
        autoFocus
      >
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

// Status badge
export const StatusBadge = ({ status, color }) => (
  <Box
    sx={{
      display: 'inline-block',
      px: 2,
      py: 0.5,
      borderRadius: '16px',
      backgroundColor: `${color}.100`,
      color: `${color}.800`,
      border: 1,
      borderColor: `${color}.300`,
      fontSize: '0.875rem',
      fontWeight: 500,
    }}
  >
    {status}
  </Box>
);

// Card with hover effect
export const HoverCard = ({ children, onClick }) => (
  <Paper
    sx={{
      p: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': onClick ? {
        transform: 'translateY(-4px)',
        boxShadow: (theme) => theme.shadows[4],
      } : {},
    }}
    onClick={onClick}
  >
    {children}
  </Paper>
);

// Section container with title
export const Section = ({ title, children, action }) => (
  <Box sx={{ mb: 4 }}>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2 
    }}>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      {action && <Box>{action}</Box>}
    </Box>
    {children}
  </Box>
);

// Form field container with consistent spacing
export const FormField = ({ children, fullWidth = true }) => (
  <Box sx={{ mb: 2, width: fullWidth ? '100%' : 'auto' }}>
    {children}
  </Box>
);

// Currency display
export const CurrencyDisplay = ({ 
  amount, 
  currency = '₹',
  variant = 'body1',
  color = 'inherit'
}) => (
  <Typography variant={variant} color={color} component="span">
    {currency}{amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}
  </Typography>
);
