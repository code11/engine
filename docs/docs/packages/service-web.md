---
id: service-web
title: "@c11/engine.service-web"
sidebar_label: "@c11/engine.service-web"
---

Engine provides a development and build server.

It uses `webpack` underneath the hood which you can easily configure according to your project needs.

```bash
npm i -D @c11/engine.service-web
```

Then add to `package.json`:
```
"scripts": {
  "start": "engine-service-web start",
  "build": "engine-service-web build",
}
```

## Configuration

Add a `engine.config.js` file in the application root to configure the `engine-service-web` behaviour.

Example:
```js
module.exports = {
  name: "My savy application",
  webpack: {
    development: {
      devServer: (config) => {
        config.proxy = {
          "/api/": "http://localhost:3333"
        }
        return config
      },
      config: (config, resolve) => {
        config.rules.push({
          test: /\.less$/i,
          use: [
            "style-loader",
            "css-loader",
            "less-loader",
          ],
        })
        return config;
      }
    }
  }
}
```

Type definition:

```ts
type ConfigFn<T> = (config: T, resolve: typeof require.resolve) => T;

type EngineConfig = {
  name?: string;
  exportAppStructure?: boolean;
  webpack?: {
    publicPath?: string;
    production?: {
      plugins?: {
        miniCssExtractPlugin: ConfigFn<
          ConstructorParameters<typeof MiniCssExtractPlugin>
        >;
        htmlWebpackPlugin?: ConfigFn<HtmlWebpackPlugin.Options>;
        definePlugin?: ConfigFn<
          ConstructorParameters<typeof webpack.DefinePlugin>[0]
        >;
      };
      config: ConfigFn<Configuration>;
    };
    development?: {
      devServer?: ConfigFn<Server.Configuration>;
      plugins?: {
        htmlWebpackPlugin?: ConfigFn<HtmlWebpackPlugin.Options>;
        definePlugin?: ConfigFn<
          ConstructorParameters<typeof webpack.DefinePlugin>[0]
        >;
      };
      config: ConfigFn<Configuration>;
    };
  };
}
```
