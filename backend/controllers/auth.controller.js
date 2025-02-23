// Dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Database model modules
const user_model = require("../models/user.model");

// User signup controller
const signup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const userObj = {
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    };
    const user_created = await user_model.create(userObj);
    res.status(201).send({
      message: `Thanks ${user_created.name}, You are registered successfully ! You can now login using your credentials.`,
    });
  } catch (error) {
    logger.error("Error while registering user: ", error);
    res.status(501).send({
      error: "User Registration Failed",
    });
  }
};

// User login controller
const login = async (req, res) => {
  const user = await user_model.findOne({ username: req.body.username });
  if (user == null) {
    return res.status(401).send({
      error: "User for given username not found",
    });
  }
  try {
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        error: "Invalid username or password",
      });
    }
    const payload = { id: user._id, username: user.username };
    const options = { expiresIn: "30d" };
    const token = jwt.sign(payload, process.env.SECRET, options);

    res.status(201).send({
      message: "Logged In Successfully",
      token: token,
      name: user.name,
    });
  } catch (error) {
    res.status(501).send({
      error: "Password Validation Failed",
    });
  }
};

const getUser = async (req, res) => {
  if (req.cookies?.token) {
    const token = req.cookies.token;
    jwt.verify(token, process.env.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          error: "Unauthorized, Invalid Token",
        });
      }
      try {
        const user = await user_model.findById(decoded.id);
        if (!user) {
          return res.status(401).send({
            error: "Unauthorized, the user for this token does not exist",
          });
        }
        res.status(200).send({
          user: user.name,
        });
      } catch (error) {
        logger.error("AUTH | Error while searching for user in database: ", error);
        return res.status(501).send({
          error: "Token validation failed",
        });
      }
    });
  } else {
    return res.status(401).send({ error: "You are not logged in !" });
  }
};

module.exports = {
  signup: signup,
  login: login,
  getUser: getUser,
};
