const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const authenticate = require("../middleware/authenticate");

router.get("/", productController.getAllProduct);
router.get("/id/:id", productController.findProductById);

// Admin routes (placeholder for authentication check if needed)
router.post("/", authenticate, productController.createProduct);
router.delete("/:id", authenticate, productController.deleteProduct);
router.put("/:id", authenticate, productController.updateProduct);
router.post("/multiple", authenticate, productController.createMultipleProduct);

module.exports = router;
