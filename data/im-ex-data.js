const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Users = require('../models/userModel');

dotenv.config({ path: './config.env' });
// console.log(process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected Successfully'));

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
  try {
    await Users.create(Users, { validateBeforeSave: false });
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(`Error 🔥: ${err}`);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Users.deleteMany(Users);
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
