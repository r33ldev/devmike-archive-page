const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// const AppError = require('./utils/appError');
const router = require('./routes/routes');
const globalErrorHandler = require('./controllers/errorController');
const verficationController = require('./controllers/verificationController');
const AppError = require('./utils/appError');

const app = express();

app.enable('trust proxy');

// Show current url with morgan
app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP... Try again after an hour!!!',
});
app.use('/api', limiter);

app.patch(
  '/verification-checkout',
  express.raw({ type: 'application/json' }),
  verficationController.verficiationCheckout
);
// Recieve data from body to req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against nosql query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Setting pug as default view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Implement CORS === ACCESS CONTROLL ALLOW ORIGIN - CROSS ORIGIN RESOURCE SHARING
app.use(cors());

// IMPLEMENTING CORS ON ALL URLS AND DOMAINS - making my api accessible for all domains on request
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies.jwt)
  next();
});

//  Mount Routes
app.use('/', router);

app.all('*', (req, res, next) => {
  res.redirect('/');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
