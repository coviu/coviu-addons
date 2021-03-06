const { RESOURCE_TYPE, NAME } = require('./constants');
const styles = require('./styles/view.module.scss');

module.exports = (api) => {
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
                h('p', 'This is a in-call custom view.'),
                h('p', 'This will appear when addon is requested to activate'),
              ]),
            ]
          );
        }
      );
    },
  };
};
