import preCallView from './lib/preCallView';
import postCallView from './lib/postCallView';

/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface call plugin API
 */
function plugin(api) {
	return Promise.all([
		// Registers a view precall view
		api.views.register(preCallView(api)),
		// Registers a view postcall view
		api.views.register(postCallView(api))
	]).then(function() {
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