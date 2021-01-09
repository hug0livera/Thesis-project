const { Router } = require("express");
const router = Router();
const userController = require("../controllers/admin_controller/user");
const { check } = require("express-validator");
const { validateFields } = require("../middelwares/validate_fields");
const { verifyToken, verifyAdminRole } = require("../middelwares/verifyToken");

router.post(
  "/create-user",
  [
    verifyToken,
    //express-validator
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty().isEmail(),
    check("password", "the password has a minimum length of 5 characters")
      .not()
      .isEmpty()
      .isLength({ min: 5 }),
    //validate if there are errors
    validateFields,
  ],
  userController.createUser
);
router.get("/user-generate", [verifyToken, verifyAdminRole], userController.generatePassword);
router.get("/users", [verifyToken, verifyAdminRole], userController.getUsers);
router.get("/user-statistics/:id", [verifyToken], userController.userStatistics);
router.get("/user-assignedTasks/:id", [verifyToken], userController.nameUserTaskAssigned);
router.get("/user-statistics", [verifyToken], userController.getUsersStatistics);
router.get("/user-assigned-task/:id", [verifyToken], userController.usersNotAssignedTask);
router.put("/user-role/:id", [verifyToken, verifyAdminRole], userController.assignObserverRole);
router.get("/user-codeTelegram/:mail", [verifyToken], userController.codeTelegram);
router.get("/user/:id", [verifyToken], userController.getUser);

router.put(
  "/user-reminder-day/:mail/:day",
  [verifyToken, verifyAdminRole],
  userController.remindDay
);
router.put("/delete-user/:id", [verifyToken, verifyAdminRole], userController.deleteUser);
router.put("/update-user/:id", [verifyToken, verifyAdminRole], userController.updateUser);
router.put(
  "/user-newPassword/:id",
  [verifyToken, verifyAdminRole],
  userController.generateNewPassword
);

module.exports = router;
