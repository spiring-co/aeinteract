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
    // don't open file if already loaded
    if (!(app.project.file && app.project.file.toString().includes(fp)))
      app.open(new File(fp));

    const comps = [];
    const textLayers = [];

    get(CompItem).each((x) => comps.push(x.name));
    get(TextLayer).each((t) => textLayers.push(t.name));

    return { comps, textLayers };
  }, filePath);

const sandBox = async (fp) => {
  return ae.execute((fp) => {
    return console.log(app.project.file.toString());
  }, fp);
};
getStructure("~/Desktop/myFile.aep").then(console.log).catch(console.error);
module.exports = { getStructure };
