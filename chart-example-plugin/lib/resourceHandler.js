import { RESOURCE_TYPE } from './constants'
import ReactApp from './app/app'
import dataCapture from './dataCapture'

/**
 * The resource handler defines a handler that is able to handle
 * the processing for a particular category of resources
 */
export default function(api) {

	// displayText is used for providing i18n capabilities
	const { displayText } = api;

	let _handler = {};

	// Handler details
	_handler.id = RESOURCE_TYPE;

	/**
	  The `add` function is called when a user attempts to create
	  a new resource of this type

	  Note: This method is likely subject to change in the future
	  to move some of the information provided by the arguments into
	  better architected API methods
	 **/
	_handler.add = (core, resources, opts) => {
		opts = opts || {};

		return new Promise((resolve, reject) => {
			const ownerId = api.local.id();
			const { store } = resources;
			// Add the item straight away so we can track it's state
			let recipients = {
				[ownerId]: 'received'
			};
			let item = resources.methods.newResourceItem({
				category: _handler.id,
				owner: ownerId,
				metadata: { title: displayText(opts.title || opts.label || 'Chart Example') },
				recipients: recipients,
				options: { },
				selected: !store.active(),
				type: _handler.id
			});

			return resolve(item);
		});
	};

	/**
	  The `setup` function is called when a resource is initialized.
	  This can occur as a result of:
	  1. The owner added the resource, and it is now being initialized
	  2. A non-owner has received the resource document, and it is now being initialized
	  3. An owner left the call, and is now receiving the resource document as part of the resync process

	  Note: This method is likely subject to change in the future
	  to move some of the information provided by the arguments into
	  better architected API methods
	 **/
	_handler.setup = (core, resources, item) => {
		const localId = api.local.id();

		// Wait for the local cache to be ready
		api.resources.waitForCache(item.id).then((cache) => {
			const owner = api.state.participants()[item.owner];
			const capture = dataCapture(api, item, core.mesh);
			cache.data.put('capture', capture)
			cache.data.put('app', <ReactApp capture={capture} name={owner ? owner.displayName : 'John Doe'} />);
			// Create the react app component
			cache.status.set('active');
		}).catch(console.error);

		// If we don't have a cache, request one
		if (!api.resources.getCache(item.id)) {
			let cache = resources.methods.newResourceCache(item.id, {});
			resources.methods.setResourceCache(item.id, cache);
		}

		// Mark the resource as having been successfully initialized
		api.resources.received(item.id);
	};

	/**
		`enable` is called when an item is triggered as the active
		resource in the resource view. This allows you to reactivate
		any necessary components that are required for the resource to
		work

		Note: This method is likely subject to change in the future
		to move some of the information provided by the arguments into
		better architected API methods
	 **/
	_handler.enable = (core, resources, item) => {
		const me = api.local.id();
		// If we are the owner, start spitting out data
		if (me === item.owner) {
			return api.resources.waitForCache(item.id).then((cache) => {
				const { capture } = cache.data();
				if (capture) capture.start()
			});
		}
		return Promise.resolve();
	};

	/**
		`disable` is called when an item is removed as the active resource
		in the resource view, allowing appropriate deallocation of resources
		that aren't needed while the resource is not in the forefront.

		It may be called multiple times without necessarily having been
		enabled

		Note: This method is likely subject to change in the future
		to move some of the information provided by the arguments into
		better architected API methods
	 **/
	_handler.disable = (core, resources, item) => {
		const me = api.local.id();
		// If we are the owner, start spitting out data
		if (me === item.owner) {
			return api.resources.waitForCache(item.id).then((cache) => {
				const { capture } = cache.data();
				if (capture) capture.stop()
			});
		}
		return Promise.resolve();
	};

	/**
		`remove` is called when an item is deleted.
	 **/
	_handler.remove = (core, resources, item) => {
		return Promise.resolve();
	};

	return _handler;
}