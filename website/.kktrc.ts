import path from 'path';
import webpack from 'webpack';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';
import lessModules from '@kkt/less-modules';
import rawModules from '@kkt/raw-modules';
import scopePluginOptions from '@kkt/scope-plugin-options';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import pkg from 'monaco-editor-nginx/package.json';

export default (conf: WebpackConfiguration, env: 'production' | 'development', options: LoaderConfOptions) => {
  conf = rawModules(conf, env, { ...options });
  conf = scopePluginOptions(conf, env, {
    ...options,
    allowedFiles: [path.resolve(process.cwd(), 'README.md')],
  });
  conf = lessModules(conf, env, options);
  // Get the project version.
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  );
  conf.plugins!.push(
    new MonacoWebpackPlugin({
      languages: ['json'],
    }),
  );
  if (env === 'production') {
    conf.output = { ...conf.output, publicPath: './' };
    conf.optimization = {
      ...conf.optimization,
      splitChunks: {
        automaticNameDelimiter: '.',
        maxSize: 500000,
        minSize: 100000,
        cacheGroups: {
          reactvendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            reuseExistingChunk: true,
            chunks: 'all',
            priority: -10,
          },
          monacoeditor: {
            test: /[\\/]node_modules[\\/](monaco-editor)[\\/]/,
            name: 'monaco-editor-vendor',
            chunks: 'all',
          },
        },
      },
    };
  }
  return conf;
};
