const { render } = require("@nexrender/core");
const AERENDER_PATH = "/Applications/Adobe After Effects CC 2014/aerender";
const WORKPATH = "./tmp";
async function renderFromData({ data, composition, templateFilePath }) {
  const assets = Object.keys(data).map((k) => {
    return {
      type: "data",
      layerName: k,
      property: "Source Text",
      value: data[k],
    };
  });

  const actions = {
    postrender: [
      {
        module: "@nexrender/action-encode",
        preset: "mp4",
        output: "encoded.mp4",
      },
      {
        module: "@nexrender/action-copy",
        input: "encoded.mp4",
        output: "../result.mp4",
      },
    ],
  };

  const job = {
    template: { src: templateFilePath, composition, continueOnMissing: true },
    assets,
    actions,
    onRenderProgress: (j, progress) => console.log(progress),
    onChange: (j, state) => console.log(state),
  };

  return render(job, {
    workpath: WORKPATH,
    binary: AERENDER_PATH,
    skipCleanup: false,
    addLicense: false,
  });
}

module.exports = { renderFromData };
