const app = require("express")();
const fileUpload = require("express-fileupload");
const ae = require("./aeinteract");
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

app.use(fileUpload(fileUploadConfig));

app.get("/", (req, res) => res.json({ message: "API Working" }));

//expects file object in aepFile
// set a high timeout in client as loading a big project may take long time
//TODO restrict file types
app.post("/getStructureFromFile", async (req, res) => {
  try {
    if (!req.files || !Object.keys(req.files).length) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    return res.json({
      data: await ae.getStructure(req.files.aepFile.tempFilePath),
    });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

app.listen(port, () => console.log(`Running at http://localhost:${port}`));
