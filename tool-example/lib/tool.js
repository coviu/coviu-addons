var debug = require('debug')('coviu:tool:cursor');
var verbose = require('debug')('verbose:tool:cursor');

const TOOL_ID = '?';

module.exports = function(api) {

    return {

        id: TOOL_ID,

        // When the tool is loaded
        setup: () => {

        },

        // Handle cursor input, if required
        cursor: (cursor, item) => {

        },

        // When the tool is enabled
        enable: () => {

        },

        // When the tool is disabled
        disable: () => {

        },

        /**
          Returns the group that this control will be rendered into, along with the priority
          If this is undefined, or not implemented, will render into the main controls
          Can be either a string of the group name: `group: "<name of group>"` (defaults to priority of 100)
          Or a function `group: (item) => { return { group: "<name of group>" } }`
          Or an object `group: { group: "name of group", priority: 1 }`
         **/
        group: 'main',

        // When a document update is triggered, indicate whether this tool is required
        // If not defined, the tool will be always required
        required: (item, toolState) => {
            return true;
        },

        // Render the control
        render: (item, toolState, ident) => {
            return api.render.ToolbarButton({
                'ev-click': () => {
                    api.tools.enable(TOOL_ID)
                },
                attributes: {'aria-label': 'New tool'},
                tooltip: api.render.Tooltip('This tool does things'),
                className: toolState.active ? '.-active' : '',
                dataset: {
                    ident: toolState.active ? ident : null,
                    tool: TOOL_ID
                }
            });
        }
    };
}