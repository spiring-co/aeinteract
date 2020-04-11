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
      get(CompItem).each((x) => comps.push(x.name));
      function getCompStructure(compName) {
        const textLayers = [];
        const imageLayers = [];
        const comps = {};
        get(
          [AVLayer, TextLayer],
          get(CompItem, compName).selection(0).layers
        ).each((x) => {
          const item = {};
          if (x.source && x.source.constructor === CompItem) {
            comps[x.name] = getCompStructure(x.name);
          } else {
            if (x.constructor === AVLayer) {
              if (x.source.mainSource.isStill) {
                item["name"] = x.name.trim();
                item["height"] = x.height;
                item["width"] = x.width;
                imageLayers.push(item);
              } else {
                //handle video file here
              }
            } else if (x.constructor === TextLayer) {
              const item = {};
              item["name"] = x.name.trim();
              item["text"] = x.property("Source Text").value.text.trim();
              item["font"] = x.property("Source Text").value.font;
              textLayers.push(item);
            }
          }
        });
        return { textLayers, imageLayers, comps };
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

module.exports = { getProjectStructure };
