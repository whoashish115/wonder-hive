const jwt = require("jsonwebtoken")

const { ACTIVATION_TOKEN_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const generateActivationToken = (payload) => {
  return jwt.sign(payload, ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};


module.exports = { generateActivationToken, generateAccessToken, generateRefreshToken }