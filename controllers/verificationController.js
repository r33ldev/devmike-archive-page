const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const User = require('../models/userModel');
// const verification = require('../models/verificationModel');
const catchAsync = require('../utils/catchAsync');
const Users = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}`,
    cancel_url: `${req.protocol}://${req.get('host')}`,
    customer_email: req.user.email,
    client_reference_id: req.params.userId,
    line_items: [
      {
        name: 'PREMIUM SUBSCRIPTION',
        description: 'JEDAH.XYZ ONE-TIME SUBSCRIPTION',
        images: ['https://4kwallpapers.com/images/walls/thumbs_2t/5710.jpg'],
        amount: 3 * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.updateVerificationStatus = catchAsync(async (req, res, next) => {
  await Users.findByIdAndUpdate(req.user.id, {
    verified: true,
  });
  res.redirect('/');
});
