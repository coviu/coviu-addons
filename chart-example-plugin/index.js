import React from 'react'
import ReactDOM from 'react-dom'

import handler from './lib/resourceHandler'
import renderer from './lib/resourceRenderer'
import doc from './lib/resourceDocument'
import drawer from './lib/drawer'

// Super hacky, but React needs to exist in window.React otherwise
// it throws `React is not defined` exceptions
if (!window.React) {
	window.React = React;
}

/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface plugin API
 */
function plugin(api) {
	return Promise.all([
		// Register the resource handler
		api.resources.registerHandler(handler(api)),
		// Register the resource renderer
		api.resources.registerRenderer(renderer(api)),
		// Register the resource document
		api.resources.registerDocument(doc),
		// Register the drawer. You could programmatically choose to register the drawer only for a particular role
		// of person
		api.drawers.registerDrawer(drawer(api))
	]).then(function() {
		return {
			name: 'Chart Example'
		};
	});
}

if (typeof activate !== 'undefined') {
	activate(plugin);
} else {
	module.exports = plugin;
}