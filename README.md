# Spars

[![npm version](https://badge.fury.io/js/spars.svg)](https://badge.fury.io/js/spars)

🌲 A general toolkit for creating interactive web experiences.

## Installation

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
 $ npm install spars
```

## Statement

`Spars` is not a framework but a minimalistic toolkit with a strong focus on creating progressivily enhanced interactive experiences on a wide range of consumer devices. The goal of the toolkit is to empower the developer to focus on the creative process and less on implementation details, repetitive work and browser specific workarounds. The components in the core of the library are things you will likely need when developing an interactive experience, handle edge-cases (like vendor prefixing, experimental feature support testing and fallbacks) or are things that should inspire the developer to make use of more advanced optimisations that one normally does not have the time to implement and test under short deadlines.

## API

I'm well aware that the library is currently lacking a lot of documentation you would need to get started. I'm planning to improve the quality of the documentation over time but for now I would like to point you to the [examples](/examples/index.js) and the [index](/src/index.ts) of the project.

### Analytics

Contains a code snippet to help you set up Google Analytics tracking and reporting of individual events. The reporting of events are optionally throttled using requestIdleCallback which guarantees no interference with higher priority code.

### Audio

Contains an audio manager to help you manage multiple audio sources (`play`, `pause`, `mute`, `unmute`, `fade-in`, `fade-out`, etc..) on each source individually or as a whole (`muteAll`, `unmuteAll`). It also has utility functions to check if the audio context has been unlocked through user interaction and otherwise a transparent interaction layer is put on top of the page to unlock it.

### Caching

Contains code to set up persistent caching using `IndexedDB` and with an in-memory `Map` cache as fallback.

### Constants

Contains constant values (names of exposed events and cookies) used inside of `Spars`.

### Cookies

Contains code to help you with getting and setting cookies.

### Data structures

Contains implementations of [Bitfield](src/dataStructures/Bitfield.ts) and [Deque](src/dataStructures/Deque.ts) data structures.

### Decorators

Contains an implementation of [@Memoize](src/decorators/@Memoize.ts) decorator

### Easings

Contains code to handle all commonly used easings (`easeInQuad`, `easeOutCubic`, etc..).

### Events

Contains code to handle network connection changes, key presses, device orientation changes, document visibility changes and window size changes. It exposes an `EventEmitter` wrapper around [mitt](https://github.com/developit/mitt).

### Features

Contains code to check the support of various browser features (`What extensions are available for WebGL on this device?`, `is requestIdleCallback available in this browser?`), test for browser settings (`Are cookies enabled in this browser?`, `has the user enabled the 'do not track' setting? If so, avoid any tracking analytics.`) and check for certain hardware features (`What pixel density is the screen?`, `How well does the GPU perform on this device? If it is lower quality mobile device I need to make sure to run a reduced quality version of the experience so it still has a good framerate.`).

### Frame scheduler

Contains a scheduler to schedule tasks over multiple frames to avoid dropping below 60 frames per second.

### Frame ticker

Contains code to set up a global `requestAnimationFrame` ticker which fires the `SPARS::FRAME_TICK` event that one can listen to.

### Loaders

Contains code for an [AssetLoader](src/loaders/AssetLoader.ts) used for preloading commonly used assets like binary encoded buffers, images, GPU compressed images, bitmaps, [audiopacks](https://github.com/timvanscherpenzeel/audiopacker), [binpacks](https://github.com/timvanscherpenzeel/binpacker), video, audio, fonts, WebAssembly, JSON, SVG, XML, HTML).

### Polyfills

Contains a `fullscreen` and `pointerlock` polyfill that can be used without having to worry about vendor prefixes.

### Scrolling

Contains some utility functions for smooth scrolling to certain positions on the page and scrolling to top on page unload.

### Settings

Contains code to parse `?key1=value&key2=value` search queries in the URL to override application wide settings. Useful for toggling settings on any device without requiring special builds.

### Thread pool

Contains code to run arbitrary tasks efficiently off of the main thread largely based on the [Task Worklet polyfill](https://github.com/developit/task-worklet/) by [Jason Miller](https://github.com/developit).

`Sticky threads` allow you to use re-usable generic `worklets` (modularized web workers) retrieved from a centralized `sticky thread pool`. In order to maximize concurrency and minimize transfer overhead the library distributes work across multiple threads through an implicit data flow graph that is formed based on how the different tasks are linked.

Results from one task can be directly passed into another task but instead of pulling the result of the first task back to the main thread and sending it to the thread running the second task the second task will instead be routed to the thread that already has the first result ready.

### Utilities

Contains some commonly used utilities (debounce, memoization, hashing strings, creating UUID's, etc..).

## Browser support

`Spars` supports the latest two versions of `evergreen` browsers (not `Internet Explorer 11` and lower):

- Edge
- Firefox
- Chrome
- Chrome Android
- Safari
- iOS Safari

`Spars` does not include any polyfills. It is recommended to use the [polyfill.io](https://polyfill.io/v3/) service in your application.

## Development

```sh
$ yarn start

$ yarn lint

$ yarn test

$ yarn build
```

## Licence

My work is released under the [MIT license](https://raw.githubusercontent.com/TimvanScherpenzeel/spars/master/LICENSE).
