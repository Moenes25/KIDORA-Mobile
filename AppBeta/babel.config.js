module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // 1. Add dotenv config here
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    // 2. Reanimated must stay LAST
    'react-native-reanimated/plugin',
  ],
};