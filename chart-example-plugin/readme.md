# Chart Example Plugin

This plugin provides an example for how a React application could be embedded inside of a Coviu resource plugin, as well
as how to share data across the mesh (for low throughput values) and using the event stream.

The charting libraries is purely for demonstration purposes, and alternate charting implementations can be used as necessary.

## Components

### Chart resource

This plugin adds a Chart Example resource to the available list of call resources. When added to the call, this resource will display a constantly updating chart using some example ECG data.

The resource consists of three parts:

#### The resource handler (lib/resourceHandler.js)
This is responsible for defining how resources of a given type behave. When the Coviu call interface detects a resource with a given type being added to the synchronized state that is the Coviu call context (this allows for resources added on one peer to be synced to the other call peers), it looks for a resource handler which provides the implementation for that particular resource type.

The methods for this handler will be called when a number of situations occur, such as when a resource is added by a user, when the resource is needing to be setup or destroyed, or when it is enabled/disabled as the active resource in the call.

In the case of the Chart Example resource, the resource handler is doing a couple of key things:

1. When the resource is being setup for the first time, it will create a local resource cache (which can be used by a resource to store local, non synchronized working state), and then initializes data capture and a React application that will then be mounted as part of the render process.
2. Starts/stop the data capture as necessary depending on whether the chart is active or not

#### The resource renderer (lib/resourceRenderer.js)
This is responsible for implementing how a resource is rendered when the resource is the active resource. How the renderer is implemented will depend upon the requirements for your plugin as there are a couple of ways that a renderer can work.

In particular, renderers can render either a standard resource view, or a custom interface.

In the case of a standard resource view, resource renderers are rendered into the Coviu resource container, which allows for resources to take advantage of native Coviu functionality such as auto-scaling of the resources (this helps with ensuring that callers are viewing the same content across multiple devices), the resource toolbar, annotations, and support for layers.

If a renderer is implementing a standard view, then the renderer needs to implement the `view` function.

In the case of some resources however (such as this plugin), they might wish to have more control over the rendering interface (at the cost of losing the native functionality). In this case, a resource renderer needs to do two things:
1. Implement the `requiresCustomResource` renderer function, and have it return true
2. Implement the `renderCustomInterface` renderer function which will render the custom interface.

In the case of this plugin, the `renderCustomInterface` function implemented by the renderer is simply designed to attach the React application to the resource container element.

#### The resource document (lib/resourceDocument.js)
Resources are required to implement a resource document implementation. This is designed to help Coviu understand how to understand the context of the document your resource is rendering. While in most cases this is a very simple placeholder file, this does allow for resources to expose multi-page documents (such as PDFs, multi page whiteboards, etc) that Coviu can automatically page though and allow annotations to be stored against the correct page.

### Drawer

Located in `lib/drawer.js`, this shows had to add a new drawer to the call interface. 

### Styling

Styling for the components is performed using CSS Modules, with the styles being built into the final Javascript artifacts as part of the Webpack build process.

Because the styles will be given generated names, they can be referenced by requiring the module, and then using the appopripate property to access the generated class name.

## Building

To build the plugin, you will need Node.js (6+ preferred) and NPM installed. Then:

1. Install the dependencies using `npm install`

2. Build the plugin using `npm run build`

## Serving

You can serve the plugin locally using `npm run serve`. This will serve the built plugin at `http://localhost:9100/plugin.js`

## Loading into Coviu

### Pre-defined development plugin

If you have a pre-configured development plugin attached to your account, it will attempt to load the plugin artifacts from a path on your local machine.

If this is the case, simply run `npm run serve`, and the plugin will be loaded when you access a room path in your team.
