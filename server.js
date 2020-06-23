const PORT = 4488;
const path = require("path");
const cors = require("cors");
const app = require("express")();
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
const ae = require("./aeinteract");

app.use(bodyParser.json());
app.use(cors());

app.post("/", async (req, res, next) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) return res.status(400).json({ message: "no file provided" });
    console.log(req.body);
    const type = path.basename(fileUrl).split(".").pop();
    if (!["aep", "aepx"].includes(type))
      return res.status(400).json({ message: "Invalid file type" });

    const file = fs.createWriteStream(`temp/${Date.now()}.${type}`);
    const request = https.get(fileUrl, async function (response) {
      response.pipe(file);
      try {
        return res.json(await ae.getProjectStructure(file.path));
      } catch (err) {
        throw new Error(err);
      }
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.use(({ message }, req, res, next) => res.status(500).json({ message }));
app.listen(PORT, () => console.log(`aeinteract: ${PORT}`));
