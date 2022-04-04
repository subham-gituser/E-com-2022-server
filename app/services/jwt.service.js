// Create Token and saving in cookie
import jwt from 'jsonwebtoken'
import { config } from "dotenv";
config();

const {
  ACTIVE_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET
} = process.env

export const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};



export const generateActiveToken = (payload) => {
  return jwt.sign(payload, `${ACTIVE_TOKEN_SECRET}`, {expiresIn: '5m'})
}

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, {expiresIn: '15m'})
}

export const generateRefreshToken = (payload, res) => {
  const refresh_token = jwt.sign(payload, `${REFRESH_TOKEN_SECRET}`, {expiresIn: '30d'})
  
  res.cookie('refreshtoken', refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30*24*60*60*1000 // 30days
  })
  
  return refresh_token;
}
