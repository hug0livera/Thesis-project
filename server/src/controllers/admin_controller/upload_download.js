const sequelize = require("../../database/database").sequelize;
const { parse } = require("fast-csv");
const { Parser } = require("json2csv");
const path = require("path");
const fs = require("fs");
const extract = require("extract-zip");
const unzipper = require("unzipper");

require("dotenv").config({ path: __dirname + "/../../../.env" });

//require("dotenv").config();

/**
 *
 * Uploaded CSV files
 *
 * @param id    task key
 * @param file
 *
 */
const uploadFileCsv = async (req, res) => {
  try {
    const { id } = req.params;

    //check if the file exists
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ ok: false, msg: "No files were uploaded" });

    let uploadedFile = req.files.file;

    //valid extension
    const extension = uploadedFile.name.split(".");
    const extensionType = extension[extension.length - 1];
    const validExtension = ["csv"];
    if (!validExtension.includes(extensionType))
      return res.status(400).send({ ok: false, msg: "The type of the file is not admited" });

    //load the csv file
    let csvFile = uploadedFile.data.toString();
    const stream = parse({ headers: false, ignoreEmpty: true })
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        sequelize.query(
          `INSERT INTO post (id_task, uri, text , image_name, category ) ` +
            `VALUES ('${id}','${row[0]}','${row[1]}','${row[2]}','${row[3]}')`
        );
      })
      .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));
    stream.write(csvFile);
    stream.end();

    if (stream) return res.status(200).json({ ok: true, msg: "File uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 *  Upload the zip file
 *
 *  @param id  task key
 *
 */
const uploadZip = async (req, res) => {
  try {
    const { id } = req.params;

    //check if the file exists
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(401).json({ ok: false, msg: "No files were uploaded" });

    let uploadedFile = req.files.file;

    //valid extension
    const extension = uploadedFile.name.split(".");
    const extensionType = extension[extension.length - 1];
    const validExtension = ["zip"];
    if (!validExtension.includes(extensionType))
      return res.status(401).json({ ok: false, msg: "The type of the file is not admited" });

    //I Create a folder as the task key
    let dir = path.join(__dirname, `../../assets/img/${id}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    /*   fs.stat(dir, function (err) {
      if (!err) {
        console.log("file or directory exists");
      } else if (err.code === "ENOENT") {
        fs.mkdirSync(dir);
      }
    }); */

    //zip file path
    let pathOrigin = path.join(__dirname, `../../assets/zip/${req.files.file.name}`);
    //image path
    let pathDestination = path.join(__dirname, `../../assets/img/${id}`);

    console.log("zip file path: ", pathOrigin);
    console.log("image path: ", pathDestination);

    //upload the zip file to the server
    uploadedFile.mv(pathOrigin, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ ok: false, msg: err });
      } else {
        //console.log("Zip file uploaded successfully");
        fs.createReadStream(pathOrigin).pipe(unzipper.Extract({ path: pathDestination }));
        return res.status(200).json({ ok: true, msg: "File Zip uploaded" });
      }
    });

    //zip file extraction
    //await extract(pathOrigin, { dir: pathDestination });

    //update image_path of each post
    /*  fs.readdir(pathDestination, (err, files) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ ok: false, msg: err });
      } else {
        files.forEach((file) => {
          sequelize.query(
            `UPDATE post set image_path = 'http://${process.env.DB_HOST}:${process.env.PORT}/image/${id}/${file}' ` +
              `WHERE id_task = ${id} AND image_name ='${file}'`,
            { type: sequelize.QueryTypes.UPDATE }
          );
        });
      }
    }); */

    //return res.status(200).json({ ok: true, msg: "File Zip uploaded" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
      data: {},
    });
  }
};

/**
 *
 *  Uploading images
 *
 *  @param id  task key
 *
 */
const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;

    //image path
    let pathDestination = path.join(__dirname, `../../assets/img/${id}`);
    if (!fs.existsSync(pathDestination)) {
      return res.status(400).json("There are no images to upload");
    }

    fs.readdir(pathDestination, (err, files) => {
      files.forEach((file) => {
        sequelize.query(
          `UPDATE post set image_path = '${process.env.URL_SERVER}/image/${id}/${file}' ` +
            `WHERE id_task = ${id} AND image_name ='${file}'`,
          { type: sequelize.QueryTypes.UPDATE }
        );
      });
    });

    return res.status(200).json("Images uploaded");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 *  Get the images from a posts
 *
 * @param image
 * @param id
 *
 */
const getImage = async (req, res) => {
  try {
    const image = req.params.image;
    const { id } = req.params;

    const pathImage = path.join(__dirname, `../../assets/img/${id}/${image}`);
    if (fs.existsSync(pathImage)) {
      res.sendFile(pathImage);
    } else {
      const pathImage = path.join(__dirname, `../../assets/default.png`);
      {
        res.sendFile(pathImage);
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 * Download the annotation of a task
 *
 */
const downloadAnnotationTask = async (req, res) => {
  try {
    const { id } = req.params;

    const annotation = await sequelize.query(
      "SELECT u.email, task_name, tc.tag_category_name, tg.tag_name, p.uri " +
        "FROM task t " +
        "LEFT JOIN post p ON (t.id_task = p.id_task) " +
        " JOIN annotation a ON (a.id_post = p.id_post) " +
        "LEFT JOIN tag tg ON (tg.id_tag = a.id_tag) " +
        " LEFT JOIN tag_category tc ON (tc.id_category = tg.id_category) " +
        " LEFT JOIN users u on (u.id_user = a.id_user) " +
        " WHERE t.id_task = ? " +
        "ORDER BY p.id_post  ",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const json2csv = new Parser();
    const csv = json2csv.parse(annotation);
    res.header("Content-Type", "text/csv");
    return res.send(csv);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 * download CSV file without its annotations
 *
 */
const downloadCSVFileWithoutAnnotations = async (req, res) => {
  try {
    const { id } = req.params;

    const annotation = await sequelize.query(
      "SELECT uri, text, image_name, category  FROM post WHERE id_task = ? ORDER BY id_post ",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const json2csv = new Parser();
    const csv = json2csv.parse(annotation);
    res.header("Content-Type", "text/csv");
    return res.send(csv);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

module.exports = {
  //upload
  uploadFileCsv,
  uploadZip,
  getImage,
  uploadImage,
  downloadAnnotationTask,
  downloadCSVFileWithoutAnnotations,
};
