const extract = require("./aeinteract");

extract
  .getProjectStructure("./test/white_ethnic.aep")
  .then((c) => {
    console.log(JSON.stringify(c, null, 2));
  })
  .catch(console.log);
