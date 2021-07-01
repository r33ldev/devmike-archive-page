const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');

// const AppError = require('./utils/appError');
const router = require('./routes/routes');
const globalErrorHandler = require('./controllers/errorController');
const verificationRouter = require('./routes/verificationRoute');
const AppError = require('./utils/appError');

const app = express();

// Show current url with morgan
app.use(morgan('dev'));

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
app.use('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

//  Mount Routes
app.use('/', router);
app.use('/premium', verificationRouter);
app.use('/premium', verificationRouter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies.jwt)
  next();
});

app.use(compression());

app.all('*', (req, res, next) => {
  res.redirect('/me');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
