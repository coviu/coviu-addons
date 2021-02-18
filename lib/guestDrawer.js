const { DRAWER_ID } = require('./constants')
const styles = require('./styles/drawer.module.scss');

/**
 * This adds a drawer that is used to display vital statistics
 */
module.exports = (api) => {

	const { h, thunk, DrawerToggle, Tooltip, DrawerHelp } = api.render;
	const { array, value } = api.observ;
	const { displayText } = api;

	const counterState = value(1);
	const calculationsState = array([]);

	const state = api.observ.state({
		input: value(undefined),
		output: value(undefined)
	});

	// Load our WebAssembly API
	const wasmApi = WebAssembly.instantiateStreaming(fetch('https://plugins.coviu.com/examples/wasm/test.wasm')).then(({ instance, module }) => {
		return { squarer: instance.exports._Z7squareri };
	});

	const mesh = api.mesh.request('view-calculation');

	const calculate = () => Promise.all([wasmApi, mesh]).then(([{ squarer }, calculations]) => {
		const input = Math.floor(Math.random() * 1000);
		const output = squarer(input)
		state.input.set(input);
		state.output.set(output)

		// Add a record of the calculation to our view calculations mesh
		calculations.add({ input, output, by: api.local.id() });
	});

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
				const { calculations } = drawerState;
				const { input, output } = state();

				console.log("Debug Demo Plugin input and output", input, output);

				return h('div.Drawer_Content', [
					h('div.Drawer_Title', 'Sample Code'),
					DrawerHelp('About this drawer', ['You can add all sorts of elements here - premade components, as well as custom ones']),
					h(`div.${styles.card}`, [
						h('button.Button', {
							'ev-click': () => calculate()
						}, 'Calculate'),
						output ? h('p', `[Using WebAssembly] ${input} * ${input} = ${output}`) : undefined,
					]),
				]);
			});
		}
	}
};