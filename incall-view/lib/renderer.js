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
      // const updater = api.resources.getCache(resource.id);

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
                h('p', 'This will appear when addon is requested to activate'),
                h('button', {
                  'ev-click': () => {
                    console.log(resource.id)
                  }
                }, 'Save')
              ]),
            ]
          );
        }
      );
    },
  };
};
