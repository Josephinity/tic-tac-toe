const path = require("path");

module.exports = {
    mode: process.env.NODE_ENV ?? "development",  // Either "development" or "product"
    entry: "./src/entrypoint.tsx", // Where to find the input .tsx files
    module: {
        rules: [
            {
                test: /.tsx?$/,
                exclude: /node_modules/,
                use: "ts-loader",
                // An alternative to ts-loader, use babel-loader to parse jsx to js
                // test: /.jsx?$/,
                // use: {
                //     loader: "babel-loader",
                //     options: {
                //         presets: [
                //             "@babel/preset-env",
                //             ["@babel/preset-react", { runtime: "automatic" }],
                //         ],
                //     },
                // },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: { // This is where to put the .js file transpiled from .jsx files
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js",
    },

};

/**
 * Go to terminal and run the build script in package.json
 * When terminal enters "yarn build",
 * the script runs and automatically finds webpack.config.js,
 * where it runs module.exports
*/
