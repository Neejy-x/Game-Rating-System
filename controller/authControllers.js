const Author = require("../models/author");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { logger } = require("../middleware/errorHandler");

exports.signupHandler = async (req, res) => {
  const { email, password, name } = req.body;
  const existingAuthor = await Author.findOne({ email });
  if (existingAuthor)
    return res.status(409).json({ message: "Author already exists" });
  //create author
  const author = await Author.create({
    email,
    password,
    name,
  });
  //create accessToken
  const accessToken = jwt.sign(
    {
      id: author._id,
      role: author.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  //create RefreshToken
  const refreshToken = jwt.sign(
    {
      id: author._id,
      role: author.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  //assign refresh Token to cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  //save refreshtoken to server
  author.refreshToken = refreshToken;
  await author.save();
  //return response
  res.status(201).json({
    message: "Sign up Succcessful",
    author: _.pick(author, ["name", "email", "role"]),
    accessToken,
  });
  logger.info({ password: author.password, accessToken });
};

exports.loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const foundAuthor = await Author.findOne({ email });
  if (!foundAuthor)
    return res.status(401).json({ message: "Invalid email or passowrd" });
  const isPasswordValid = await bcrypt.compare(password, foundAuthor.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid email or passowrd" });

  //login Successful
  //assign accessToken
  const accessToken = jwt.sign(
    {
      id: foundAuthor._id,
      role: foundAuthor.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  //assignRefreshToken
  const refreshToken = jwt.sign(
    {
      id: foundAuthor._id,
      role: foundAuthor.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  //save refreshToken to database
  foundAuthor.refreshToken = refreshToken;
  await foundAuthor.save();

  //asign refreshToken to cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  //sendresponse
  res.status(200).json({
    message: "login successful",
    Author: foundAuthor.name,
    accessToken,
  });
  logger.info({ message: "Login Succesful", accessToken });
};

exports.logoutHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  //clear Token from library
  const foundAuthor = await Author.findOne({ refreshToken });

  if (foundAuthor) {
    foundAuthor.refreshToken = "";
    await foundAuthor.save();
  }

  res.clearCookie("jwt", {
    httpOnly: true,
  });
  res.status(200).json({ message: "Logout Successful" });
  logger.info("Logout Successful");
};

exports.refreshHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  //find Author
  const foundAuthor = await Author.findOne({ refreshToken });
  if (!foundAuthor) return res.status(403).send("Forbidden: Invalid Author");

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundAuthor._id.toString() !== decoded.id)
      return res.status(403).send("Forbidden: refreshToken error");
    const accessToken = jwt.sign(
      { id: foundAuthor._id, role: foundAuthor.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    res.json({ accessToken });
  });
};
