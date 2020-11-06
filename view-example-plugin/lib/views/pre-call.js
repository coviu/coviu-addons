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

            const body = {
                clientID: api.local.id(),
                coviuSessionID: api.local.id(),
                sessionStart: new Date(),
                eventType: "sessionStart"
            };
            console.log("Debug - pre call webhook trigger body", body);

            api.webhooks.trigger(
                "session",
                body,
                {},
                null
            )

            viewApi.next();

            return () => {
                return renderHtml('div');
            }
        }
    }
}
