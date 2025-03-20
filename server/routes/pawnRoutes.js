const express = require('express');
const router = express.Router();
const {
  createPawnLoan,
  getPawnLoans,
  getPawnLoan,
  updatePawnLoan,
  deletePawnLoan,
  addRepayment
} = require('../controllers/pawnController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Main routes
router.route('/')
  .post(createPawnLoan)
  .get(getPawnLoans);

router.route('/:id')
  .get(getPawnLoan)
  .put(updatePawnLoan)
  .delete(deletePawnLoan);

// Repayment route
router.post('/:id/repayment', addRepayment);

module.exports = router;
