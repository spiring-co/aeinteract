const ae = require("after-effects");
const path = require("path");
ae.options.errorHandling = true;
ae.options.minify = false;
ae.options.includes = [
  "./node_modules/after-effects/lib/includes/console.jsx",
  "./node_modules/after-effects/lib/includes/es5-shim.jsx",
  "./node_modules/after-effects/lib/includes/get.jsx",
  "./es6-shims.jsx",
];

/**
 * @param  {String} filePath - path of aep or aepx file
 */
const getProjectStructure = (filePath) =>
  ae.execute((fp) => {
    app.saveProjectOnCrash = false;
    app.activate();
    app.onError = console.log;
    // app.project.expressionEngine ='extendscript';
    app.beginSuppressDialogs();
    app.purge(PurgeTarget.ALL_CACHES);
    app.setSavePreferencesOnQuit(false);
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    console.log("user: " + system.userName + " machine: " + system.machineName);

    var fileToOpen = new File(fp);
    console.log(fileToOpen);
    if (!fileToOpen.exists) throw new Error("File does not exist");
    if (!app.open(fileToOpen)) throw new Error("Failed to open file");

    // log project info
    console.log(app.project.numItems + "items in this project.");

    var comps = {};
    var compMapping = {};

    var getCompStructure = function (id) {
      if (!id) return;

      var comp = app.project.itemByID(id);

      if (!comp) return;
      if (comps.hasOwnProperty(id)) return comps[id];

      var structure = { textLayers: [], imageLayers: [], comps: {} };

      for (var j = 1; j < comp.layers.length + 1; j++) {
        var layer = comp.layers[j];

        if (layer instanceof AVLayer) {
          if (layer.property("sourceText") === null) {
            if (layer.source instanceof CompItem) {
              structure.comps[layer.source.id] = getCompStructure(
                layer.source.id
              );
            }
          }
          if (layer.source instanceof FootageItem) {
            if (layer.source.mainSource && layer.source.mainSource.isStill) {
              // AV Layer is placeholder
              var il = {};
              il["index"] = layer.index;
              il["name"] = new String(layer.name);
              il["height"] = layer.height;
              il["width"] = layer.width;
              il["extension"] = new String(layer.source.file).split(".").pop();
              structure["imageLayers"].push(il);
            }
          }
        }

        if (layer instanceof TextLayer) {
          var tl = {};
          tl["index"] = layer.index;
          tl["name"] = new String(layer.name);
          tl["text"] = new String(layer.property("Source Text").value);
          tl["font"] = layer.property("Source Text").value.font;
          structure["textLayers"].push(tl);
        }
      }
      comps[id] = structure;
    };

    var staticAssets = [];
    for (var i = app.project.numItems; i > 0; i--) {
      var item = app.project.items[i];
      switch (item.typeName) {
        case "Folder":
          break;
        case "Footage":
          if (
            item.mainSource &&
            item.mainSource.file &&
            !staticAssets.includes(item.mainSource.file)
          )
            staticAssets.push(new String(item.mainSource.file));
          break;
        case "Composition":
          compMapping[item.id] = item.name;
          getCompStructure(item.id);
          break;
      }
    }
    return { compositions: comps, staticAssets, compMapping };
  }, path.resolve(filePath));
module.exports = { getProjectStructure };
