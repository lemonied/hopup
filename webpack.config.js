const path = require('path');

module.exports = function(env, argv) {
  return {
    mode: argv.mode,
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
      path: path.resolve(__dirname, './'),
      filename: argv.mode === 'production' ? './dist/hop-up.umd.js' : './dist/hop-up.development.umd.js',
      library: {
        name: 'HopUp',
        type: 'umd',
      },
    },
    externals: {},
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: '3',
                  loose: true
                },
              ],
              [
                '@babel/preset-typescript',
              ],
            ],
            plugins: [
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
      ],
    },
    target: 'web',
  };
};
