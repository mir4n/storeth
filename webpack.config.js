const path = require("path");
 
module.exports = {
 entry: path.join(_dirname, "lib/index.js"),
 module: {
   rules: [
     {
       test: /\\.(js|jsx)?$/,
       include: path.resolve(_dirname, "lib"),
       exclude: /node\_modules/,
       use: [
         {
           loader: "babel-loader",
           options: {
             cacheDirectory: true,
             presets: ["module:metro-react-native-babel-preset"],
             plugins: ["react-native-web"],
           },
         },
       ],
     },
     {
       test: /\\.(gif|jpe?g|png|svg)$/,
       use: {
         loader: "url-loader",
         options: {
           name: "\[name\].\[ext\]",
           esModule: false,
         },
       },
     },
   ],
 },
 resolve: {
   extensions: [".ts", ".tsx", ".js", ".jsx"],
   alias: {
     "react-native$": "react-native-web",
   },
 },
 externals: {
   react: {
     commonjs: "react",
     commonjs2: "react",
     amd: "React",
     root: "React",
   },
   "react-dom": {
     commonjs: "react-dom",
     commonjs2: "react-dom",
     amd: "ReactDOM",
     root: "ReactDOM",
   },
 },
};