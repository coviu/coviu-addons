import document from './lib/document';
import handler from './lib/handler';
import renderer from './lib/renderer';

/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface call plugin API
 */
function plugin(api) {
  return Promise.all([
    api.resources.registerDocument(document(api)),
    api.resources.registerHandler(handler(api)),
    api.resources.registerRenderer(renderer(api)),
  ]).then(function () {
    return {
      name: 'DEMO',
    };
  });
}

if (typeof activate !== 'undefined') {
  activate(plugin);
} else {
  module.exports = plugin;
}
