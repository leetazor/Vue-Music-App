const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Music App',
    themeColor: '#ff5e3a',
    manifestOptions: {
      short_name: 'Music',
    }
  },
});
