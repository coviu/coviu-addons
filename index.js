const drawer = require('./lib/drawer');
const precallView = require('./lib/precallView');
const postcallView = require('./lib/postcallView');
const pluginConfig = require('./lib/configure');

/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface call plugin API
 */
function plugin(api) {
	return Promise.all([
		// Registers a view precall view
		api.views.register(precallView(api)),

		// Registers a view postcall view
		api.views.register(postcallView(api)),

		// Register the drawer. You could programmatically choose to register the drawer only for a particular role
		// of person
		api.drawers.registerDrawer(drawer(api))
	]).then(function() {
		return {
			name: 'Coviu Demo Plugin'
		};
	});
}

if (typeof configure !== 'undefined') {
	configure(pluginConfig);
} else if (typeof activate !== 'undefined') {
	activate(plugin);
} else {
	module.exports = plugin;
}