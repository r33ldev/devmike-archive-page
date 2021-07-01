const sharp = require('sharp');
const multer = require('multer');
const Users = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Image processing, uploading and filtering
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      cb(
        new AppError('Not an image... Kindly upload an image file', 400),
        false
      )
    );
  }
};

const upload = multer({
  storage: multerStorage,
  filter: multerFilter,
});

// Upload function to be called
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

// DON'T CLEARLY UNDERSTAND HOW THIS REALY WORKS
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateUser = catchAsync(async (req, res, next) => {
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
  next();
});
// DON'T CLEARLY UNDERSTAND HOW THIS REALY WORKS

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find();

  res.status(200).json({
    status: 'sucess',
    result: users.length,
    users,
  });
  next();
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await Users.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    profile: req.body.profile,
    occupation: req.body.occupation,
    bio: req.body.bio,
    interests: req.body.interests,
    posts: req.body.posts,
  });

  res.status(200).json({
    status: 'User created successfully',
    user: {
      user: newUser,
    },
  });
  next();
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await Users.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    user: {
      user,
    },
  });
  next();
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await Users.deleteOne(req.params.id);
  console.log(user);
  res.status(204).json({
    status: 'success',
    data: null,
  });
  next();
});
