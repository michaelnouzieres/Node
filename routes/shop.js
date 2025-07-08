const path = require("path");

const express = require("express");

const ShopControl = require("../controllers/shop");

const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/", ShopControl.getIndex);
router.get("/products", ShopControl.getProducts);
router.get("/products/:productId", ShopControl.getProduct);
router.post("/cart", ShopControl.postCart);
router.get("/cart", checkAuth.checkAuth, ShopControl.getCart);
router.post("/delete-product-cart", ShopControl.deleteProductCart);
router.post("/create-order", ShopControl.postCreateOrder);
router.get("/orders", checkAuth.checkAuth, ShopControl.getOrders);
/*












/*
router.get("/checkout", ShopControl.getCheckout);



*/
module.exports = router;
