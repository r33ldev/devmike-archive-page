const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/create-account', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.isLoggedIn);

router.get('/login', (req, res) => {
  if (req.cookies.jwt) {
    return res.redirect('/');
  }
  res.status(200).render('login', {
    title: 'Login   ',
  });
});

router.get('/create-account', (req, res) => {
  if (req.cookies.jwt) return res.redirect('/');
  res.status(200).render('signup', {
    title: 'Sign up    ',
  });
});

router.get('/', authController.protect, (req, res) => {
  if (!req.cookies.jwt) return res.redirect('/login');

  res.status(200).render('post', {});
});

router.get('/', authController.protect, (req, res) => {
  res.status(200).render('email/welcome');
});

router.patch(
  '/upload-photo',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateUser
);
router.get(
  '/api/users',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getAllUsers
);
router.get('/api/users/:id', userController.getUser);
router.delete('/api/users/:id', userController.deleteUser);

module.exports = router;
