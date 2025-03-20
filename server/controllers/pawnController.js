const PawnLoan = require('../models/PawnLoan');

// @desc    Create new pawn loan
// @route   POST /api/pawn
// @access  Private
exports.createPawnLoan = async (req, res) => {
  try {
    const pawnLoan = await PawnLoan.create(req.body);
    res.status(201).json({
      success: true,
      data: pawnLoan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all pawn loans
// @route   GET /api/pawn
// @access  Private
exports.getPawnLoans = async (req, res) => {
  try {
    const pawnLoans = await PawnLoan.find().sort('-createdAt');
    res.json({
      success: true,
      count: pawnLoans.length,
      data: pawnLoans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single pawn loan
// @route   GET /api/pawn/:id
// @access  Private
exports.getPawnLoan = async (req, res) => {
  try {
    const pawnLoan = await PawnLoan.findById(req.params.id);
    if (!pawnLoan) {
      return res.status(404).json({
        success: false,
        error: 'Pawn loan not found'
      });
    }
    res.json({
      success: true,
      data: pawnLoan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update pawn loan
// @route   PUT /api/pawn/:id
// @access  Private
exports.updatePawnLoan = async (req, res) => {
  try {
    const pawnLoan = await PawnLoan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!pawnLoan) {
      return res.status(404).json({
        success: false,
        error: 'Pawn loan not found'
      });
    }
    res.json({
      success: true,
      data: pawnLoan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete pawn loan
// @route   DELETE /api/pawn/:id
// @access  Private
exports.deletePawnLoan = async (req, res) => {
  try {
    const pawnLoan = await PawnLoan.findByIdAndDelete(req.params.id);
    if (!pawnLoan) {
      return res.status(404).json({
        success: false,
        error: 'Pawn loan not found'
      });
    }
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add repayment to pawn loan
// @route   POST /api/pawn/:id/repayment
// @access  Private
exports.addRepayment = async (req, res) => {
  try {
    const pawnLoan = await PawnLoan.findById(req.params.id);
    if (!pawnLoan) {
      return res.status(404).json({
        success: false,
        error: 'Pawn loan not found'
      });
    }

    pawnLoan.repayments.push(req.body);
    await pawnLoan.save();

    res.json({
      success: true,
      data: pawnLoan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
