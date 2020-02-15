// vue.config.js
let path = require("path");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/[dsnblog]/" : "/",
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          include: [path.resolve(__dirname, "src/demoCmp")],
          use: [
            {
              loader: "extract-meta-loader",
              options: {
                dest: "src/config/demosMeta.ts",
                wrapper: /(?<=\/\*\*)[\s\S]*?(?=\*\/)/,
                metasRegexps: {
                  title: "title:"
                },
                append: function(loaderCtx, data, getRegexpRes) {
                  let path =
                    "/demo" +
                    getRegexpRes(
                      loaderCtx.resourcePath,
                      /(?<=\\demoCmp).*?(?=\.vue)/
                    )
                      .replace(/\\/g, "/")
                      .replace(/\/index$/, "");
                  return { path };
                }
              }
            }
          ]
        },
        {
          test: /\.ts$/,
          include: [path.resolve(__dirname, "src/demoCmp/canvas")],
          use: [
            {
              loader: "extract-meta-loader",
              options: {
                dest: "src/config/canvasDemos.ts",
                wrapper: /(?<=\/\*\*)[\s\S]*?(?=\*\/)/,
                metasRegexps: {
                  title: "title:"
                },
                append: function(loaderCtx, data, getRegexpRes) {
                  console.log(loaderCtx.resourcePath);
                  let name = getRegexpRes(
                    loaderCtx.resourcePath,
                    /(?<=\\)\w*?\.js$/
                  );
                  return { path: "/demo/canvas", name };
                }
              }
            }
          ]
        },
        {
          test: /\.md$/,
          use: [
            "vue-loader",
            {
              loader: "vue-markdown-loader/lib/markdown-compiler",
              options: {
                raw: true
              }
            },
            {
              loader: "extract-meta-loader",
              options: {
                dest: "src/config/articleMeta.ts",
                wrapper: "---",
                deleteMetaInfo: true,
                metasRegexps: {
                  title: "title:",
                  tags: function(data, getRegexpRes) {
                    let tagText = getRegexpRes(data, /(?<=tags:\s*).*/g);
                    return getRegexpRes(tagText, /(?<=\[\s?).*(?=\])/).split(
                      /,\s+/
                    );
                  },
                  date: "date:",
                  categories: "categories:",
                  test: "test:"
                },
                append: function(loaderCtx, data, getRegexpRes) {
                  let path =
                    "/article" +
                    getRegexpRes(
                      loaderCtx.resourcePath,
                      /(?<=\\post)\\.*?(?=.md)/
                    ).replace(/\\/g, "/");
                  return { path };
                }
              }
            }
          ]
        }
      ]
    }
    // resolveLoader: {
    //     modules: ['node_modules', 'loader']
    // }
  }
};
