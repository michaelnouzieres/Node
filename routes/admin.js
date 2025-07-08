const path = require("path");

const express = require("express");

const productControl = require("../controllers/admin");

const router = express.Router();

const checkAuth = require("../middleware/checkAuth");

// /admin/add-product => GET
router.get("/add-product", checkAuth.checkAuth, productControl.getProductAdd);

// /admin/add-product => POST
router.post("/add-product", productControl.postProductAdd);

router.get("/products", productControl.getAdminProducts);
router.get(
  "/edit-product/:productId",
  checkAuth.checkAuth,
  productControl.getEditProducts
);
router.post("/save-product", productControl.postEditProduct);
router.post("/delete-product", productControl.postDeleteProduct);

/*


*/

module.exports = router;
