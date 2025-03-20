const Horticulture = require('../models/Horticulture');

// @desc    Create new horticulture record
// @route   POST /api/horticulture
// @access  Private
exports.createHorticulture = async (req, res) => {
  try {
    const horticulture = await Horticulture.create(req.body);
    res.status(201).json({
      success: true,
      data: horticulture
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all horticulture records
// @route   GET /api/horticulture
// @access  Private
exports.getHorticultureRecords = async (req, res) => {
  try {
    const horticultures = await Horticulture.find().sort('-plantingDate');
    res.json({
      success: true,
      count: horticultures.length,
      data: horticultures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single horticulture record
// @route   GET /api/horticulture/:id
// @access  Private
exports.getHorticultureRecord = async (req, res) => {
  try {
    const horticulture = await Horticulture.findById(req.params.id);
    if (!horticulture) {
      return res.status(404).json({
        success: false,
        error: 'Horticulture record not found'
      });
    }
    res.json({
      success: true,
      data: horticulture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update horticulture record
// @route   PUT /api/horticulture/:id
// @access  Private
exports.updateHorticultureRecord = async (req, res) => {
  try {
    const horticulture = await Horticulture.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!horticulture) {
      return res.status(404).json({
        success: false,
        error: 'Horticulture record not found'
      });
    }
    res.json({
      success: true,
      data: horticulture
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete horticulture record
// @route   DELETE /api/horticulture/:id
// @access  Private
exports.deleteHorticultureRecord = async (req, res) => {
  try {
    const horticulture = await Horticulture.findByIdAndDelete(req.params.id);
    if (!horticulture) {
      return res.status(404).json({
        success: false,
        error: 'Horticulture record not found'
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

// @desc    Add expense to horticulture record
// @route   POST /api/horticulture/:id/expense
// @access  Private
exports.addExpense = async (req, res) => {
  try {
    const horticulture = await Horticulture.findById(req.params.id);
    if (!horticulture) {
      return res.status(404).json({
        success: false,
        error: 'Horticulture record not found'
      });
    }

    horticulture.expenses.push(req.body);
    await horticulture.save();

    res.json({
      success: true,
      data: horticulture
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update harvest details
// @route   PUT /api/horticulture/:id/harvest
// @access  Private
exports.updateHarvest = async (req, res) => {
  try {
    const horticulture = await Horticulture.findById(req.params.id);
    if (!horticulture) {
      return res.status(404).json({
        success: false,
        error: 'Horticulture record not found'
      });
    }

    horticulture.actualYield = req.body.actualYield;
    horticulture.status = 'harvested';
    await horticulture.save();

    res.json({
      success: true,
      data: horticulture
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
