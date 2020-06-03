const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });
const s3 = new AWS.S3();

module.exports = {
  /**
   * @param  {String} Key Path of the file
   * @param  {} Body File body
   * @param  {} Bucket="spiring-creator"
   */
  upload: (Key, Body, Bucket = "spiring-creator") => {
    const uploadParams = { Bucket, Key, Body, ACL: "public-read" };
    return new Promise((resolve, reject) => {
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          reject(err);
        }
        if (data) {
          resolve(data.Location);
        }
      });
    });
  },
};
