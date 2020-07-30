import { RESOURCE_TYPE } from './constants'
import reactHook from './reactHook'

/**
 * The resource renderer defines how resources of a particular type should
 * be displayed within the Coviu interface
 */
export default function (api) {

	const { displayText } = api;
	const { h, thunk } = api.render;

	return {
		// Identifies the type of resources to be handled by this renderer
		id: RESOURCE_TYPE,

		// The label to be presented in the Add documents list
		label: () => displayText('Chart Example'),

		/**
		 * `activate` is called when a user clicks on the item in the documents
		 * list
		 */
		activate: () => {
			api.resources.add(RESOURCE_TYPE);
		},

		/**
		  Indicates whether the document resolution should be automatically scaled
		 **/
		preventResolutionUpdate: (resource) => {
			return false;
		},

		/**
		  Indicates whether or not to render a custom interface
		 **/
		requiresCustomInterface: function(resource) {
			return true;
		},

		/**
		  Render a view into the standard scaled resource view (toolbar/zoom/etc)
		 **/
		view: (resource, cache, resourceMethods, documentSizeCb, position, availableSpace) => {
			return h('div', 'This should not be shown');
		},

		/**
		  If a custom interface is required, render a custom interface
		 **/
		renderCustomInterface: (resource, cache, position, availableSpace, hashes) => {
			// Thunk to prevent excessive calls to the widget
			return thunk(`view-${resource.id}`, {
				resource: resource,
				cache: cache,
				height: availableSpace.height,
				width: availableSpace.width
			}, () => {
				return h('div', {
					style: {
						height: `${availableSpace.height}px`,
						width: `${availableSpace.width}px`
					},
					react: reactHook(cache.data.app)
				});
			})
		}
	}
}