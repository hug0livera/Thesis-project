const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validateFields } = require("../middelwares/validate_fields");
const { verifyToken, verifyAdminRole } = require("../middelwares/verifyToken");
const taskController = require("../controllers/admin_controller/task");
require("dotenv").config();

//post
router.post(
  "/create-task",
  [
    verifyToken,
    verifyAdminRole,
    //express-validator
    check("task_name", "task name is required").not().isEmpty(),
    check("task_description", "task description is required").not().isEmpty(),
    //validate if there are errors
    validateFields,
  ],
  taskController.crateTask
);

router.post("/task-assign", [verifyToken, verifyAdminRole], taskController.assignTaskUser);
//get
router.get("/task-getCategory/:id", [verifyToken, verifyAdminRole], taskController.getCategory);
router.get("/task-category/:id", [verifyToken, verifyAdminRole], taskController.getCategoryTags);
router.get(
  "/task-construction",
  [verifyToken, verifyAdminRole],
  taskController.getTasksConstruction
);
router.get("/task-active", [verifyToken, verifyAdminRole], taskController.getTasksActive);
router.get("/task/:id", [verifyToken, verifyAdminRole], taskController.getOneTask);
router.get("/tasks", [verifyToken, verifyAdminRole], taskController.getTasks);
router.get("/tasks-name/:id", [verifyToken], taskController.getNameTask);
router.get("/tasks-statistics", [verifyToken], taskController.taskStatistics);
router.get("/tasks-assignedUser/:id", [verifyToken], taskController.taskStatisticsAssignedUser);
router.get("/post/:id", [verifyToken, verifyAdminRole], taskController.getPost); //post
router.get(
  "/task-users-assigned-to-a-task/:id",
  [verifyToken, verifyAdminRole],
  taskController.usersAssignedToATask
);

//delete
router.delete("/delete-task/:id", [verifyToken, verifyAdminRole], taskController.deleteTask);
router.delete(
  "/delete-taskAssignment/:idTask/:idUser",
  [verifyToken, verifyAdminRole],
  taskController.deleteTaskAssignment
);

//put
router.put("/task-finish/:id", [verifyToken, verifyAdminRole], taskController.finishTask);
router.put("/edit-task/:id", [verifyToken, verifyAdminRole], taskController.editTask);
router.put(
  "/changeStateInactive-task/:id",
  [verifyToken, verifyAdminRole],
  taskController.changeStateInactive
);
router.put(
  "/changeStateActive-task/:id",
  [verifyToken, verifyAdminRole],
  taskController.changeStateActive
);
router.put(
  "/task-assignment-disable/:idTask",
  [verifyToken, verifyAdminRole],
  taskController.disableTaskAssignment
);
//telegram
router.get("/telegram-statistics", taskController.getStatisticsByTelegram);

module.exports = router;
