const ae = require("after-effects");
ae.options.errorHandling = true;
ae.options.minify = false;
ae.options.includes = [
  "./node_modules/after-effects/lib/includes/console.jsx",
  "./node_modules/after-effects/lib/includes/es5-shim.jsx",
  "./node_modules/after-effects/lib/includes/get.jsx",
];

// ae.options.program = path.join('OtherAppDirectory','Adobe After Effects 2015');

/**
 * @param  {String} filePath - path of aep or aepx file
 */
const getStructure = (filePath) =>
  ae
    .execute((fp) => {
      // don't open file if already loaded
      if (!(app.project.file && app.project.file.toString().includes(fp)))
        app.open(new File(fp));

      const comps = [];
      const textLayers = [];
      const imageLayers = [];

      get(CompItem).each((x) => comps.push(x.name.trim()));
      get(TextLayer).each((t) => {
        const ti = {};
        ti["name"] = t.name.trim();
        ti["text"] = t.property("Source Text").value.toString().trim();
        console.log(ti.name, ti.text);
        textLayers.push(ti);
      });
      get(FootageItem).each((f) => {
        const fi = {};
        if (f.mainSource.isStill) {
          fi["name"] = f.name.trim();
          fi["height"] = f.height;
          fi["width"] = f.width;
          imageLayers.push(fi);
        }
      });

      //purge memory
      app.purge(PurgeTarget.ALL_CACHES);
      return { comps, textLayers, imageLayers };
    }, filePath)
    .catch(console.log);

getStructure("~/Desktop/myFile.aep").then(console.log).catch(console.error);
module.exports = { getStructure };
