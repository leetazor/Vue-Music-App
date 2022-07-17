import _ from 'lodash';

export default {
  install(app) {
    // require.context() is a great way to perform a search on a group of files.
    // webpack imports this function for us - as long as webpack compiles our code.
    // the function has 3 arguments:
    // 1 - the directory, where webpack should begin its search. path must be relative to the current file.
    // 2 - whether webpack should bother searching through subdirectories, it's a boolean
    // 3 - regular expression for the file names. we want every file that ends with the 'vue' extension
    // require.context() returns information about the files. It doesn't take care of importing the file itself.
    const baseComponents = require.context(
      '../components/base/',
      false,
      /[A-Za-z0-9-_,\s]+\.vue$/i
      );
      // the list of files returned by the require.context() are not directly accessible by the variable.
      // If we want to loop through them, we need to call the keys() function.
      // the keys() function will return an array of files found, based on arguments passed into the require.context() function
      baseComponents.keys().forEach((fileName) => {
        // we need to import the component file and its data, we'll declare a variable 'componentConfig'
        // it's value will be the data, returned from the 'baseComponents' function
        // 'baseComponents' is not just an object, it can also be used as a function.
        // if used as a function, we can pass it in the file name for Webpack to import the component
        // parsing of the file will be performed by the Webpack before it's returned from the function
        // Webpack will return a Component Configuration object
        // it's the same object we would pass into the app.component function. we can use it to register the component.

        const componentConfig = baseComponents(fileName);
        // before we get to that, we want to format the name of the component with _lodash:
        // the _.upperFirst() will Capitalise the first letter of the string. 
        // the _.camelCase() will camelCase the string
        // in addition, we're going to chain two regular expressions to the fileName
        // the first regex wil lsearch for a ./ inside the string, every file name will start with those characters - we're removing them with the 'replace' function
        // the second regex will remove .vue extension from the file name

        const componentName = _.upperFirst(
          _.camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')),
          );

          // export default
          // by assigning 'or' ( || ) operator in the secnd argument, we can check if the default property holds the configuration options
          // if it does, it will be passed in, otherwise we'll pass the object as is
          app.component(
            `Base${componentName}`, componentConfig.default || componentConfig
            );

      });
  }
}