const drawer = require('./lib/drawer')
const view = require('./lib/view')

/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface call plugin API
 */
function plugin(api) {
	return Promise.all([
		// Registers a view
		api.views.register(view(api)),
		// Register the drawer. You could programmatically choose to register the drawer only for a particular role
		// of person
		api.drawers.registerDrawer(drawer(api))
	]).then(function() {
		return {
			name: 'View and Drawer Example'
		};
	});
}

if (typeof activate !== 'undefined') {
	activate(plugin);
} else {
	module.exports = plugin;
}