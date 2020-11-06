const drawer = require('./lib/drawer')
const view = require('./lib/view')
const pluginConfig = require('./lib/configure');
const precallView = require('./lib/views/pre-call');
const postcallView = require('./lib/views/post-call');


/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface call plugin API
 */
function plugin(api) {
	return Promise.all([
		/* Register a pre-call view which emits a post message to the [cu]health system to indicate a call has begun */
		api.views.register(precallView(api)),
		/* Register a post-call view which emits a post message to the [cu]health system to indicate a call has finished */
		api.views.register(postcallView(api)),
	]).then(function() {
		return {
			name: 'View and Drawer Example'
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