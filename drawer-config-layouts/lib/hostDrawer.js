import { DRAWER_ID } from './constants';
import styles from './styles/drawer.module.css';

/**
 * This adds a drawer that is used to display vital statistics
 *
 * api object is provided from Coviu platform when a plugin (AKA addon)
 * is activated and it provides methods that allow plugin to interact with
 * the call and other resources on coviu platform
 */
export default (api) => {
  // extract mercury (h)& thunk instances  for use in plugin ui rendering
  // extract DrawerToggle & DrawerHelp to use for drawer rendering
  const { h, thunk, DrawerToggle, Tooltip, DrawerHelp } = api.render;
  const { array, value } = api.observ;
  const { displayText } = api;

  // Initialize state for  counter & calculations
  const counterState = value(1);
  const calculationsState = array([]);

  // Initialize state for call participants
  const callParticipantsState = array([]);

  //Initialize state for webhook response
  const webhookCallResponse = value({});

  // define a function for retriving participants using the api.call.participants() method
  const getParticipants = () => {
    const participants = api.call.participants();
    // call set method on state variable notifies api.observe of state change
    // note : using direct assignment as in (callParticipantsState = api.call.participants()) will not notify state change
    callParticipantsState.set(participants);
  };

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
    return api.webhooks
      .trigger('addons-demo-webhook')
      .then((resp) => {
        console.error('webhook resoonse', resp);
        webhookCallResponse.set(resp.data);
        console.error('webhook webhookCallResponse', webhookCallResponse);
      })
      .catch((err) => {
        console.error('webhook error', err);
        state.status.set('error');
      });
  };

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
      drawerData.put('webhookResponse', webhookCallResponse);
      // Hook up to receive incoming view calculations
      api.mesh.request('view-calculation').then((calculations) => {
        // Listen for new calculations
        calculations.set.on('add', (calculation) => {
          calculationsState.push(calculation.state);
        });
      });
    },

    /**
     * This renders the drawer toggle (button)
     **/
    renderToggle: (drawerState, active) => {
      return thunk(`${DRAWER_ID}_toggle`, { drawerState, active }, () => {
        return DrawerToggle(
          DRAWER_ID,
          {
            notify: drawerState.calculations.length,
            label: displayText('View Calculations'),
            open: active === DRAWER_ID,
            className: styles.DrawerToggle,
          },
          () => {
            if (active !== DRAWER_ID) {
              api.drawers.open(DRAWER_ID);
            } else {
              api.drawers.close(DRAWER_ID);
            }
          }
        );
      });
    },

    /**
     * Renders the drawer
     **/
    renderDrawer: (drawerState, active) => {
      return thunk(DRAWER_ID, { drawerState }, () => {
        const {
          counter,
          calculations,
          participantState,
          webhookResponse,
        } = drawerState;
        console.log('drawer State => ', drawerState);
        return h('div.Drawer_Content', [
          h('div.Drawer_Title', displayText('Sample Code')),
          DrawerHelp('About this drawer', [
            'You can add all sorts of elements here - premade components, as well as custom ones',
          ]),
          h(`div.${styles.card}`, [
            h(
              'button.Button',
              {
                'ev-click': () => counterState.set(counter + 1),
              },
              'Increment'
            ),
            h(`p`, `Current count: ${counter}`),
          ]),
          h(`div.${styles.card}`, [
            h('h3', 'Calculation from Guest:'),
            h(
              'div',
              calculations !== 'undefined'
                ? calculations.map((calc) => {
                    return h(
                      `p`,
                      `Input: ${calc.input}, Output: ${calc.output}`
                    );
                  })
                : 'no calculations generated by call guest to dipslay'
            ),
          ]),
          h(`div.${styles.card}`, [
            h(
              'button.Button',
              {
                'ev-click': () => {
                  getParticipants();
                },
              },
              'Display call participants'
            ),
            h(
              'div',
              participantState !== 'undefined'
                ? participantState.map((participant, i) => {
                    return h(
                      'div',
                      `Participant ${i + 1}: ${participant.displayName}`
                    );
                  })
                : 'no participants to display , click display participants button to show current participants'
            ),
          ]),
          h(`div.${styles.card}`, [
            DrawerHelp('WebHooks', [
              h(
                'p',
                `as an external dev in order to test webhooks, You would need to raise a ticket on link below for Coviu dev team to add webhook config as shown in documentaion and sample code`
              ),
              h(
                'a.Link.-underline.-pleasant',
                {
                  href:
                    'https://coviu.atlassian.net/servicedesk/customer/portal/8/group/13/create/10120',
                  target: '_blank',
                },
                displayText('webhook register request')
              ),
            ]),
            h(
              'button.Button',
              { 'ev-click': () => triggerWebhook() },
              'Call webhook api'
            ),
            h('p', webhookResponse),
          ]),
        ]);
      });
    },
  };
};
