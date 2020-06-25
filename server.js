const PORT = 4488;
const path = require("path");
const cors = require("cors");
const app = require("express")();
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
const ae = require("./aeinteract");
const aeDir = "./temp";

if (!fs.existsSync(aeDir)) {
  fs.mkdirSync(aeDir);
}

app.use(bodyParser.json());
app.use(cors());

app.post("/", (req, res, next) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) return res.status(400).json({ message: "no file provided" });

    const type = path.basename(fileUrl).split(".").pop();
    if (!["aep", "aepx"].includes(type))
      return res.status(400).json({ message: "Invalid file type" });

    const file = fs.createWriteStream(`temp/${Date.now()}.${type}`);

    https.get(fileUrl, function (response) {
      response.pipe(file);
      ae.getProjectStructure(file.path)
        .then((output) => {
          return res.json(output);
        })
        .catch(next);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.use(({ message }, req, res, next) => res.status(500).json({ message }));
app.listen(PORT, () => console.log(`aeinteract: ${PORT}`));
