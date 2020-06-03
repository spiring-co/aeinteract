const PORT = 4488;
const { readFileSync } = require("fs");
const cors = require("cors");
const app = require("express")();
const ae = require("./aeinteract");
const { upload } = require("./helpers/s3upload");
const fileHandler = require("./helpers/fileHandler");

app.use(cors());
app.post("/", fileHandler.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File missing" });

    const data = await ae.getProjectStructure(req.file.path);
    const url = await upload(
      `templates/test2.aep`,
      readFileSync(req.file.path)
    );
    return res.json({ data, url });
  } catch (err) {
    next(err);
  }
});

app.use(({ message }, req, res, next) => res.status(500).json({ message }));
app.listen(PORT, () => console.log(`aeinteract: ${PORT}`));
