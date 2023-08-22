import { RESOURCE_TYPE, NAME } from './constants';
import {Buffer} from 'buffer'

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

      let cache = api.resources.getCache(item.id)
      // If we don't have a cache, request one
      if (!cache) {
        cache = resources.methods.newResourceCache(item.id, {});
        cache.status.set('active');
        resources.methods.setResourceCache(item.id, cache);
      }

      // initialise the message list
      cache.data.put("messages", [])

      // Create the dataStream and put it on the cache so it's accessible elsewhere in the app
      const dataStream = api.streaming.events('EXAMPLE', encoder, decoder);
      cache.data.put("dataStream", dataStream)

      // Subscribe to stream events and update the local cache message array on events
      dataStream.on(data => {
        cache.data.put("messages", [...cache.data.messages, data.message])
      })

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

const encoder = (data, opts) => {
  return Buffer.from(JSON.stringify(data), 'utf-8');
}

const decoder = (buffer) => {
  return JSON.parse(buffer.toString());
}