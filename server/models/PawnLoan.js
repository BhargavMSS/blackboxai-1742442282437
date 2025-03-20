const mongoose = require('mongoose');

const pawnLoanSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  collateralType: {
    type: String,
    required: [true, 'Collateral type is required'],
    enum: ['gold', 'land']
  },
  collateralDetails: {
    // For Gold
    weight: Number,
    purity: Number,
    description: String,
    // For Land
    documentNumber: String,
    landArea: Number,
    location: String,
    marketValue: Number
  },
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required']
  },
  interestRate: {
    type: Number,
    required: [true, 'Interest rate is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'defaulted'],
    default: 'active'
  },
  repayments: [{
    amount: Number,
    date: Date,
    type: {
      type: String,
      enum: ['interest', 'principal']
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PawnLoan', pawnLoanSchema);
