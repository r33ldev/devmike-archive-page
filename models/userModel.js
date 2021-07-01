const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [30, 'Name must be between 30 characters'],
      minlength: [5, 'Name must be above 5 characters'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'developer'],
      default: 'user',
    },
    username: {
      type: String,
      maxlength: [10, 'Name must be between 10 characters'],
      minlength: [2, 'Name must be above 2 characters'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    slug: String,
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provde your email address'],
    },
    photo: {
      type: String,
      default: 'default.jpeg',
    },
    coverPicture: [String],
    occupation: String,
    bio: String,
    posts: [String],
    interests: [String],
    password: {
      type: String,
      required: [true, 'Kindly provide a password'],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Kindly confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password are not same',
      },
    },
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', function (next) {
  this.slug = slugify(this.username, { lower: true });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPWD = async function (candPWD, userPWD) {
  return await bcrypt.compare(candPWD, userPWD);
};

userSchema.methods.changedPasswordAfter = function (jwttimestamp) {
  if (this.passworChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwttimestamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
