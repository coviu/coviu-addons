const { DRAWER_ID } = require('./constants')
const styles = require('./styles/drawer.module.scss');

/**
 * This adds a drawer that is used to display vital statistics
 * 
 * api object is provided from Coviu platform when a plugin (AKA addon)
 * is activated and it provides methods that allow plugin to interact with 
 * the call and other resources on coviu platform
 */
module.exports = (api) => {

	// extract mercury (h)& thunk instances  for use in plugin ui rendering
	// extract DrawerToggle & DrawerHelp to use for drawer rendering
	const { h, thunk, DrawerToggle, Tooltip, DrawerHelp } = api.render;
	const { array, value } = api.observ;
	const { displayText } = api;
	
	// Initialize state for  counter & calculations
	const counterState = value(1);
	const calculationsState = array([]);

	// Initialize state for call participants	
	const callParticipantsState = array(api.call.participants());

	//Initialize state for webhook response 
	const webhookCallResponse = value({})

	// define a function for retriving participants using the api.call.participants() method
	const getParticipants = ()=> {	
		const participants = api.call.participants();
		// call set method on state variable notifies api.observe of state change 
		// note : using direct assignment as in (callParticipantsState = api.call.participants()) will not notify state change
		callParticipantsState.set(participants);
	}

	/*
	define a method to call for triggering webhook call
	webhook call is used to make a call to an exteranl api endpoint 
	for webhook call to work it needs to reference a webhook id that is registered in the plugin config 
	when call is successful the webhook will return  
	{
		referenceId: <String>,
		status: <Number>,
		data: <Object>,
		error: <Boolean>
	}  */

	   const triggerWebhook = () => {
        return api.webhooks.trigger('addons-demo-webhook').then(resp => {
            console.error('webhook resoonse',resp);
			webhookCallResponse.set(resp.data);
			console.error('webhook webhookCallResponse',webhookCallResponse);
        }).catch(err => {
            console.error('webhook error',err);
            state.status.set('error')
        });
    }


	return {
		id: DRAWER_ID,

		/**
		 * Identifies the positioning of the drawer (left/right)
		 */
		container: 'right',

		/**
		 * Called to setup the drawer.
		 * `drawerData` is an observable store that can be used to store drawer state information
		 **/
		setup: (drawerData) => {
			// We can attach our drawer state here to trigger updates
			drawerData.put('counter', counterState);
			drawerData.put('calculations', calculationsState);
			drawerData.put('participantState', callParticipantsState);
			drawerData.put('webhookResponse',webhookCallResponse);
			// Hook up to receive incoming view calculations
			api.mesh.request('view-calculation').then(calculations => {

				// Listen for new calculations
				calculations.set.on('add', (calculation) => {
					calculationsState.push(calculation.state);
				})
			});
			
		},

		/**
		 * This renders the drawer toggle (button)
		 **/
		renderToggle: (drawerState, active) => {
			return thunk(`${DRAWER_ID}_toggle`, { drawerState, active }, () => {
				return DrawerToggle(DRAWER_ID, {
					notify: drawerState.calculations.length,
					label: displayText('View Calculations'),
					open: active === DRAWER_ID,
					className: styles.DrawerToggle
				}, () => {
					if (active !== DRAWER_ID) {
						api.drawers.open(DRAWER_ID);
					} else {
						api.drawers.close(DRAWER_ID)
					}
				});
			});
		},

		/**
		 * Renders the drawer
		 **/
		renderDrawer: (drawerState, active) => {
			return thunk(DRAWER_ID, { drawerState }, () => {
				const { counter, calculations ,participantState,webhookResponse} = drawerState;
				console.log('drawer State => ',drawerState)
				return h('div.Drawer_Content', [
					h('div',' '),
					DrawerHelp('	About this drawer', 
					['You can add all sorts of elements here - premade components, as well as custom ones']),
					h('div.Drawer_Title', 'Calculations'),
					h('button.Button', {
						'ev-click': () => counterState.set(counter + 1)
					}, 'Increment'),
					h('div', `Current count: ${counter}`),
					h('label', 'Guest Calculations :'),
					h('ul', calculations.map((calc) => {
						return h('li', `Input: ${calc.input}, Output: ${calc.output}`)
					})),
					h('hr',),
					h('div.Drawer_Title', 'Call Participants'),
					h('button.Button', {
						'ev-click': ()=> {
							getParticipants();
						}
					}, 'Display call participants'),
					h('div', `Participant Count: ${participantState.length}`),
					h('div', participantState.map(participant => {
						return h('div',`Participant Name: ${participant.displayName}`)
					})),
					h('hr',),
					h('div.Drawer_Title', 'external api sample'),
					h('p','this is an example for using webhooks to make an external api call'),
					h('button.Button', { 'ev-click': ()=>triggerWebhook() }, 'Perform webhook api call' ),
					h('label','response from webhook call to external api :'),
					h('p', webhookResponse)
				]);
			});
		}
	}
};