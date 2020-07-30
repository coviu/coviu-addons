# Tool Plugin Template

This provides a base template for creating a Coviu plugin that adds a tool component to the resource controls.

## Building
To build the plugin, you will need Node.js (6+ preferred) and NPM installed. Then:

Install the dependencies using npm install

Build the plugin using npm run build

## Serving
You can serve the plugin locally using npm run serve. This will serve the built plugin at http://localhost:9100/plugin.js

### Loading into Coviu
Pre-defined development plugin
If you have a pre-configured development plugin attached to your account, it will attempt to load the plugin artifacts from a path on your local machine.

If this is the case, simply run npm run serve, and the plugin will be loaded when you access a room path in your team.

### Manual addition
Loading of the plugin into Coviu can be achieved through the chat debug interface. Note that in order to use this interface, each peer that you are wishing to load the plugin for must pass in the forceinsecure=true query parameter in the room URL string.

This parameter allows for plugins loaded via the chat interface to access the protected parts of the plugin API, such as the document and navigator.

To load, type /plugin [url to plugin] in the chat text input and hit enter.

## Some tips to get you started

- To add your plugin to the UI for development, see coviu-ui/client/burger/plugins/readme.md
- If you are developing a resource and not a tool, the `coviu-stripe-payments-resource-plugin` is a good, small example.  You 
will probably be interested in:
  - `api.resources.registerDocument`
  - `api.resources.registerHandler`
    - `handler.add` is run when the resource is added, but only for the adder
      - `cache.setBuffer` can be used to set the bytes of the document, if the cache is created with `isDocument: true`
      - `cache.progress.set(percentage);` can be used to show the user the loading progress.
      - (deprecated) `resources.methods.transact(id, function(resource, done))` can be used to update resource information
       (`metadata`, 
      `options`, etc.) to all peers.
        - only JSON-serializable data will be transmitted (e.g., not promises)
        - be sure to call `done()` after updating the information locally
      - `resource.metadata.title` is what appears in the resources list
      - `resource.status` can be set to `pending` to show a waiting/progress indicator, or `active` to hide it
    - `handler.disable` and `handler.enable` are called when a resource is deactivated or activated and **may be called multiple
     times** 
    - `handler.setup` is run on all peers (including the adder) when the resource is added
      - if you need to change something in the `resource`, like `resource.metadata.foo`, be sure to commit it to the mesh with
       something like:
       ```js
       resources.methods.transact(item.id, (resource, done) => {
        resource.metadata.sections = evaluation.getSections();
        return done();
       });
       ```
  - `api.resources.registerRenderer`
    - `renderer.canAdd` can be set to `api.call.hasOwnerAccess` to allow only the owner of the call to add the resource
    - `renderer.activate` is run when the resource is added, but only for the adder
      - should call `api.resources.add`
    - `renderer.renderCustomInterface` can be set to ...
    - `renderer.view` can be set to return a function that returns a widget.  The video plugin has a simple example.
    - `renderer.controls` can be set to display adidtional tools
      - `api.resources.transaction(id, function(item, done))` can be used to update item information (`options`, etc.) to all peers.
        - only JSON-serializable data will be transmitted (e.g., not promises)
        - be sure to call `done()` after updating the information locally
    - `renderer.label` is what appears as an addable resource (i.e., in the available resources list)
- If you are using `coviu-document` for rendering, know that `resource.options.page` is used for which page to display (e.g., in a 
pdf).  Pages start from `1`.
    - `doc` in `PdfWidget` is a resource, so you can pass options through `resource.options` and callbacks through `cache.doc
    .callback` (`updateCanvas` being an example)
- If you need to expose `coviu-ui` functionality for use in your plugin, edit `coviu-ui/client/burger/plugins/api.js` and make a 
pull request.  Try not to use `resources.methods`
