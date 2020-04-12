const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const ae = require("./aeinteract");
const { renderFromData } = require("./renderer");
var bodyParser = require("body-parser");
const port = 4488;

const fileUploadConfig = {
  createParentPath: true,
  uriDecodeFileNames: true,
  safeFileNames: true,
  preserveExtension: true,
  abortOnLimit: true,
  responseOnLimit: "File size cannot be larger than 50mb",
  useTempFiles: true,
  limits: { fileSize: 50 * 1024 * 1024 },
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload(fileUploadConfig));
app.use("/static", express.static("public"));

app.get("/", (req, res) => res.json({ message: "API Working" }));

//expects file object in aepFile
// set a high timeout in client as loading a big project may take long time
//TODO restrict file types
app.post("/getStructureFromFile", async (req, res, next) => {
  try {
    if (!req.files || !Object.keys(req.files).length) {
      return res.status(400).json({ message: "No files were uploaded." });
    }
    req.files.aepFile.mv(`./public/templates/${req.files.aepFile.name}`);
    console.log(`${__dirname}/public/templates/${req.files.aepFile.name}`);
    return res.json({
      data: await ae.getProjectStructure(
        `${__dirname}/public/templates/${req.files.aepFile.name}`
      ),
      fileUrl: `${getUrl(req)}/templates/${req.files.aepFile.name}`,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/render", async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No body provided" });
  renderFromData(req.body);
  res.json({ message: "Rendering job." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

app.listen(port, () => console.log(`Running at http://localhost:${port}`));

const getUrl = (req) => `${req.protocol}://${req.headers.host}`;
