var aeToJSON = require("ae-to-json/after-effects");
var ae = require("after-effects");
// shim in es5 functionality
require("es5-shim");

// you might want to make JSON be a global
JSON = require("JSON2");
ae.options.includes = [
  "./node_modules/after-effects/lib/includes/console.jsx",
  "./node_modules/after-effects/lib/includes/es5-shim.jsx",
  "./node_modules/after-effects/lib/includes/get.jsx",
];
ae.execute(aeToJSON)
  .then(function (json) {
    console.log(json);
    // do something with the json outout
  })
  .catch(function (e) {
    console.error(e);
  });
