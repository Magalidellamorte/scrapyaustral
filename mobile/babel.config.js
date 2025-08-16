module.exports = {
  presets: [['babel-preset-expo', { runtime: 'classic' }]],
  overrides: [
    {
      test: function (fileName) {
        return !fileName.includes('node_modules/react-native-maps');
      },
      plugins: [
        [require('@babel/plugin-transform-private-methods'), { loose: true }],
      ],
    },
  ],
};
