---
title: "Solving Synacor Challenge"
tags: [programming, challenge, games, vm, virtual machine, analysis]
date: "2016-04-24 14:49"
thumbnail: true
---

If writing a virtual machine to crawl a dungeon is your kind of game.

The [Synacor Challenge][CHALLENGE] was posted some years ago, but I've stumbled on it only recently, in a comment to [Jeff Atwood's post about programming games][CODING-HORROR].

Many thanks to [Eric Wastl][ERICWASTL] and Synacor who still runs it online.

The challenge starts with you writing a virtual machine, and has a number of steps laid out on a dungeon map. Skills required (or learned on the go): virtual machines, debuggers, disassemblers, reverse engineering, tree search, dungeon crawling.


# SPOILER ALERT

At this point, if you are interested in completing the challenge yourself, stop reading, and have fun coding.


# My notes and code

* [Code repository](https://github.com/paiv/synacor-challenge)


Virtual Machine
---------------

The only thing you are given is a binary image and a spec to virtual machine to run it, so I started coding VM, wondering what kind of game it would be.

The VM spec is straightforward, pay attention to modulo arithmetics. The image runs self-testing routines at boot, so use that as a lazy TDD.

At this point I can run the image and pass self-test:

```sh
./vm challenge.bin
```

The world
---------

This is when the dungeon crawling starts. After learning basic controls and getting codes, I find myself stuck in twisty little passages, which seems like a non-Euclidean space.

After initial attempts to map rooms on paper, I start poking inside the image. For the task, I make a disassembler, pretentiously called IDA, and now can dump the image in assembly form:

```sh
./ida challenge.bin
```

But the image is encrypted, and runs self-decryption at the start. So I dump memory from a running game, and disassemble that.

At this point I think of a proper save and restore from save, and some debugger mechanisms, so I start coding a shell over virtual machine.

```sh
./synacor challenge.bin
```

<img src="{% include page_assets %}/save-load.gif" />


Twisty passages
---------------

Having these basic tools, I find how dungeon rooms are stored in binary, and write code to extract them as a graph:

```sh
./mapper dump.bin
```

<img src="{% include page_assets %}/map.svg" width="320" />


I can see the path now, that was tricky.


Monument
--------

Solving the monument should be easy, and you don't need debugger for that.

With monument solved, I now have a teleporting device.


Teleporting
-----------

The first teleport is automatic, but the second is where the things start be interesting.

The book on teleportation gives enough hints to look inside the code. I upgrade my debugger, and find the register check of the teleporter.

The check function is several lines of code, and should be simple to solve, right? I rewrite the function, removing tail recursion, and it runs happily in console, but not terminating.

Is it stuck? Is it in a dead loop? If I cannot brute-force it, then may be I can reverse it's operation, and solve it, given expected output?

After two days of heart-breaking attempts, I have the motivation to look closer at the function. I rewrite it in a high-level language, and now it's not random jumps, it has a meaning. Analyzing its output on small inputs, the numbers seem to form a sequence, not a (pseudo-) random one.

    3 5 13 32765

And given the minutes it took to compute the fourth number (I'm not patient enough for the next), I type "fast growing sequence", and there it is, [Ackermann function][ACKERMANN]. Well, I didn't expect someone try to compute the Universe on a pocket calculator.

You can find optimized Ackermann in [Rosetta Code][ROSETTA-ACK].

I implement the function, with added twist for third parameter, and brute-force through the numbers. I have the answer in seconds.

Well, lesson learned. Get the true meaning of the function. Analyze actual data.

With teleporting solved, I jump on the beach and walk to vault lock.


Vault Lock
----------

Journal gives general description of the task, and I have all the tools at hand.

I extract data for the vault lock, with room operation and connections. Then I run a tree search to find the shortest solution, no tricks here.

If you are stuck with the mirror, do mirror in Photoshop.


Tools and languages
-------------------

The code is mostly C++. See [code repository](https://github.com/paiv/synacor-challenge)


* [CMake][CMAKE] for building
* [ØMQ][ZEROMQ] for sending commands between shell and virtual machine processes.
* [BigDigits][BIGD] at some point I used arbitrary precision arithmetic, but it is not needed, since all operations are modulo 15 bits
* [GraphViz][WEBGVIZ] to render dungeon map in SVG



[CHALLENGE]: https://challenge.synacor.com/
[ERICWASTL]: https://twitter.com/ericwastl
[CODING-HORROR]: http://blog.codinghorror.com/heres-the-programming-game-you-never-asked-for/
[CMAKE]: https://cmake.org/
[ZEROMQ]: http://zeromq.org/
[BIGD]: http://www.di-mgt.com.au/bigdigits.html
[WEBGVIZ]: http://www.webgraphviz.com/
[ACKERMANN]: https://en.wikipedia.org/wiki/Ackermann_function
[ROSETTA-ACK]: https://rosettacode.org/wiki/Ackermann_function
