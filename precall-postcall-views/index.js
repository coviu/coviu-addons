const preCallView = require('./lib/preCallView');
const postCallView = require('./lib/postCallView');

/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface call plugin API
 */
function plugin(api) {
	return Promise.all([
	]).then(function() {
		const isHost = api.call.hasOwnerAccess();

		// Registers a view precall view
		api.views.register(preCallView(api));

		// Registers a view postcall view
		api.views.register(postCallView(api));

		return {
			name: 'Coviu Demo Plugin'
		};
	});
}

if (typeof activate !== 'undefined') {
	activate(plugin);
} else {
	module.exports = plugin;
}