# View and Drawer Example Plugin

This plugin provides an example for how to add a new view to the call flow, as well as how to add a drawer to the call interface. 

It will also show how to create a mesh set to share data between peers.

It also shows how to load a WebAssembly module and use it.

## Components

### Pre-call view

Located in `lib/view.js`, this view shows the basics of how a call view is defined. This view is setup to be shown to guests before they enter the call. By clicking the `Calculate` button, they can perform the calculation of the square of a random integer (the calculation being performed in a WebAssembly module), with the resulting output being stored in the mesh for later transmission to the other participants of the call.

### Drawer

Located in `lib/drawer.js`, this shows had to add a new drawer to the call interface. In this case, the drawer provides some basic UI elements, and will also show the output of the calculations from the participants in the call.

### Styling

Styling for the components is performed using CSS Modules, with the styles being built into the final Javascript artifacts as part of the Webpack build process.

Because the styles will be given generated names, they can be referenced by requiring the module, and then using the appopripate property to access the generated class name.

## Building

To build the plugin, you will need Node.js (12+ preferred) and NPM installed. Then:

1. Install the dependencies using `npm install`

2. Build the plugin using `npm run build`

## Serving

You can serve the plugin locally using `npm run serve`. This will serve the built plugin at `http://localhost:9100/plugin.js`

## Loading into Coviu

1. Register sandbox account via [service desk](https://coviu.atlassian.net/servicedesk/customer/portal/8/group/13/create/10118) with pre-defined addon setting

2. Login into your sandbox account, trigger a call (e.g. room or waiting area) launching local addon at `http://localhost:9100/plugin.js`. 
