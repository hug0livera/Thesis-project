const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validateFields } = require("../middelwares/validate_fields");
const categoryController = require("../controllers/admin_controller/tag_category");
const { verifyToken, verifyAdminRole } = require("../middelwares/verifyToken");

router.post(
  "/create-category",
  [
    verifyToken,
    //express-validator
    check("tag_category_name", "Category name  is required").not().isEmpty(),
    //validate if there are errors
    validateFields,
  ],
  categoryController.crateTagCategory
);
router.get("/categories/:id", [verifyToken, verifyAdminRole], categoryController.getCategories);
router.get(
  "/category/gets-a-category/:id",
  [verifyToken, verifyAdminRole],
  categoryController.getOneCategory
);
router.get(
  "/category-name/:id",
  [verifyToken, verifyAdminRole],
  categoryController.getNameCategory
);
router.put(
  "/edit-category/:idTask/:id",
  [verifyToken, verifyAdminRole],
  categoryController.editTagCategory
);
router.put("/update-index", [verifyToken], categoryController.updateIndex);

router.delete(
  "/delete-category/:id",
  [verifyToken, verifyAdminRole],
  categoryController.deleteCategory
);

module.exports = router;
