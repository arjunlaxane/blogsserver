const { default: mongoose } = require('mongoose');
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

exports.getAllBlogs = async (req, res, next) => {
  let blogs;

  try {
    blogs = await Blog.find().populate('user');
  } catch (err) {
    return console.log('error>>', err);
  }

  if (!blogs) {
    return res.status(404).json({ message: 'NO blogs found' });
  }
  return res.status(200).json({ blogs });
};

exports.addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (error) {
    return console.log('error>>>>', error);
  }
  if (!existingUser) {
    return res.status(400).json({ message: 'Unable to find user by this id' });
  }

  const blog = new Blog({
    title,
    description,
    image,
    user,
  });

  try {
    const session = await mongoose.startSession();
    // console.log(session);
    session.startTransaction();
    await blog.save({ session }); //this is http task so await
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log('error>>>', err);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ blog });
};

exports.updateBlog = async (req, res, next) => {
  const { title, description } = req.body;

  const blogId = req.params.id;
  let blog;

  try {
    blog = await Blog.findByIdAndUpdate(blogId, { title, description });
  } catch (err) {
    return console.log('error>>>', err);
  }
  if (!blog) {
    return res.status(500).json({ message: 'Unable to update blog' });
  }
  return res.status(200).json({ blog });
};

exports.getById = async (req, res, next) => {
  const id = req.params.id;

  let blog;

  try {
    blog = await Blog.findById(id);
  } catch (err) {
    return console.log('error>>>', err);
  }
  if (!blog) {
    return res.status(404).json({ message: 'No blogs found' });
  }
  return res.status(200).json({ blog });
};

exports.deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id).populate('user');
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return console.log('error>>>', err);
  }
  if (!blog) {
    return res.status(500).json({ message: 'Unable to delete' });
  }
  res.status(200).json({ message: 'Deleted successfully' });
};

exports.getByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let userBlogs;

  try {
    userBlogs = await User.findById(userId).populate('blogs');
  } catch (error) {
    return console.log('error>>>', error);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: 'No blog found' });
  }
  return res.status(200).json({ user: userBlogs });
};
