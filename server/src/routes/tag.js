const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validateFields } = require("../middelwares/validate_fields");
const tagController = require("../controllers/admin_controller/tag");
const { verifyToken, verifyAdminRole } = require("../middelwares/verifyToken");

router.post(
  "/create-tag",
  [
    verifyToken,
    verifyAdminRole,
    //express-validator
    check("tag_name", "tag name is required").not().isEmpty(),
    check("color", "color is required").not().isEmpty(),
    //validate if there are errors
    validateFields,
  ],
  tagController.createTag
);
router.get("/tags", [verifyToken, verifyAdminRole], tagController.getTags);
router.get("/tags/:id", [verifyToken, verifyAdminRole], tagController.getTag);
router.get("/tag/:id", [verifyToken, verifyAdminRole], tagController.getListTag);
router.get("/tag-one/:id", [verifyToken, verifyAdminRole], tagController.getOneTag);
router.put("/edit-tag/:idTag/:idCategory", [verifyToken, verifyAdminRole], tagController.editTag);
router.put("/tag-update-index", [verifyToken, verifyAdminRole], tagController.updateIndex);

router.delete("/delete-tag/:id", [verifyToken, verifyAdminRole], tagController.deleteTag);

module.exports = router;
