# TopologyThingy

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Project Details

### Topology

The project uses d3.js for creating the topology diagram. I've created a `TopologyComponet` which can be seen at `./src/app/components/topology`, this coponent has a few inputs that we can use for minimal customization:

- nodes: the boxes of the topology
- links: the links between the boxes
- nodeSize: the size of the boxes
- nodePadding: padding inside the box, so its text is cool
- margin: the distance the boxes should keep on dragging

And an output:

- nodeClick: this sends an emit if the box was clicked, and sends back its details

### Node Form

With the `NodeFormComponent` we can add, edit and delete nodes and their links. For this, I used Material to save some time.

### Fake Api

For providing a base example and handle data I created the `FakeApiService`, it works via signals, and provides the `nodes` and `links`.

### Tests

I tried to include a few unit tests here and there, I wouldn't have had time to finish all of them unfortunatelly.

They can be run with `yarn test` as mentioned above.

### Possible future improvements

- Handle better adding new nodes, right now it adds every new node to a fixed position
- On update keep position
- Make two-way connections more obvious
