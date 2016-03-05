---
title: "A one-level game in HTML5"
tags: html5, javascript, game, game engine, canvas, gamepad, path finding, html
date: "2016-01-18 09:21"
---
Here is a little one-level game I did in [HTML5 course][COURSE] on edX:

[<img src="https://github.com/paiv/html5.2x.game/raw/master/img/screenshot.png" width="240" />][GAME]

[https://paiv.github.io/html5.2x.game/][GAME]

[source code][SOURCE]

Everything is hand-crafted, no libs used, in a single (hopefully readable) JavaScript file.

The game engine implements

* gamepad/keyboard input
* canvas blending
* collision detection
* A-star path finding
* sprite sheets
* fog of war

HTML5 features:

* gamepad
* audio context
* canvas
* xhr XMLHttpRequest

Minimized with

* [Google Closure Compiler][GOOCC]
* [TinyPNG][PANDA]


[COURSE]: https://courses.edx.org/courses/course-v1:W3Cx+HTML5.2x+4T2015/info "W3Cx: HTML5.2x HTML5 Part 2: Advanced Techniques for Designing HTML5 Apps"
[GAME]: https://paiv.github.io/html5.2x.game/
[SOURCE]: https://github.com/paiv/html5.2x.game
[GOOCC]: https://developers.google.com/closure/compiler/
[PANDA]: https://tinypng.com/
