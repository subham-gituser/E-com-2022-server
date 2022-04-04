import express from "express";
const router = express.Router();

//product routes
import productRoute from "./product.routes.js";
import userRoute from "./user.routes.js";
router.use("/product", productRoute);
router.use("/user", userRoute);

export default router;
