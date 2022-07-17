import camelCase from 'lodash/camelCase';

const requireModule = require.context(
  // the below regex will search for file with .js extension
  '.', false, /\.js$/,
);
const modules = {};

requireModule.keys().forEach((fileName) => {
  if(fileName === './index.js' || fileName === './dummy.js') {
    return;
  }
  const moduleConfig = requireModule(fileName);
  // the below regex will remove ./ from the beginning of the name, and also remove .js extension:
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''));
  modules[moduleName] = moduleConfig.default || moduleConfig;  
});

export default modules;