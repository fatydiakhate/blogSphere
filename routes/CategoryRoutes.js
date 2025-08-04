const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const categoryController = require("../controllers/CategoryController");

// CRUD catégorie
router.post("/", auth, categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.put("/:id", auth, categoryController.updateCategory);
router.delete("/:id", auth, categoryController.deleteCategory);

module.exports = router;
