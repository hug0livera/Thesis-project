const auth = require("../middelwares/verifyToken");
const { Router } = require("express");
const fileUpload = require("express-fileupload");
const router = Router();
const uploadDownloadController = require("../controllers/admin_controller/upload_download");
router.use(fileUpload());
const { verifyToken, verifyAdminRole } = require("../middelwares/verifyToken");

//download
router.get(
  "/download-annotation/:id",

  uploadDownloadController.downloadAnnotationTask
);
router.get(
  "/download-without-annotation/:id",

  uploadDownloadController.downloadCSVFileWithoutAnnotations
);
//upload
router.post("/upload/:id", [verifyToken, verifyAdminRole], uploadDownloadController.uploadFileCsv);
router.put("/upload-image/:id", uploadDownloadController.uploadImage);
router.post("/upload-zip/:id", [verifyToken, verifyAdminRole], uploadDownloadController.uploadZip);
router.get("/image/:id/:image", uploadDownloadController.getImage);

module.exports = router;
