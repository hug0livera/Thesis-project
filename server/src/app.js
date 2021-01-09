const express = require("express");
const app = express();
const morgan = require("morgan");
const validator = require("express-validator");
const cors = require("cors");

require("dotenv").config({ path: __dirname + "/../.env" });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());
app.disable("etag");

//routes
app.use(require("./routes/authentication"));
app.use(require("./routes/tag"));
app.use(require("./routes/tag_category"));
app.use(require("./routes/task"));
app.use(require("./routes/upload_download"));
app.use(require("./routes/user"));

app.listen(process.env.PORT || 8888);
