import { RESOURCE_TYPE, NAME } from './constants';

export default function (api) {
  const { displayText } = api;

  return {
    id: RESOURCE_TYPE,
    description: NAME,

    /**
     * Called on the side that is adding the view (resource)
     */
    add: function (core, resources, opts = {}) {
      return new Promise((resolve, reject) => {
        const ownerId = api.local.id();

        const item = resources.methods.newResourceItem({
          category: RESOURCE_TYPE,
          owner: ownerId,
          metadata: {
            title: displayText(NAME),
          },
          recipients: { [ownerId]: 'received' },
          options: {},
          selected: !resources.store.active(),
          type: RESOURCE_TYPE,
        });

        return resolve(item);
      });
    },

    /**
     * Called on video is setup for all participants
     **/
    setup: function (core, resources, item) {
      // If we don't have a cache, request one
      if (!api.resources.getCache(item.id)) {
        const cache = resources.methods.newResourceCache(item.id, {});
        cache.status.set('active');
        resources.methods.setResourceCache(item.id, cache);
      }

      // Mark the resource as having been successfully initialized
      api.resources.received(item.id);
    },

    /**
     * Called on video is enabled for all participants
     **/
    enable: () => {},

    /**
     * Called on video is disabled for all participants
     **/
    disable: () => {},
  };
};
