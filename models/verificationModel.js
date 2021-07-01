const mongoose = require('mongoose');

const verificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.objectId,
    ref: 'User',
    required: [true, 'A verification of course belongs to a user'],
  },
  price: {
    type: Number,
    require: [true, ' A verification of course has a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

const Verification = mongoose.model('Verification', verificationSchema);
module.exports = Verification;
