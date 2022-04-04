import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { validRegister } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validRegister, registerUser);

export default router;
