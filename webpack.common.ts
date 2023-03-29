import * as webpack from "webpack";
import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";

export default function (mode: "Debug" | "Release", constants: Constants, useWorkboxServiceWorker: boolean): webpack.Configuration {

    let { } = constants;

    return {
        mode: mode === "Debug" ? "development" : "production",
        entry: "./src/index.tsx",
        output: {
            filename: "[name].[contenthash].js",
            path: path.resolve(__dirname, "./build"),
            clean: true,
            publicPath: "/"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".scss"],
            modules: ["node_modules"],
            fallback: {

            }
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/i,
                    exclude: /node_modules/,
                    use: "ts-loader"
                },
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            "tailwindcss",
                                            {
                                                // Options
                                            },
                                        ],
                                        [
                                            "autoprefixer",
                                            {
                                                // Options
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ]
        },
        optimization: {
            minimizer: [
                // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
                `...`,
                new CssMinimizerPlugin(),
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                DEBUG: JSON.stringify(mode === "Debug"),
                RELEASE: JSON.stringify(mode === "Release"),
                VERSION: JSON.stringify(process.env.npm_package_version)
            }),
            new HtmlWebpackPlugin({
                title: "Test",
                template: "./src/index.html",
                filename: "index.html",
                inject: "body",
                scriptLoading: "blocking"
            }),
            new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" })
        ]
    } as webpack.Configuration;
};

export interface Constants {

}