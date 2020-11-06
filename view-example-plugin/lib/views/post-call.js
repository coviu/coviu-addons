module.exports = (api) => {

    const { h: renderHtml } = api.render;

    return {
        name: 'call-ended',
        phase: 'end',
        order: -1000, // Ensure the view is always right after the call view

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
                eventType: "sessionStop"
            };

            console.log("Debug - post call webhook trigger body", body);

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
