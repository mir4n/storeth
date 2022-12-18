const path = require("path");

module.exports = {
  output: {
    filename: "storeth.bundle.js",
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
};
