# State Scenegraph

[![Build Status](https://travis-ci.org/dakom/state-scenegraph.svg?branch=master)](https://travis-ci.org/dakom/state-scenegraph)

## [Live Demo](https://dakom.github.io/state-scenegraph)

This example uses a full copy of an old drift-utils package to build an interactive scene graph

Flatbuffer serialization and the JSX/State/Lens utilities were deprecated well before this release, but this was the last public demo built and the source for all that _should_ work (though the tests weren't ported over after some changes)

Most of the other stuff has been refactored and split into standalone, smaller packages (e.g. [webgl-simple](https://github.com/dakom/webgl-simple), [input-funnel](https://github.com/dakom/input-funnel), etc.)

What follows are some of the docs/thoughts on this experiment in particular, with focus on the general idea of using lenses with the StateElement construct.

# What is a "StateElement" ?

The core idea of StateElements is to allow describing a tree structure with JSX - but one which is completely generic and can be passed around as pure data.

Kindof like an interface between pure data, react, and things that are inherently tree-like.

Some specific use-cases:

* Treatment as scene graph
* Serializing into flatbuffers
* Mapping and walking for passing to third parties

In order to facilitate writing StateElements as JSX, you need a transpiler that supports mapping it to `createElement` in the style of React, but not `React.createElement` itself.

The following `tsconfig.json` settings accomplish this in Typescript:

```
"jsx": "react",
"jsxFactory": "createElement",
```

# Conclusion

This is an interesting way to use nothing other than standard functional utils and a dab of JSX to drive a WebGL scene. If the structure of the state is more-or-less known in advance (e.g. to define the lenses upfront), and there aren't too many different types of events that can cause updates, this technique can be used to efficiently drive a very large application.

However, in order to keep track of changes between updates, _everything_ gets stored in the state. This can get quite messy if the structure of the state is hard to predict or lots of temporary data needs to be pushed through the pipeline. When that happens, I found myself missing reactive frameworks - and once there's already a graph structure in place (wether it be FRP or a component tree), it tends to contradict the approach taken here.
