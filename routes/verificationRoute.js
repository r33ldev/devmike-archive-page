const express = require('express');
const verificationController = require('../controllers/verificationController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:userId',
  authController.protect,
  verificationController.getCheckoutSession
);

// router.patch(
//   '/updateVerificationStatus',
//   authController.protect,
//   verificationController.updateVerificationStatus
// );

module.exports = router;
