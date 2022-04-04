import userModel from "../models/user.model.js";
import cloudinary from "cloudinary";
import { config } from "dotenv";
config();
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import nodemailer from "../config/mail.config.js";
import { generateActiveToken } from "../services/jwt.service.js";
import { validPhone, validateEmail } from "../validators/auth.validator.js";
import { sendSms } from "../config/sms.config.js";
import sendEmail from "../utils/mail.util.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  try {
    const { name, account, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (user)
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: ReasonPhrases.BAD_REQUEST,
        success: false,
        message: "Email or Phone number already exists.",
      });
    // const passwordHash = await bcrypt.hash(password, 12);
    // const newUser = { name, account, password: passwordHash };
    // const active_token = generateActiveToken({ newUser });

    const url = `${process.env.CLIENT_URL}/active/${active_token}`;

    if (validateEmail(account)) {
      sendEmail(account, 'register', '', '', active_token)
      .then(() => {
        res.status(StatusCodes.OK).send({
          status: "success",
          message: "Account Activation Link Sent To Your Mail",
        });
      });
    } else if (validPhone(account)) {
      sendSms(account, url, "Verify your phone number")
      return res.json({ msg: "Success! Please check phone." });
    }

    user = await userModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    sendToken(user, StatusCodes.CREATED, res);
  } catch (error) {
    res.json(StatusCodes.BAD_REQUEST).json({
      status: false,
      error: error,
    });
  }
});
