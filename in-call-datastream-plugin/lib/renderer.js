import { RESOURCE_TYPE, NAME } from './constants';
import styles from './styles/view.module.css';

export default function (api) {
  const {
    displayText,
    render: { h, thunk },
  } = api;

  return {
    id: RESOURCE_TYPE,
    label: displayText('In-call view demo'),
    description: NAME,

    /**
     * Called when renderer is loaded
     */
    activate: () => {
      api.resources.add(RESOURCE_TYPE);
    },

    /**
     * Indicates whether or not to render a custom interface
     */
    requiresCustomInterface: function (resource) {
      return true;
    },

    /**
     * If a custom interface is required, render a custom interface
     */
    renderCustomInterface: (
      resource,
      cache,
      position,
      availableSpace,
      hashes
    ) => {
      return thunk(
        `view-${resource.id}`,
        {
          resource: resource,
          cache: cache,
        },
        () => {
          return h(
            `div.${styles.ExamplePage}`,
            {
              style: {
                height: `${availableSpace.height}px`,
                width: `${availableSpace.width}px`,
              },
            },
            [
              h(`div.${styles.Contents}`, [
                h('h1', 'This is a demo of in-call data streaming.'),
                h('button', {

                  'ev-click': (event) => {
                    // Transmit an event to everyone else in the call
                    cache.data.dataStream.to("all", {message: `Message sent from ${api.local.id()}`})
                  }
                }, ["Send a new event"]),
                // Render out the messages from the locally cached messages
                ...cache.data.messages.map(message => {
                  return h('p', message)
                })

              ]),
            ]
          );
        }
      );
    },
  };
};
