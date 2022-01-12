import { RESOURCE_TYPE } from './constants';

export default function (api) {
  return {
    id: RESOURCE_TYPE,

    getCurrentContextID: function (resource) {
      if (!resource) return null;
      const item = typeof resource === 'function' ? resource() : resource;
      return item.id;
    },
  };
};
