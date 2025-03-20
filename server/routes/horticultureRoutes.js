const express = require('express');
const router = express.Router();
const {
  createHorticulture,
  getHorticultureRecords,
  getHorticultureRecord,
  updateHorticultureRecord,
  deleteHorticultureRecord,
  addExpense,
  updateHarvest
} = require('../controllers/horticultureController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Main routes
router.route('/')
  .post(createHorticulture)
  .get(getHorticultureRecords);

router.route('/:id')
  .get(getHorticultureRecord)
  .put(updateHorticultureRecord)
  .delete(deleteHorticultureRecord);

// Expense and harvest routes
router.post('/:id/expense', addExpense);
router.put('/:id/harvest', updateHarvest);

module.exports = router;
