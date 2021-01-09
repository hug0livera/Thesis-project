const { Router } = require("express");
const router = Router();
const {
  singIn,
  renewToken,
  lastAccess,
  loginTelegram,
  isAdmin,
} = require("../controllers/common.controller");
const { verifyToken } = require("../middelwares/verifyToken");

router.post("/singIn", singIn);
router.get("/renew", verifyToken, renewToken);
router.get("/login-telegram", verifyToken, loginTelegram);
router.post("/isAdmin", verifyToken, isAdmin);
router.put("/lastAccess", verifyToken, lastAccess);

module.exports = router;
