import productModel from "../models/product.model.js";
import asyncHandler from "express-async-handler";
import {
  ReasonPhrases,
  StatusCodes,
} from "http-status-codes";

// CREATE PRODUCT - PORT - 1
export const createProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({
    status: StatusCodes.OK,
    success: true,
    product,
  })
});


// UPDATE PRODUCT - PORT - 2
export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await productModel.findById(req.params.id)
  if(!product){
    return res.status(StatusCodes.BAD_REQUEST).json({
      status:ReasonPhrases.BAD_REQUEST,
      success:false,
      message:'Product Not Found'
    })
  }

  product = await productModel.findOneAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
  })

  res.status(StatusCodes.OK).json({
    status: ReasonPhrases.OK,
    success:true,
    message: "success",
    data: product
  })
});


// DELETE PRODUCT - PORT - 3
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id)
  if(!product){
    return res.status(StatusCodes.BAD_REQUEST).json({
      status:ReasonPhrases.BAD_REQUEST,
      success:false,
      message:'Product Not Found'
    })
  }
  await product.remove();

  res.status(StatusCodes.OK).json({
    status: ReasonPhrases.OK,
    success:true,
    message: "success",
    data: "Product Deleted Successfully"
  })
});


// GET ALL PRODUCTS - PORT - 4
export const getAllProduct = asyncHandler(async (req, res, next) => {
  const allProducts = await productModel.find()
  return res.status(StatusCodes.OK).json({
    status: ReasonPhrases.OK,
    success:true,
    message: "success",
    data: allProducts
  });
});


// GET PRODUCT DETAILS - PORT - 5
export const getProductDetail = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id)

  if(!product){
    return res.status(StatusCodes.BAD_REQUEST).json({
      status:ReasonPhrases.BAD_REQUEST,
      success:false,
      message:'Product Not Found'
    })
  }

  return res.status(StatusCodes.OK).json({
    status: ReasonPhrases.OK,
    success:true,
    message: "success",
    data: product
  });
});


