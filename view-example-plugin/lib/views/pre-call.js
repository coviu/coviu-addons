module.exports = (api) => {

    const { h: renderHtml } = api.render;

    console.log('pre-call.js')
    window.api = api;

    return {
        name: 'call-started',
        phase: 'precall',
        order: 1000, // Ensure the view is always right before the call view

        required: (context) => {
            return true;
        },

        /**
         This is called when this view becomes the active view
         **/
        view: (viewApi) => {
            console.log('Debug - api.webhooks.trigger');
            console.log("Debug - pre call api.local id", api.local.id());

            const body = {
                clientID: api.local.id(),
                coviuSessionID: api.local.id(),
                sessionStart: new Date(),
                eventType: "sessionStart"
            };
            console.log("Debug - pre call webhook trigger body", body);
            // api.webhooks.trigger(
            //     'submission',
            //     null,
            //     {},
            //     {
            //         data: true,
            //         search_field_1: 100590978,
            //         search_value_1: 'test'
            //     }
            // );

            viewApi.next();

            return () => {
                return renderHtml('div');
            }
        }
    }
}
