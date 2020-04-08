const ae = require("after-effects");
ae.options.errorHandling = true;
ae.options.minify = false;
ae.options.includes = [
  "./node_modules/after-effects/lib/includes/console.jsx",
  "./node_modules/after-effects/lib/includes/es5-shim.jsx",
  "./node_modules/after-effects/lib/includes/get.jsx",
];
/**
 * @param  {String} filePath - path of aep or aepx file
 */

const getStructure = (filePath) =>
  ae.execute((fp) => {
    app.open(new File(fp));
    const comps = [];
    const textLayers = [];

    get(CompItem).each((x) => comps.push(x.name));
    get(TextLayer).each((t) => textLayers.push(t.name));

    return { comps, textLayers };
  }, filePath);

module.exports = { getStructure };
