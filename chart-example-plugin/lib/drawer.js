import { DRAWER_ID } from './constants'

/**
 * This adds a drawer that is used to display vital statistics
 */
module.exports = (api) => {

	const { h, thunk, DrawerToggle, Tooltip } = api.render;
	const { array } = api.observ;
	const { displayText } = api;

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
		},

		/**
		 * This renders the drawer toggle (button)
		 **/
		renderToggle: (drawerState, active) => {
			return thunk(`${DRAWER_ID}_toggle`, { drawerState, active }, () => {
				return DrawerToggle(DRAWER_ID, {
					label: displayText('View vitals'),
					open: active === DRAWER_ID,
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
				const { queue, recent } = drawerState;
				let items = [];
				return h('div.Drawer_Content', [
					h('div.Drawer_Title', 'Vital Signs'),
					h('div', 'You can add all sorts of elements here, or attach another React component')
				]);
			});
		}
	}
};