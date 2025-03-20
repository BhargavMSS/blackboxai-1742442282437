const mongoose = require('mongoose');

const horticultureSchema = new mongoose.Schema({
  cropType: {
    type: String,
    required: [true, 'Crop type is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  areaSize: {
    value: {
      type: Number,
      required: [true, 'Area size is required']
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares'],
      default: 'acres'
    }
  },
  plantingDate: {
    type: Date,
    required: [true, 'Planting date is required']
  },
  expectedHarvestDate: {
    type: Date,
    required: [true, 'Expected harvest date is required']
  },
  expenses: [{
    category: {
      type: String,
      required: true,
      enum: ['seeds', 'fertilizer', 'pesticides', 'labor', 'irrigation', 'other']
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  expectedYield: {
    value: Number,
    unit: String
  },
  actualYield: {
    value: Number,
    unit: String
  },
  status: {
    type: String,
    enum: ['planning', 'planted', 'growing', 'harvested'],
    default: 'planning'
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Horticulture', horticultureSchema);
