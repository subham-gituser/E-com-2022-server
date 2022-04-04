import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductDetail,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router
  .get("/getAllProducts", getAllProduct)
  .get("/:id", getProductDetail)
  .post("/create", createProduct)
  .put("/update/:id", updateProduct)
  .delete('/delete/:id',deleteProduct)

export default router;
