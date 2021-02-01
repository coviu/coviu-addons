const styles = require('./styles/view.module.scss');

/**
  This is an example precall flow view
 **/
module.exports = (api) => {

	const { value } = api.observ;
	const { h } = api.render;

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

		console.log('calculations', calculations);

		// Add a record of the calculation to our view calculations mesh
		calculations.add({ input, output, by: api.local.id() });
	});

	return {
		name: 'precall-view',
		phase: 'precall',
		order: 1000,

		/**
		  Looks at the flow context and determines if this flow
		  is able to operate
		 **/
		required: (context) => {
			// Only show this for guest users
			return !api.call.hasOwnerAccess();
		},

		/**
		  This is called when this view becomes the active view
		 **/
		view: (viewApi) => {

			// Setup any requirements that we have for this view
			let listeners = [];
			// Removes any state listeners that we might have
			const removeListeners = () => listeners.map(l => l());

			// We can call proceed when we are done with this view, and want the call flow to resume
			const proceed = () => {
				removeListeners();
				viewApi.next();
			}

			// This listener is a simple helper method that will cause any updates to the local view state that is declared
			// to cause a re-render of the view
			listeners.push(state(viewApi.touch));

			// This function will get called everytime that our view requires a refresh
			return () => {
				const { input, output } = state();
				return h(`div.${styles.ExamplePage}`, [
					h(`div.${styles.Contents}`, [
						h('p', 'This is a pre-call custom view.'),
						h('p', 'This will appear before any requests to join the call are made.'),
						output ? h('p', `[Using WebAssembly] ${input} * ${input} = ${output}`) : undefined
					]),
					h(`div.${styles.Buttons}`, [
						h('button.Button.-outline', {
							'ev-click': () => {
								calculate()								
							}
						}, 'Calculate'),
						h('button.Button', {
							'ev-click': proceed
						}, 'Continue')
					])
				])	
			}
		}
	}
}