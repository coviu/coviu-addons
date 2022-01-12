import hostDrawer from './lib/hostDrawer';
import guestDrawer from './lib/guestDrawer';
import pluginConfig from './lib/configure';

/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface call plugin API
 */
function plugin(api) {
  return Promise.all([]).then(function () {
    const isHost = api.call.hasOwnerAccess();

    if (isHost) {
      // Registers a drawer for the host
      api.drawers.registerDrawer(hostDrawer(api));
    } else {
      // Registers a drawer for the guest
      api.drawers.registerDrawer(guestDrawer(api));
    }

    return {
      name: 'Coviu Demo Plugin',
    };
  });
}

if (typeof configure !== 'undefined') {
  configure(pluginConfig);
} else if (typeof activate !== 'undefined') {
  activate(plugin);
} else {
  module.exports = plugin;
}
