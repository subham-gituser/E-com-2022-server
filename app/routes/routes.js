import { config } from "dotenv";
import express from "express";
const router = express.Router();
import apiRoutes from './api.routes.js'
config()

router.use(process.env.API_URL, apiRoutes);
router.use(process.env.API_URL, (req, res) =>
  res.status(404).json({message:`Error-${req.originalUrl} Not Found`})
);

export default router;