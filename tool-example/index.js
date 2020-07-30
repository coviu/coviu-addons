const Promise = require('es6-promise').Promise;
const tool = require('./lib/tool');
const dicts = {
	'de': require('./assets/dictionaries/de.json'),
	'en': require('./assets/dictionaries/en.json'),
	'fr': require('./assets/dictionaries/fr.json'),
	'zh-CN': require('./assets/dictionaries/zh-cn.json')
}

function plugin(api) {
	// Register the dictionaries
	Object.keys(dicts).forEach((k) => {
		api.i18n.registerDictionary(k, dicts[k]);
	});

	return Promise.all([
		api.tools.registerTool(tool(api))
	]).then(function() {
		return {
			name: 'New tool'
		};
	});
}

if (typeof activate !== 'undefined') {
	activate(plugin);
} else {
	module.exports = plugin;
}