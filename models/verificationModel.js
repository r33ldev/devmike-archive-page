const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
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
  verify: {
    type: Boolean,
    default: true,
  },
});
verificationSchema.pre(/^save/, function (next) {
  this.populate('user');
  next();
});

const Verification = mongoose.model('Verification', verificationSchema);
module.exports = Verification;
