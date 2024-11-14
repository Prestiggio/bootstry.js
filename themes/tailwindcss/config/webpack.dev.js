const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require('./cenv');
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
    devServer: {
        static: {
            directory: 'public'
        },
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        port: 8044,
        allowedHosts: 'all',
        hot: true
    },
    optimization: {
        moduleIds: 'named'
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({}),
        new Dotenv({
            path: path.resolve(__dirname, '.env.local')
        }),
        new CKEditorWebpackPlugin( {
            // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
            language: 'en',
            addMainLanguageTranslationsToAllAssets: true,
            buildAllTranslationsToSeparateFiles: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/,
                exclude: [
                    /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                ],
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'autoprefixer'
                                    ],
                                ],
                            },
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: false,
                            debug: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|cur|ico|webp|manifest|webmanifest?)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                    maxSize: 8192
                    }
                },
                exclude: [
                    /\.(js|mjs|jsx|ts|tsx)$/,
                    /\.html$/,
                    /\.json$/,
                    /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                    /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/
                ]/*,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: `/rythemes/${config.theme.path}/medias/images/`,
                            outputPath: 'medias/images/'
                        }
                    }
                ]*/
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                use: [ 'raw-loader' ]
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig( {
                                themeImporter: {
                                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                                },
                                minify: true
                            } )
                        }
                    }
                ]
            },            
        ]
    }
})
