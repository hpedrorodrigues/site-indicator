// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';

const WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  path = require('path'),
  debounce = require('lodash').debounce,
  SSEStream = require('ssestream').default,
  config = require('./webpack.config'),
  env = require('./env'),
  Events = require('./autoReloadScripts/events');

const excludeEntriesToHotReload = config.custom.notHotReload || [];

for (const entryName in config.entry) {
  if (['background', 'contentScript'].includes(entryName)) {
    config.entry[entryName] = [
      path.resolve(
        __dirname,
        `autoReloadScripts/${entryName}.js?port=${env.PORT}`
      ),
    ].concat(config.entry[entryName]);
  } else if (!excludeEntriesToHotReload.includes(entryName)) {
    config.entry[entryName] = [
      'webpack/hot/dev-server',
      `webpack-dev-server/client?hot=true&hostname=localhost&port=${env.PORT}`,
    ].concat(config.entry[entryName]);
  }
}

delete config.custom;

const compiler = webpack(config);

const server = new WebpackDevServer(
  {
    https: false,
    hot: false,
    client: false,
    compress: false, // SSE doesn't work when this config is enabled!
    host: 'localhost',
    port: env.PORT,
    static: {
      directory: path.join(__dirname, '../build'),
    },
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}/`,
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined!');
      }

      // imagine you are using app.use(path, middleware) in express.
      // in fact, devServer is an express server.
      middlewares.push({
        path: '/__server_sent_events__', // you can find this path requested by background.js.
        middleware: (request, response) => {
          const sseStream = new SSEStream(request);
          sseStream.pipe(response);

          sseStream.write('message from webserver.');

          let closed = false;

          const compileDoneHook = debounce((stats) => {
            const { modules } = stats.toJson({ all: false, modules: true });
            const updatedJsModules = modules.filter(
              (module) =>
                module.type === 'module' &&
                module.moduleType === 'javascript/auto'
            );

            const isBackgroundUpdated = updatedJsModules.some((module) =>
              module.nameForCondition.startsWith(
                path.resolve(__dirname, '../src/scripts/background')
              )
            );
            const isContentScriptsUpdated = updatedJsModules.some((module) =>
              module.nameForCondition.startsWith(
                path.resolve(__dirname, '../src/scripts/contentScript')
              )
            );

            const shouldBackgroundReload =
              !stats.hasErrors() && isBackgroundUpdated;
            const shouldContentScriptsReload =
              !stats.hasErrors() && isContentScriptsUpdated;

            if (shouldBackgroundReload || shouldContentScriptsReload) {
              sseStream.writeMessage(
                { event: Events.ReloadExtension, data: {} },
                'utf-8'
              );
            }
          }, 1000);

          const plugin = (stats) => {
            if (!closed) {
              compileDoneHook(stats);
            }
          };

          // this plugin will be triggered after each compilation done.
          compiler.hooks.done.tap('extension-auto-reload-plugin', plugin);

          response.on('close', () => {
            closed = true;
            sseStream.unpipe(response);
          });
        },
      });

      return middlewares;
    },
  },
  compiler
);

(async () => {
  await server.start();
})();
