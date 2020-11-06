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
            console.log('api.webhooks.trigger');

            api.webhooks.trigger(
                "session",
                {
                    clientID: "clientID",
                    coviuSessionID: "coviuSessionID",
                    sessionStart: new Date(),
                    eventType: "sessionStart"
                },
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
