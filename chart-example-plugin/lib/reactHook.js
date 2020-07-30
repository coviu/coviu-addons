import React from 'react'
import ReactDOM from 'react-dom'

/**
 * This mercury hook allows attaching of React components to DOM elemets
 * @param {*} reactComponent
 */
export default function(reactComponent) {
	return Object.create({
		hook: (elem) => {
			if (!elem || !reactComponent) return;
			ReactDOM.render(reactComponent, elem);
		},
		// Cleanup on unhooking
		unhook: (elem) => {
			ReactDOM.unmountComponentAtNode(elem);
		}
	});
}