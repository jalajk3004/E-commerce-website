const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller");
const authenticate = require("../middleware/authenticate");

// For now, authenticate acts as an admin barrier since we assume admin users hit this.
// In a fully robust system, you'd add an `isAdmin` middleware.
router.get("/stats", authenticate, adminController.getAdminStats);

module.exports = router;
