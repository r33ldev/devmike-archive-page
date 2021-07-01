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

const createVerificationSession = async (session) => {
  const user = session.customer_email;
  await Users.findByIdAndUpdate(user.id, {
    verified: true,
  });
};
exports.verificiationCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err}`);
  }

  if (event.type === 'checkout.session.completed')
    createVerificationSession(event.data.object);

  res.status(200).json({ recieved: true });
};
