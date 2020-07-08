const extract = require("./aeinteract");

extract
  .getProjectStructure("./test/white_ethnic.aep")
  .then((c) => {})
  .catch(console.log);
