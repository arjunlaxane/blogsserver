//http requests r always asynchronous task so async

//next-->fn allows us to move to next available middleware

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
exports.getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log('err>>>', err);
  }

  if (!users) {
    return res.status(404).json({
      message: 'No users found',
    });
  }
  return res.status(200).json({ users });
};

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log('err>>', err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: 'User Already exists!Login Instead' });
  }
  //creating new user
  const hashPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashPassword,
    blogs: [],
  });
  try {
    //saving user in db
    await user.save();
  } catch (error) {
    return console.log('error>>>', error);
  }

  return res.status(201).json({ user });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log('err>>', err);
  }
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "Couldn't find user by this email" });
  }

  const isPasswordMatch = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: 'Wrong credentials',
    });
  }

  return res.status(200).json({
    message: 'Login Successfull',
    user: existingUser,
  });
};
