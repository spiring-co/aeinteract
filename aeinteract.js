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
const getProjectStructure = (filePath) =>
  ae
    .execute((fp) => {
      // don't open file if already loaded
      if (!(app.project.file && app.project.file.toString().includes(fp)))
        app.open(new File(fp));

      const comps = [];
      get(CompItem).each((x) => comps.push(x.name.trim()));
      get(CompItem).each((x) => console.log(x.id));

      function getCompStructure(compName) {
        console.log(compName);
        const textLayers = [];
        const imageLayers = [];
        get
          .comps(compName)
          .children(TextLayer)
          .each((t) => {
            const ti = {};
            ti["name"] = t.name.trim();
            ti["text"] = t.property("Source Text").value.text.trim();
            ti["font"] = t.property("Source Text").value.font;
            textLayers.push(ti);
          });

        get
          .comps(compName)
          .children(FootageItem)
          .each((f) => {
            const fi = {};
            if (f.mainSource.isStill) {
              fi["name"] = f.name.trim();
              fi["height"] = f.height;
              fi["width"] = f.width;
              imageLayers.push(fi);
            }
          });
        return { textLayers, imageLayers };
      }

      //purge memory
      app.purge(PurgeTarget.ALL_CACHES);

      result = {};
      comps.map((c) => {
        result[c] = getCompStructure(c);
      });
      return result;
    }, filePath)
    .catch(console.error);

getProjectStructure("~/Desktop/myFile.aep").then((c) => {
  console.log(JSON.stringify(c));
});
module.exports = { getProjectStructure };
