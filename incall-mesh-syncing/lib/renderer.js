import { RESOURCE_TYPE, NAME } from './constants';
import styles from './styles/view.module.css';

export default function (api) {
  const {
    displayText,
    render: { h, thunk },
  } = api;

  return {
    id: RESOURCE_TYPE,
    label: displayText('In-call mesh syncing demo'),
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
          console.log({cache})
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
                h('p', 'This is a in-call custom view.'),
                h('p', 'The below button selection will sync across participants in a call and will be preserved and loadable by new participants'),
                h('input', {
                  type: 'text',
                  name: 'sharedString',
                  // Use the state from the saved mesh values as the value of the input field
                  // This will be kept up to date when someone else changes values in the mesh
                  value: String(resource.metadata.sharedString),
                  'ev-event': (event) => {
                    if(event.type === 'keyup') {
                      // When a key is lifted, then we know input has finished and we can put the value into the mesh
                      // The transaction method takes 
                      api.resources.transaction(resource.id, (item, done) => {
                        item.metadata.sharedString = event.target.value
                        item.randomThing = "Add something extra to the mesh"
                        return done()
                        // Callback here to handle errors (I think)
                      }, () => {})
                    }
                  }
                })
              ]),
            ]
          );
        }
      );
    },
  };
};
