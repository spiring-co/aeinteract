const PORT = 4488;
const path = require("path");
const cors = require("cors");
const app = require("express")();
const ae = require("./aeinteract");
const fileHandler = require("./helpers/fileHandler");

app.use(cors());
app.post("/", fileHandler.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File missing" });
    return res.json(await ae.getProjectStructure(req.file.path));
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.use(({ message }, req, res, next) => res.status(500).json({ message }));
app.listen(PORT, () => console.log(`aeinteract: ${PORT}`));
