import { RESOURCE_TYPE } from './constants'

exports.id = RESOURCE_TYPE

/**
  Returns the current context ID
 **/
exports.getCurrentContextID = function(resource) {
	if (!resource) return null;
	var item = (typeof resource === 'function' ? resource() : resource);
	return item.id;
};