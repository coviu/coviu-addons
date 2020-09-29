const { DRAWER_ID } = require('./constants')
const styles = require('./styles/drawer.module.scss');

/**
 * This adds a drawer that is used to display vital statistics
 */
module.exports = (api) => {

	const { h, thunk, DrawerToggle, Tooltip, DrawerHelp } = api.render;
	const { array } = api.observ;
	const { displayText } = api;

	const counterState = api.observ.value(1);
	const calculationsState = array([]);

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
				const { counter, calculations } = drawerState;
				let items = [];
				return h('div.Drawer_Content', [
					h('div.Drawer_Title', 'Calculations'),
					DrawerHelp('About this drawer', ['You can add all sorts of elements here - premade components, as well as custom ones']),
					h('div', `Current count: ${counter}`),
					h('button.Button', {
						'ev-click': () => counterState.set(counter + 1)
					}, 'Increment'),
					h('label', 'Guest Calculations'),
					h('ul', calculations.map((calc) => {
						return h('li', `Input: ${calc.input}, Output: ${calc.output}`)
					})),
					h('select.Input.SelectInput', {
						'ev-change': ev => {
							const selected = ev.target.value;
							if (selected === 'Increment') {
								counterState.set(counter + 1);
							} else {
								counterState.set(counter - 1);
							}
						}
					}, [
						h('option', 'Increment'),
						h('option', 'Decrement')
					])
				]);
			});
		}
	}
};