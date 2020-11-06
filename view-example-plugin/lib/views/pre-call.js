module.exports = (api) => {

    const { h: renderHtml } = api.render;

    console.log('pre-call.js')


    return {
        name: 'call-started',
        phase: 'precall',
        order: 1000, // Ensure the view is always right before the call view

        required: (context) => {ˆ
            return true;
        },

        /**
         This is called when this view becomes the active view
         **/
        view: (api) => {
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

            return () => {
                return renderHtml('div');
            }
        }
    }
}
